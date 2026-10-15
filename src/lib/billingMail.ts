import { sendMail } from "@/lib/mail";

// 課金の成功・失敗メール（Stripe・PayPal 共通）
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
export async function sendReceiptEmail(to: string, amount: number, dateStr: string, receiptUrl?: string | null) {
  const receiptLink = receiptUrl
    ? `<p style="margin:20px 0;"><a href="${receiptUrl}" style="display:inline-block;background:#e2c87d;color:#0f0a1e;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">領収書（PDF）を見る</a></p>`
    : "";
  await sendMail(to, "【世界の占い堂】お支払い完了のお知らせ（領収書）", mailShell(
      "お支払いありがとうございます",
      `<table style="width:100%;font-size:14px;color:#e5e7eb;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#9ca3af;">商品</td><td style="padding:6px 0;text-align:right;">世界の占い堂</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">金額</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#e2c87d;">¥${amount.toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">お支払い日</td><td style="padding:6px 0;text-align:right;">${dateStr}</td></tr>
      </table>
      ${receiptLink}
      <p style="color:#9ca3af;font-size:13px;">引き続き世界中の占いをお楽しみください。</p>`
  ));
}

// 課金失敗メール
export async function sendFailureEmail(to: string, amount: number) {
  await sendMail(to, "【世界の占い堂】お支払いに失敗しました", mailShell(
      "お支払いを確認できませんでした",
      `<p style="color:#e5e7eb;font-size:14px;">月額 ¥${amount.toLocaleString()} のお支払いが完了しませんでした。カードの有効期限切れや残高不足が考えられます。</p>
      <p style="margin:20px 0;"><a href="${process.env.NEXT_PUBLIC_URL}/api/billing-portal" style="display:inline-block;background:#e2c87d;color:#0f0a1e;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;">お支払い情報を更新する</a></p>
      <p style="color:#9ca3af;font-size:13px;">お支払いが確認できない状態が続くと、サービスのご利用が停止されます。お早めにご確認ください。</p>`
  ));
}
