import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "missing session_id" }, { status: 400 });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ waiting: true });
  }

  const email = (session.metadata?.email || session.customer_email || "").toLowerCase();
  const supabase = getSupabase();

  // 決済直後にカード名義（本名）を保存（webhookの遅延に備えた確実化）
  const payerName = session.customer_details?.name || null;
  if (email && payerName) {
    await supabase.from("uranai_users").update({ name: payerName }).eq("email", email);
  }

  const { data } = await supabase
    .from("uranai_users")
    .select("access_token")
    .eq("email", email)
    .single();

  if (data?.access_token) {
    const res = NextResponse.json({ loggedIn: true });
    res.cookies.set("uranai_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }
  return NextResponse.json({ waiting: true });
}
