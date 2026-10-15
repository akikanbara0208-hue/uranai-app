import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { activatePaypalUser, getPaypalSubscription, verifyPaypalWebhook } from "@/lib/paypal";
import { sendReceiptEmail, sendFailureEmail } from "@/lib/billingMail";

const GRACE_MS = 7 * 24 * 60 * 60 * 1000; // proxy.ts の猶予と同じ

async function emailBySubscription(
  supabase: ReturnType<typeof getSupabase>,
  subscriptionId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("uranai_users")
    .select("email")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  return data?.email ? data.email.toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  if (!(await verifyPaypalWebhook(req.headers, body))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const type: string = event.event_type;
  const resource = event.resource || {};
  const supabase = getSupabase();

  // 契約開始 → 有料会員に
  if (type === "BILLING.SUBSCRIPTION.ACTIVATED") {
    await activatePaypalUser(resource);
  }

  // 課金成功（初回＋毎月の更新）→ 未払いフラグ解除＋領収書メール
  if (type === "PAYMENT.SALE.COMPLETED" && resource.billing_agreement_id) {
    const subId: string = resource.billing_agreement_id;
    await supabase.from("uranai_users")
      .update({ subscription_status: "active", payment_failed_at: null })
      .eq("stripe_subscription_id", subId);
    const email = await emailBySubscription(supabase, subId);
    if (email) {
      const amount = Math.round(Number(resource.amount?.total ?? 0));
      const dateStr = new Date(resource.create_time ?? Date.now()).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
      await sendReceiptEmail(email, amount, dateStr, null);
    }
  }

  // 課金失敗 → 未払い起点を記録（既に記録済みなら上書きしない）＋失敗メール
  if (type === "BILLING.SUBSCRIPTION.PAYMENT.FAILED") {
    const subId: string = resource.id;
    await supabase.from("uranai_users")
      .update({ payment_failed_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subId)
      .is("payment_failed_at", null);
    const email = await emailBySubscription(supabase, subId);
    if (email) {
      const amount = Math.round(Number(resource.billing_info?.outstanding_balance?.value ?? 980));
      await sendFailureEmail(email, amount);
    }
  }

  // 解約 → 支払い済みの期間（次の請求日まで）は使えるようにする。
  // 列を増やさないため、payment_failed_at を「次の請求日 − 猶予7日」に置き、
  // proxy.ts の猶予切れ判定で次の請求日に締め出す
  if (type === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subId: string = resource.id;
    let until = Date.parse(resource.billing_info?.next_billing_time ?? "");
    if (Number.isNaN(until)) {
      try {
        const sub = await getPaypalSubscription(subId);
        until = Date.parse(sub.billing_info?.next_billing_time ?? "");
      } catch { /* 取れなければ即時終了 */ }
    }
    if (!Number.isNaN(until) && until > Date.now()) {
      await supabase.from("uranai_users")
        .update({ payment_failed_at: new Date(until - GRACE_MS).toISOString() })
        .eq("stripe_subscription_id", subId);
    } else {
      await supabase.from("uranai_users")
        .update({ subscription_status: "canceled" })
        .eq("stripe_subscription_id", subId);
    }
  }

  // 未払いが続いて停止・期限切れ → 締め出す
  if (type === "BILLING.SUBSCRIPTION.SUSPENDED" || type === "BILLING.SUBSCRIPTION.EXPIRED") {
    await supabase.from("uranai_users")
      .update({ subscription_status: "canceled" })
      .eq("stripe_subscription_id", resource.id);
  }

  return NextResponse.json({ ok: true });
}
