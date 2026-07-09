import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe, FREE_LIMIT } from "@/lib/stripe";
import { loginResponse } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスが無効です" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上にしてください" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const supabase = getSupabase();
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: existing } = await supabase
    .from("uranai_users")
    .select("id, plan, subscription_status, password_hash, access_token")
    .eq("email", normalizedEmail)
    .single();

  // 既にパスワード登録済み → ログインへ誘導
  if (existing?.password_hash) {
    return NextResponse.json(
      { error: "このメールアドレスは登録済みです。ログインしてください" },
      { status: 409 }
    );
  }

  // 既存の有効ユーザー（旧OTPユーザー等）がパスワード未設定 → パスワードを後付けして即ログイン
  if (existing && (existing.plan === "free" || existing.subscription_status === "active")) {
    const token = existing.access_token || randomUUID();
    await supabase
      .from("uranai_users")
      .update({ password_hash: passwordHash, access_token: token })
      .eq("email", normalizedEmail);
    return loginResponse(token, { plan: existing.plan });
  }

  // 新規登録 → 無料枠チェック
  const { count } = await supabase
    .from("uranai_users")
    .select("*", { count: "exact", head: true })
    .eq("plan", "free");
  const freeCount = count ?? 0;

  if (freeCount < FREE_LIMIT) {
    const token = randomUUID();
    await supabase.from("uranai_users").upsert(
      {
        email: normalizedEmail,
        plan: "free",
        subscription_status: "active",
        password_hash: passwordHash,
        access_token: token,
      },
      { onConflict: "email" }
    );
    return loginResponse(token, { plan: "free", freeRemaining: FREE_LIMIT - freeCount - 1 });
  }

  // 有料枠 → パスワードを保存してからStripe Checkoutへ
  await supabase.from("uranai_users").upsert(
    {
      email: normalizedEmail,
      plan: "pending",
      subscription_status: "pending",
      password_hash: passwordHash,
      access_token: existing?.access_token || randomUUID(),
    },
    { onConflict: "email" }
  );

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

  return NextResponse.json({ checkoutUrl: session.url });
}
