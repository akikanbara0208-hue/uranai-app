import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { activatePaypalUser, getPaypalSubscription } from "@/lib/paypal";

function loggedIn(token: string) {
  const res = NextResponse.json({ loggedIn: true });
  res.cookies.set("uranai_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

// PayPal から戻ってきたとき（?subscription_id=I-xxx）
async function confirmPaypal(subscriptionId: string) {
  const sub = await getPaypalSubscription(subscriptionId);
  if (sub.status !== "ACTIVE") {
    return NextResponse.json({ waiting: true });
  }
  // Stripe側と同じく、URLの漏えいで第三者がログインできないよう作成から30分で打ち切る
  const ageMs = Date.now() - Date.parse(sub.create_time ?? "");
  if (!(ageMs <= 30 * 60 * 1000)) {
    return NextResponse.json(
      { error: "この決済リンクの有効期限が切れています。ログイン画面からお進みください。" },
      { status: 410 }
    );
  }
  // Webhookの遅延に備え、ここでも有料会員にする（何度呼んでも同じ結果）
  const token = await activatePaypalUser(sub);
  return token ? loggedIn(token) : NextResponse.json({ waiting: true });
}

export async function GET(req: NextRequest) {
  const subscriptionId = req.nextUrl.searchParams.get("subscription_id");
  if (subscriptionId) return confirmPaypal(subscriptionId);

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "missing session_id" }, { status: 400 });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ waiting: true });
  }

  // このAPIはsession_idだけでログインCookieを発行するため、URLがブラウザ履歴や
  // アクセスログから漏れると第三者が本人としてログインできてしまう。
  // 決済直後のリダイレクト以外では使えないよう、発行から30分で受け付けを打ち切る
  const ageSec = Math.floor(Date.now() / 1000) - (session.created ?? 0);
  if (ageSec > 30 * 60) {
    return NextResponse.json(
      { error: "この決済リンクの有効期限が切れています。ログイン画面からお進みください。" },
      { status: 410 }
    );
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

  if (data?.access_token) return loggedIn(data.access_token);
  return NextResponse.json({ waiting: true });
}
