import type { FortuneResult } from "./types";
import { FORTUNES } from "./fortunes";

const APP_URL = "https://uranai-app-beta-ten.vercel.app";
const LEAD = "世界の占い堂で占ってみた！";
// 見た人が「自分もやってみたい」と思えるよう、占術の多さと問いかけを添える。
// 件数は増減しても自動で追従させる（過去に「15種類」の固定値が残っていたため）
const CTA = `${FORTUNES.length}種類の占いから、あなたは何が出る？`;
const TAGS = "#世界の占い堂 #占い";

// 投稿先ごとの上限。
// X: 全角を2文字分として数え、上限は280単位（＝日本語140文字）。URLはt.coにより
//    一律23単位として計上されるため、その分をあらかじめ差し引く。
// Threads: 500文字（コードポイント数。全角も1文字として数える）。URLは本文に含める。
const LIMITS = {
  x:       { total: 280, weighted: true,  reserveForUrl: 24, includeUrl: false },
  threads: { total: 500, weighted: false, reserveForUrl: 0,  includeUrl: true  },
  copy:    { total: 500, weighted: false, reserveForUrl: 0,  includeUrl: true  },
} as const;

export type SharePlatform = keyof typeof LIMITS;

// 見出しに使う本文の最低確保量。タイトルが長くても鑑定文が消えないようにする
const MIN_SUMMARY = 40;
// タイトルに割り当てる上限
const MAX_TITLE = 60;
// シェア文に載せる本文の目安（文字数）。投稿先の上限とは別に、読みやすさのために
// ここで区切る。上限まで詰め込むと「全文貼り付け」になり、シェアとして読まれない
const BODY_TARGET = 80;
// 文の途中で切らずに済ませたいので、句点がこの位置以降にあればそこで区切る
const BODY_MIN_SENTENCE = 30;

// 鑑定文を、なるべく文の切れ目（。！？）で終わるように要約する。
// weighted=false なら文字数、true ならXの重み付き単位で測る
function summarize(text: string, max: number, weighted: boolean): string {
  if (measure(text, weighted) <= max) return text;
  const ellipsis = measure("…", weighted);
  let acc = 0, head = "";
  for (const ch of Array.from(text)) {
    const w = weighted ? (ch.codePointAt(0)! > 0x7f ? 2 : 1) : 1;
    if (acc + w > max - ellipsis) break;
    acc += w;
    head += ch;
  }
  // 収まる範囲で最後に現れる文末を探し、そこで綺麗に閉じる
  let cut = -1;
  for (const mark of ["。", "！", "？"]) {
    cut = Math.max(cut, head.lastIndexOf(mark));
  }
  if (cut >= BODY_MIN_SENTENCE) return head.slice(0, cut + 1);
  return head + "…";
}

function measure(text: string, weighted: boolean): number {
  if (!weighted) return Array.from(text).length;
  let n = 0;
  for (const ch of Array.from(text)) n += ch.codePointAt(0)! > 0x7f ? 2 : 1;
  return n;
}

// サロゲートペア（絵文字等）を途中で切断しないよう、コードポイント単位で切り詰める
function truncate(text: string, max: number, weighted: boolean): string {
  if (max <= 0) return "";
  if (measure(text, weighted) <= max) return text;
  // 末尾に付ける「…」自身も全角1文字（重み付けでは2単位）を消費するため、その分を残す
  const ellipsis = measure("…", weighted);
  let acc = 0, out = "";
  for (const ch of Array.from(text)) {
    const w = weighted ? (ch.codePointAt(0)! > 0x7f ? 2 : 1) : 1;
    if (acc + w > max - ellipsis) break;
    acc += w;
    out += ch;
  }
  return out + "…";
}

export function buildShareText(
  result: Pick<FortuneResult, "title" | "summary">,
  platform: SharePlatform
): string {
  const { total, weighted, reserveForUrl, includeUrl } = LIMITS[platform];

  const footer = `\n\n${CTA}\n${TAGS}` + (includeUrl ? `\n${APP_URL}` : "");
  const fixed = measure(`${LEAD}\n\n`, weighted) + measure(footer, weighted) + reserveForUrl;
  let budget = total - fixed;

  // タイトルと本文で予算を分け合う。タイトルが長い場合はタイトル側を削り、
  // 鑑定文が丸ごと消えることがないようにする
  const titleBudget = Math.max(0, Math.min(MAX_TITLE, budget - MIN_SUMMARY - 2));
  const title = truncate(result.title, titleBudget, weighted);
  const titleLine = title ? `【${title}】\n` : "";
  budget -= measure(titleLine, weighted);

  // まず読みやすい長さへ要約し、そのうえで投稿先の上限にも文末で収める
  const summary = summarize(summarize(result.summary, BODY_TARGET, false), budget, weighted);

  return `${LEAD}\n\n${titleLine}${summary}${footer}`;
}

export function buildXShareUrl(result: Pick<FortuneResult, "title" | "summary">): string {
  const text = buildShareText(result, "x");
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(APP_URL)}`;
}

export function buildThreadsShareUrl(result: Pick<FortuneResult, "title" | "summary">): string {
  const text = buildShareText(result, "threads");
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`;
}
