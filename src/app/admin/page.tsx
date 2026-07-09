import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { FREE_LIMIT, PRICE_JPY } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

type UserRow = {
  email: string;
  plan: string | null;
  subscription_status: string | null;
  created_at: string | null;
};

export default async function AdminPage() {
  const token = (await cookies()).get("uranai_token")?.value;
  if (!token) redirect("/gate");

  const supabase = getSupabase();
  const { data: me } = await supabase
    .from("uranai_users")
    .select("email")
    .eq("access_token", token)
    .single();

  if (!me || !ADMIN_EMAILS.includes((me.email || "").toLowerCase())) {
    redirect("/");
  }

  const { data: rows } = await supabase
    .from("uranai_users")
    .select("email, plan, subscription_status, created_at")
    .order("created_at", { ascending: false });

  const users: UserRow[] = rows || [];
  const freeCount = users.filter((u) => u.plan === "free").length;
  const paidCount = users.filter(
    (u) => u.plan === "paid" && u.subscription_status === "active"
  ).length;
  const pendingCount = users.filter((u) => u.plan === "pending").length;
  const canceledCount = users.filter(
    (u) => u.subscription_status === "canceled"
  ).length;
  const mrr = paidCount * PRICE_JPY;

  const fmtDate = (s: string | null) =>
    s
      ? new Date(s).toLocaleString("ja-JP", {
          dateStyle: "short",
          timeStyle: "short",
          timeZone: "Asia/Tokyo",
        })
      : "—";

  const planBadge = (u: UserRow) => {
    if (u.plan === "free") return <span className="text-green-400">無料</span>;
    if (u.plan === "paid" && u.subscription_status === "active")
      return <span className="text-yellow-400">有料</span>;
    if (u.subscription_status === "canceled")
      return <span className="text-red-400">解約済</span>;
    return <span className="text-gray-500">未完了</span>;
  };

  return (
    <div className="mystical-bg min-h-screen text-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-yellow-500/60 text-xs tracking-[0.3em]">ADMIN</p>
            <h1 className="text-2xl font-bold gold-text">管理ダッシュボード</h1>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-yellow-400 transition">
            ← アプリへ戻る
          </Link>
        </div>

        {/* 指標カード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="総登録者" value={`${users.length}人`} />
          <Stat
            label="無料枠"
            value={`${freeCount} / ${FREE_LIMIT}`}
            sub={`残り${Math.max(0, FREE_LIMIT - freeCount)}枠`}
          />
          <Stat label="有料会員" value={`${paidCount}人`} />
          <Stat label="月間売上(MRR)" value={`¥${mrr.toLocaleString()}`} />
        </div>

        <div className="flex gap-4 text-xs text-gray-500 mb-4">
          <span>未完了（決済途中）: {pendingCount}</span>
          <span>解約済: {canceledCount}</span>
        </div>

        {/* ユーザー一覧 */}
        <div className="card-mystical rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/10">
                <th className="px-4 py-3 font-medium">メール</th>
                <th className="px-4 py-3 font-medium">プラン</th>
                <th className="px-4 py-3 font-medium">登録日時</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-white/5">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{planBadge(u)}</td>
                  <td className="px-4 py-3 text-gray-400">{fmtDate(u.created_at)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    まだ登録者がいません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-600 mt-6">
          決済・返金・解約の詳細操作は Stripe ダッシュボードで行えます。この画面は閲覧用の概況です。
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-mystical rounded-xl p-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold gold-text">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
