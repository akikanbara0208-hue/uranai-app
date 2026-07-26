import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/gate",
  "/payment-success",
  "/payment-cancel",
  "/api/payment-confirm",
  "/legal",
  "/api/login",
  "/api/signup",
  "/api/logout",
  "/api/billing-portal",
  "/api/auth",
  "/api/send-otp",
  "/api/verify-otp",
  "/api/stripe",
  "/api/cron",
  "/_next",
  "/favicon",
];

const SUPABASE_URL = "https://hbcnaflwtjtcgpucunvg.supabase.co";
const GRACE_MS = 7 * 24 * 60 * 60 * 1000; // 課金失敗後の猶予：7日

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // パブリックパスは通過
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("uranai_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  // DBで契約状態を検証（解約・未払い切れをブロック）
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/uranai_users?access_token=eq.${encodeURIComponent(token)}&select=plan,subscription_status,payment_failed_at`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    const rows = await res.json();
    const u = Array.isArray(rows) ? rows[0] : null;

    if (!u) {
      return NextResponse.redirect(new URL("/gate", req.url));
    }
    const active = u.plan === "free" || u.subscription_status === "active";
    if (!active) {
      return NextResponse.redirect(new URL("/gate?expired=1", req.url));
    }
    // 課金失敗から7日経過しても未対応ならブロック
    if (u.payment_failed_at) {
      const failedMs = Date.parse(u.payment_failed_at);
      if (!Number.isNaN(failedMs) && Date.now() - failedMs > GRACE_MS) {
        return NextResponse.redirect(new URL("/gate?overdue=1", req.url));
      }
    }
    return NextResponse.next();
  } catch {
    // 検証に失敗したら締め出す（fail-closed：keepalive cronでSupabase一時停止は防止済みのため、
    // 検証不能な状態を無条件で通すより安全側に倒す）
    return NextResponse.redirect(new URL("/gate?verify_error=1", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
