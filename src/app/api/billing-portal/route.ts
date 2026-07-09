import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

// ログイン中ユーザーをStripeカスタマーポータル（解約・支払い管理）へ送る
export async function GET(req: NextRequest) {
  const token = req.cookies.get("uranai_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("uranai_users")
    .select("plan, stripe_customer_id")
    .eq("access_token", token)
    .single();

  // 無料ユーザー等、Stripe契約が無い場合は解約対象なし
  if (!user || !user.stripe_customer_id) {
    return NextResponse.redirect(new URL("/?billing=none", req.url));
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    configuration: process.env.STRIPE_PORTAL_CONFIG_ID,
    return_url: `${process.env.NEXT_PUBLIC_URL}/`,
  });

  return NextResponse.redirect(session.url);
}
