import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mail";
import { hitRateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスが無効です" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 無制限に送れると、任意のアドレスへのメール送りつけと送信料の浪費が可能になる。
  // 同一宛先は3分に1通まで、同一IPからは10分に10通までに抑える
  const byEmail = hitRateLimit(`otp-send:${normalizedEmail}`, 1, 3 * 60 * 1000);
  const byIp = hitRateLimit(`otp-send-ip:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!byEmail.allowed || !byIp.allowed) {
    const retry = Math.max(byEmail.retryAfterSec, byIp.retryAfterSec);
    return NextResponse.json(
      { error: `認証コードを送信したばかりです。${retry}秒ほどおいてからお試しください。` },
      { status: 429, headers: { "Retry-After": String(retry) } }
    );
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10分

  const supabase = getSupabase();

  // 既存ユーザーかどうかに関わらずOTPを更新／保存
  const { data: existing } = await supabase
    .from("uranai_users")
    .select("id")
    .eq("email", normalizedEmail)
    .single();

  if (existing) {
    await supabase
      .from("uranai_users")
      .update({ otp_code: code, otp_expires_at: expires.toISOString() })
      .eq("email", normalizedEmail);
  } else {
    // 仮レコード（plan未定）として保存
    await supabase.from("uranai_users").insert({
      email: normalizedEmail,
      plan: "pending",
      access_token: crypto.randomUUID(),
      otp_code: code,
      otp_expires_at: expires.toISOString(),
      subscription_status: "pending",
    });
  }

  await sendMail(normalizedEmail, "【世界の占い堂】認証コード", `
      <div style="background:#0f0a1e;color:#e2c87d;padding:40px;font-family:sans-serif;max-width:480px;margin:0 auto;border-radius:12px;">
        <h1 style="font-size:20px;margin-bottom:8px;">世界の占い堂</h1>
        <p style="color:#9ca3af;font-size:14px;margin-bottom:24px;">以下の認証コードを入力してください（10分間有効）</p>
        <div style="background:#1a1033;border:1px solid #e2c87d33;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e2c87d;">${code}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;">心当たりがない場合は無視してください。</p>
      </div>
    `);

  return NextResponse.json({ sent: true });
}
