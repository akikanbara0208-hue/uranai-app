import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/gate?error=google_not_configured", req.url));
  }

  const state = randomUUID();
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  // CSRF対策：stateをCookieに保存してcallbackで照合
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
