import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { sendReceiptEmail, sendFailureEmail } from "@/lib/billingMail";


// 請求書からメールアドレスを特定（無ければstripe_customer_idでDB照会）
async function resolveEmail(
  supabase: ReturnType<typeof getSupabase>,
  customerEmail: string | undefined,
  customerId: string | undefined
): Promise<string | null> {
  if (customerEmail) return customerEmail.toLowerCase();
  if (!customerId) return null;
  const { data } = await supabase
    .from("uranai_users")
    .select("email")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.email ? data.email.toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = (session.metadata?.email || session.customer_email || "").toLowerCase();
    if (!email) return NextResponse.json({ ok: true });

    const token = randomUUID();
    // 決済時のカード名義（本名）を取得して保存
    const payerName = session.customer_details?.name || null;
    const patch: Record<string, unknown> = {
      email,
      plan: "paid",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: "active",
      access_token: token,
      payment_failed_at: null,
    };
    if (payerName) patch.name = payerName;
    await supabase.from("uranai_users").upsert(patch, { onConflict: "email" });
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    // active/trialing/past_due は実質有効として扱う（past_dueはStripe再試行中の猶予）。
    // 完全に切れた（canceled/unpaid/incomplete_expired）場合のみブロック。
    const allowed = ["active", "trialing", "past_due"];
    const status = allowed.includes(sub.status) ? "active" : "canceled";
    const patch: Record<string, unknown> = { subscription_status: status };
    if (sub.status === "active" || sub.status === "trialing") patch.payment_failed_at = null;
    await supabase.from("uranai_users")
      .update(patch)
      .eq("stripe_subscription_id", sub.id);
  }

  // 課金成功（初回＋毎月の更新）→ 領収書メール＋未払いフラグ解除
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as { customer?: string; customer_email?: string; amount_paid?: number; created?: number; hosted_invoice_url?: string };
    const email = await resolveEmail(supabase, invoice.customer_email, invoice.customer);
    await supabase.from("uranai_users")
      .update({ subscription_status: "active", payment_failed_at: null })
      .eq("stripe_customer_id", invoice.customer || "");
    if (email) {
      const amount = invoice.amount_paid ?? 0;
      const dateStr = new Date((invoice.created ?? 0) * 1000).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
      await sendReceiptEmail(email, amount, dateStr, invoice.hosted_invoice_url);
    }
  }

  // 課金失敗 → 失敗メール＋未払い起点を記録（既に記録済みなら上書きしない＝1週間の起点を固定）
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as { customer?: string; customer_email?: string; amount_due?: number };
    const email = await resolveEmail(supabase, invoice.customer_email, invoice.customer);
    await supabase.from("uranai_users")
      .update({ payment_failed_at: new Date().toISOString() })
      .eq("stripe_customer_id", invoice.customer || "")
      .is("payment_failed_at", null);
    if (email) {
      await sendFailureEmail(email, invoice.amount_due ?? 0);
    }
  }

  return NextResponse.json({ ok: true });
}
