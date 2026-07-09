import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { loginResponse } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const supabase = getSupabase();

  const { data: user } = await supabase
    .from("uranai_users")
    .select("plan, subscription_status, password_hash, access_token")
    .eq("email", normalizedEmail)
    .single();

  if (!user || !user.password_hash) {
    return NextResponse.json(
      { error: "登録が見つかりません。新規登録してください" },
      { status: 404 }
    );
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "メールアドレスかパスワードが違います" }, { status: 401 });
  }

  // 有効ユーザー → ログイン成立
  if (user.plan === "free" || user.subscription_status === "active") {
    return loginResponse(user.access_token, { plan: user.plan });
  }

  // 退会・未決済 → 再課金のためCheckoutへ
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: normalizedEmail,
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/gate?canceled=1`,
    locale: "ja",
    metadata: { email: normalizedEmail },
  });
  return NextResponse.json({ checkoutUrl: session.url, reason: "subscription_inactive" });
}
