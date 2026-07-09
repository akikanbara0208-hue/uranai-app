import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe, FREE_LIMIT } from "@/lib/stripe";
import { randomUUID } from "crypto";

// ログイン成立時：Cookieを焼いてトップへリダイレクト
function redirectLoggedIn(req: NextRequest, token: string) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("uranai_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  res.cookies.delete("g_oauth_state");
  return res;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get("g_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/gate?error=oauth", req.url));
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`;

  // 1. 認可コード → アクセストークン
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/gate?error=oauth", req.url));
  }

  // 2. ユーザー情報取得
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await userRes.json();
  const email = (profile.email || "").toLowerCase().trim();
  if (!email || !profile.email_verified) {
    return NextResponse.redirect(new URL("/gate?error=oauth", req.url));
  }

  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("uranai_users")
    .select("plan, subscription_status, access_token")
    .eq("email", email)
    .single();

  // 既存の有効ユーザー → そのままログイン
  if (user && (user.plan === "free" || user.subscription_status === "active")) {
    return redirectLoggedIn(req, user.access_token || randomUUID());
  }

  // 新規 → 無料枠チェック
  if (!user || user.plan !== "pending") {
    const { count } = await supabase
      .from("uranai_users")
      .select("*", { count: "exact", head: true })
      .eq("plan", "free");
    if ((count ?? 0) < FREE_LIMIT) {
      const token = user?.access_token || randomUUID();
      await supabase.from("uranai_users").upsert(
        { email, plan: "free", subscription_status: "active", access_token: token },
        { onConflict: "email" }
      );
      return redirectLoggedIn(req, token);
    }
  }

  // 有料枠 → 仮レコードを用意してStripe Checkoutへ
  await supabase.from("uranai_users").upsert(
    {
      email,
      plan: "pending",
      subscription_status: "pending",
      access_token: user?.access_token || randomUUID(),
    },
    { onConflict: "email" }
  );
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/gate?canceled=1`,
    locale: "ja",
    metadata: { email },
  });
  const res = NextResponse.redirect(session.url!);
  res.cookies.delete("g_oauth_state");
  return res;
}
