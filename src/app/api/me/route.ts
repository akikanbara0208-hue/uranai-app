import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("uranai_token")?.value;
  if (!token) return NextResponse.json({ loggedIn: false, isAdmin: false });

  const supabase = getSupabase();
  const { data } = await supabase
    .from("uranai_users")
    .select("email, plan, name")
    .eq("access_token", token)
    .single();

  if (!data) return NextResponse.json({ loggedIn: false, isAdmin: false });

  return NextResponse.json({
    loggedIn: true,
    isAdmin: ADMIN_EMAILS.includes((data.email || "").toLowerCase()),
    plan: data.plan,
    name: data.name || null,
  });
}
