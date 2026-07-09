import { createClient } from "@supabase/supabase-js";

const URL = "https://hbcnaflwtjtcgpucunvg.supabase.co";

export function getSupabase() {
  return createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
