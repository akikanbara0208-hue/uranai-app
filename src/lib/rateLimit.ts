// 簡易レート制限（プロセス内メモリ）。
// DBのスキーマを変えずに総当たり・連続送信を抑えるための第一防衛線。
// サーバーレスでは実行インスタンスごとに独立し、再起動でも消えるため完全な保証にはならない。
// より厳密に守るならDB側にカウンタ列を持たせる必要がある（スキーマ変更が必要）。

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

// 古いエントリが溜まり続けないよう、参照時に期限切れを掃除する
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}

/**
 * 指定キーの試行を1回分記録し、上限を超えていないか判定する。
 * @returns allowed=false なら上限超過。retryAfterSec は解除までの秒数。
 */
export function hitRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  sweep(now);
  const cur = buckets.get(key);
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  cur.count += 1;
  if (cur.count > limit) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** 認証成功時など、カウンタを明示的に消したいとき */
export function clearRateLimit(key: string) {
  buckets.delete(key);
}

/** リクエスト元IP（プロキシ経由を考慮）。取れない場合は "unknown" */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
