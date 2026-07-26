import type { FortuneResult } from "./types";

const APP_URL = "https://uranai-app-beta-ten.vercel.app";
const HEADER = (title: string) => `🔮 世界の占い堂で占ってみた！\n\n✨ ${title}\n\n`;
const FOOTER = "\n\n#世界の占い堂 #占い";

// X（Twitter）は全角・絵文字などASCII以外の文字を2文字分としてカウントする
function weightedLength(text: string): number {
  let length = 0;
  for (const ch of Array.from(text)) {
    length += ch.codePointAt(0)! > 0x7f ? 2 : 1;
  }
  return length;
}

// サロゲートペア（絵文字等)を途中で切断しないよう、コードポイント単位で切り詰める
function truncateToWeight(text: string, maxWeight: number): { text: string; truncated: boolean } {
  const chars = Array.from(text);
  let weight = 0;
  let result = "";
  for (const ch of chars) {
    const w = ch.codePointAt(0)! > 0x7f ? 2 : 1;
    if (weight + w > maxWeight) {
      return { text: result, truncated: true };
    }
    weight += w;
    result += ch;
  }
  return { text: result, truncated: false };
}

// 各SNSでシェア用テキストを組み立てる。X無料プランの文字数制限に収まるよう、
// 全体の重み付き文字数がTARGET_WEIGHTに収まるまでsummaryを切り詰める
export function buildShareText(
  result: Pick<FortuneResult, "title" | "summary">,
  { includeUrl }: { includeUrl: boolean }
): string {
  const TARGET_WEIGHT = 140;
  const header = HEADER(result.title);
  const footer = FOOTER + (includeUrl ? `\n${APP_URL}` : "");
  const fixedWeight = weightedLength(header) + weightedLength(footer) + 2; // 2 = 「…」の重み分の予約
  const budget = Math.max(0, TARGET_WEIGHT - fixedWeight);

  const { text: summary, truncated } = truncateToWeight(result.summary, budget);
  return `${header}${summary}${truncated ? "…" : ""}${footer}`;
}

export function buildXShareUrl(result: Pick<FortuneResult, "title" | "summary">): string {
  const text = buildShareText(result, { includeUrl: false });
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(APP_URL)}`;
}

export function buildThreadsShareUrl(result: Pick<FortuneResult, "title" | "summary">): string {
  const text = buildShareText(result, { includeUrl: true });
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`;
}
