import { NextRequest, NextResponse } from "next/server";

// CookieはhttpOnlyなのでサーバー側で削除し、ゲートへ戻す
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/gate", req.url));
  res.cookies.delete("uranai_token");
  return res;
}
