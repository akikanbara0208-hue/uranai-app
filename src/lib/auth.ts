import { NextResponse } from "next/server";

// ログイン用トークンをサーバー側でCookieに焼き込む（proxyが確実に読めるようにする）
export function loginResponse(token: string, extra: Record<string, unknown> = {}) {
  const res = NextResponse.json({ loggedIn: true, ...extra });
  res.cookies.set("uranai_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1年
  });
  return res;
}
