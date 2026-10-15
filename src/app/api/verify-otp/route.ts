import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { FREE_LIMIT } from "@/lib/stripe";
import { createPaypalCheckout } from "@/lib/paypal";
import { hitRateLimit, clearRateLimit, clientIp } from "@/lib/rateLimit";

// ログイン用トークンをサーバー側でCookieに焼き込む（proxyが確実に読めるようにする）
function loginResponse(token: string, extra: Record<string, unknown>) {
  const res = NextResponse.json({ loggedIn: true, ...extra });
  res.cookies.set("uranai_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) {
    return NextResponse.json({ error: "入力が不正です" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 6桁の数字コードは総当たりが現実的なため、宛先・送信元の2つの軸で試行回数を制限する
  const byEmail = hitRateLimit(`otp-verify:${normalizedEmail}`, 5, 10 * 60 * 1000);
  const byIp = hitRateLimit(`otp-verify-ip:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!byEmail.allowed || !byIp.allowed) {
    const retry = Math.max(byEmail.retryAfterSec, byIp.retryAfterSec);
    return NextResponse.json(
      { error: "認証の試行回数が上限に達しました。しばらく時間をおいてからお試しください。" },
      { status: 429, headers: { "Retry-After": String(retry) } }
    );
  }

  const supabase = getSupabase();

  const { data: user } = await supabase
    .from("uranai_users")
    .select("id, otp_code, otp_expires_at, plan, access_token, subscription_status")
    .eq("email", normalizedEmail)
    .single();

  if (!user) {
    return NextResponse.json({ error: "メールアドレスが見つかりません" }, { status: 404 });
  }
  if (user.otp_code !== code) {
    return NextResponse.json({ error: "認証コードが違います" }, { status: 400 });
  }
  if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
    return NextResponse.json({ error: "認証コードの有効期限が切れています" }, { status: 400 });
  }

  // 正しいコードを入力できた時点で、そのメールアドレスの試行回数はリセットする
  clearRateLimit(`otp-verify:${normalizedEmail}`);

  // OTP消費
  await supabase
    .from("uranai_users")
    .update({ otp_code: null, otp_expires_at: null })
    .eq("email", normalizedEmail);

  // 既存の有効ユーザー
  if (user.plan === "free" || user.subscription_status === "active") {
    return loginResponse(user.access_token, { plan: user.plan });
  }

  // 初回登録 → 無料枠チェック
  const { count } = await supabase
    .from("uranai_users")
    .select("*", { count: "exact", head: true })
    .eq("plan", "free");

  const freeCount = count ?? 0;

  if (freeCount < FREE_LIMIT) {
    const token = crypto.randomUUID();
    await supabase
      .from("uranai_users")
      .update({ plan: "free", access_token: token, subscription_status: "active" })
      .eq("email", normalizedEmail);
    return loginResponse(token, { plan: "free", freeRemaining: FREE_LIMIT - freeCount - 1 });
  }

  // 有料枠 → PayPal の申し込み画面
  const checkoutUrl = await createPaypalCheckout(normalizedEmail);

  return NextResponse.json({ checkoutUrl });
}
