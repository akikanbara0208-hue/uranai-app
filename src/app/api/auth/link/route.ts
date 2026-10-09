import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// 引っ越しのお知らせメールのリンクから来たところ。押すだけでログインできる（1回かぎり・期限つき）。
// リンクの合言葉は認証コードと同じ欄（otp_code）に入れてある。使ったら消す
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  const code = req.nextUrl.searchParams.get("code");
  const gate = new URL("/gate", process.env.NEXT_PUBLIC_URL);
  if (!email || !code || code.length < 32) return NextResponse.redirect(gate);

  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("uranai_users")
    .select("otp_code, otp_expires_at, plan, access_token, subscription_status")
    .eq("email", email)
    .single();

  const valid =
    user &&
    user.otp_code === code &&
    user.otp_expires_at &&
    new Date(user.otp_expires_at) > new Date() &&
    (user.plan === "free" || user.subscription_status === "active");
  if (!valid) return NextResponse.redirect(gate);

  await supabase.from("uranai_users").update({ otp_code: null, otp_expires_at: null }).eq("email", email);

  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL));
  res.cookies.set("uranai_token", user.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
