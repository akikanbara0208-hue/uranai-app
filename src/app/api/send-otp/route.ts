import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスが無効です" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
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

  await resend.emails.send({
    from: "世界の占い堂 <noreply@resend.dev>",
    to: normalizedEmail,
    replyTo: "akika.rainbow@gmail.com",
    subject: "【世界の占い堂】認証コード",
    html: `
      <div style="background:#0f0a1e;color:#e2c87d;padding:40px;font-family:sans-serif;max-width:480px;margin:0 auto;border-radius:12px;">
        <h1 style="font-size:20px;margin-bottom:8px;">世界の占い堂</h1>
        <p style="color:#9ca3af;font-size:14px;margin-bottom:24px;">以下の認証コードを入力してください（10分間有効）</p>
        <div style="background:#1a1033;border:1px solid #e2c87d33;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e2c87d;">${code}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;">心当たりがない場合は無視してください。</p>
      </div>
    `,
  });

  return NextResponse.json({ sent: true });
}
