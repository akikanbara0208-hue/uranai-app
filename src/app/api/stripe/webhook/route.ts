import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { Resend } from "resend";

const FROM = "世界の占い堂 <noreply@resend.dev>";
const REPLY_TO = "akika.rainbow@gmail.com"; // お客さんの返信はここに届く

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

function mailShell(title: string, bodyHtml: string) {
  return `
    <div style="background:#0f0a1e;color:#e2c87d;padding:40px;font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:12px;">
      <h1 style="font-size:20px;margin:0 0 4px;">世界の占い堂</h1>
      <p style="color:#9ca3af;font-size:13px;margin:0 0 24px;">WORLD DIVINATION</p>
      <h2 style="font-size:17px;color:#fff;margin:0 0 16px;">${title}</h2>
      ${bodyHtml}
      <p style="color:#6b7280;font-size:11px;margin-top:28px;border-top:1px solid #ffffff1a;padding-top:16px;">
        このメールは送信専用です。ご不明な点は akika.rainbow@gmail.com までご連絡ください。
      </p>
    </div>`;
}

// 領収書代わりの課金成功メール
async function sendReceiptEmail(resend: Resend, to: string, amount: number, dateStr: string, receiptUrl?: string | null) {
  const receiptLink = receiptUrl
    ? `<p style="margin:20px 0;"><a href="${receiptUrl}" style="display:inline-block;background:#e2c87d;color:#0f0a1e;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">領収書（PDF）を見る</a></p>`
    : "";
  await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: "【世界の占い堂】お支払い完了のお知らせ（領収書）",
    html: mailShell(
      "お支払いありがとうございます",
      `<table style="width:100%;font-size:14px;color:#e5e7eb;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#9ca3af;">商品</td><td style="padding:6px 0;text-align:right;">世界の占い堂</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">金額</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#e2c87d;">¥${amount.toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">お支払い日</td><td style="padding:6px 0;text-align:right;">${dateStr}</td></tr>
      </table>
      ${receiptLink}
      <p style="color:#9ca3af;font-size:13px;">引き続き世界中の占いをお楽しみください。</p>`
    ),
  });
}

// 課金失敗メール
async function sendFailureEmail(resend: Resend, to: string, amount: number) {
  await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: "【世界の占い堂】お支払いに失敗しました",
    html: mailShell(
      "お支払いを確認できませんでした",
      `<p style="color:#e5e7eb;font-size:14px;">月額 ¥${amount.toLocaleString()} のお支払いが完了しませんでした。カードの有効期限切れや残高不足が考えられます。</p>
      <p style="margin:20px 0;"><a href="https://uranai-app-beta-ten.vercel.app/api/billing-portal" style="display:inline-block;background:#e2c87d;color:#0f0a1e;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">お支払い情報を更新する</a></p>
      <p style="color:#9ca3af;font-size:13px;">お支払いが確認できない状態が続くと、サービスのご利用が停止されます。お早めにご確認ください。</p>`
    ),
  });
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
  const resend = new Resend(process.env.RESEND_API_KEY!);

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
      await sendReceiptEmail(resend, email, amount, dateStr, invoice.hosted_invoice_url);
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
      await sendFailureEmail(resend, email, invoice.amount_due ?? 0);
    }
  }

  return NextResponse.json({ ok: true });
}
