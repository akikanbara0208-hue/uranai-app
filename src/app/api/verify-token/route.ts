import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("uranai_token")?.value;
  if (!token) return NextResponse.json({ valid: false }, { status: 401 });

  const supabase = getSupabase();
  const { data } = await supabase
    .from("uranai_users")
    .select("plan, subscription_status")
    .eq("access_token", token)
    .single();

  if (!data) return NextResponse.json({ valid: false }, { status: 401 });
  if (data.plan === "free" || data.subscription_status === "active") {
    return NextResponse.json({ valid: true, plan: data.plan });
  }
  return NextResponse.json({ valid: false, reason: "subscription_inactive" }, { status: 402 });
}
