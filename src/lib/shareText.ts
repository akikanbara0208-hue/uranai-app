import type { FortuneResult } from "./types";
import { FORTUNES } from "./fortunes";

const APP_URL = "https://uranai-app-beta-ten.vercel.app";
// 見た人が「自分もやってみたい」と思えるよう、占術の多さと問いかけを添える。
// 件数は増減しても自動で追従させる（過去に「15種類」の固定値が残っていたため）
const CTA = `${FORTUNES.length}種類の占いから、あなたは何が出る？`;
const TAGS = "#世界の占い堂 #占い";

// 投稿先ごとの上限。
// X: 全角を2文字分として数え、上限は280単位（＝日本語140文字）。
// Threads/コピー: 500文字（コードポイント数。全角も1文字として数える）。
const LIMITS = {
  x:       { total: 280, weighted: true  },
  threads: { total: 500, weighted: false },
  copy:    { total: 500, weighted: false },
} as const;

// XではURLがt.coに短縮され、実際の長さに関わらず一律23単位として数えられる
const X_URL_UNITS = 23;

export type SharePlatform = keyof typeof LIMITS;

// 見出しに使う本文の最低確保量。タイトルが長くても鑑定文が消えないようにする
const MIN_SUMMARY = 40;
// 見出し（share／title）に割り当てる上限
const MAX_HEADLINE = 76;
// シェア文に載せる本文の目安（文字数）。投稿先の上限とは別に、読みやすさのために
// ここで区切る。上限まで詰め込むと「全文貼り付け」になり、シェアとして読まれない
const BODY_TARGET = 100;

// 鑑定文を、文の切れ目（。！？）でだけ終わるように要約する。
// 「体が軽く、スタミナに満ちてい…」のような尻切れは読み手に何も伝わらないので、
// 1文すら収まらないときの最終手段としてだけ切り詰める。
// weighted=false なら文字数、true ならXの重み付き単位で測る
function summarize(text: string, max: number, weighted: boolean): string {
  if (measure(text, weighted) <= max) return text;
  let acc = 0, head = "", cut = -1, quote = 0;
  for (const ch of Array.from(text)) {
    const w = weighted ? (ch.codePointAt(0)! > 0x7f ? 2 : 1) : 1;
    if (acc + w > max) break;
    acc += w;
    head += ch;
    // 鉤括弧の中の「？」で切ると、引用した質問の途中で終わってしまう
    // （例：タロットの「仕事はうまくいく？ ← ここで切れる）
    if (ch === "「" || ch === "『") quote++;
    else if (ch === "」" || ch === "』") quote = Math.max(0, quote - 1);
    else if (quote === 0 && (ch === "。" || ch === "！" || ch === "？")) cut = head.length;
  }
  if (cut > 0) return head.slice(0, cut);
  return truncate(text, max, weighted);
}

// 占術そのものの解説にあたる項目。読み手が知りたいのは「その人に何が出たか」なので、
// シェア本文には使わない（例：十二直の「十二直とは」、占星術の「ハウスの意味（参考資料）」）
const EXPLAINER_LABEL = /(とは|について|の説明|参考資料|基礎知識|歴史|読み方|内訳|原産地|旧暦)/;

// シェア本文に載せる文章を選ぶ。
// summaryは占術によって性質がばらばらで、
//   ・見出し相当で意味がない（易経「䷥ Opposition ─ 属性：乖違」）
//   ・占術の由来説明で結果が入っていない（ジプシーカード）
// といった例があるため、まず「結果を語っている詳細項目」を探し、無ければsummaryに戻す

// アプリ画面では意味を持つが、シェア文に貼ると「[███░░░ +52%]」のような
// 文字化けにしか見えない装飾を落とす（バイオリズムのゲージ等）
function stripDecorations(text: string): string {
  return text
    .replace(/\[?[█░]+[^\]\n]*\]?/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

// 入力された悩みは本人以外には見せたくない情報なので、それを引用した文はシェアに載せない。
// 鑑定文は質問を丸ごとではなく先頭だけ引用することがある（例：`q.slice(0, 40)`）ため、
// 完全一致ではなく先頭の一部が含まれるかで判定する
function quotesQuestion(text: string, question?: string): boolean {
  const q = (question ?? "").split("|")[0].trim();
  const chars = Array.from(q);
  if (chars.length < 4) return false;
  return text.includes(chars.slice(0, 10).join(""));
}

// 括弧や区切りが開いたまま終わると読みづらいので、切り詰めた末尾を整える
function trimDangling(text: string): string {
  return text.replace(/[\s　（(「『【〈《［[・、，,／/…—─ー-]+$/u, "");
}

// シェア本文の候補を、載せたい順に並べて返す。
// 呼び出し側が上限に収まるかを見て選べるよう、1つに絞らずすべて返す
function bodyCandidates(result: ShareInput): string[] {
  const out: string[] = [];
  const title = `${result.title ?? ""} ${result.share ?? ""}`;
  for (const d of result.details ?? []) {
    if (EXPLAINER_LABEL.test(d.label ?? "")) continue;
    const c = stripDecorations((d.content ?? "").trim());
    // 装飾を落としたうえで、鑑定文として読める長さがあるものだけを採用する
    if (Array.from(c).length < 30) continue;
    // 入力された悩みを引用している文は、公開投稿に相談内容が載ってしまうので使わない
    if (quotesQuestion(c, result.question)) continue;
    // 何についての鑑定なのかが分からないと読み手に伝わらないので、見出しも短く添える
    // （「（23日周期）」のような補足は場所を取るだけなので落とす）
    const head = (d.label ?? "").replace(/（[^）]*）/g, "").trim();
    // 見出しの実体（絵文字を除いた部分）がタイトルに入っているなら、重ねても情報が増えない
    const plain = head.replace(/^[^\p{L}\p{N}]+/u, "");
    const useHead = head && Array.from(head).length <= 14 && !(plain && title.includes(plain));
    out.push(useHead ? `${head}：${c}` : c);
  }
  const summary = stripDecorations((result.summary ?? "").trim());
  if (summary && !quotesQuestion(summary, result.question)) out.push(summary);
  // 悩みを引用する占術（タロット・ルーン等）は詳細もsummaryも全滅することがある。
  // adviceは問いを引用しないので、最後の受け皿として残しておく
  const advice = stripDecorations((result.advice ?? "").trim());
  if (advice && !quotesQuestion(advice, result.question)) out.push(advice);
  return out;
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

type ShareInput = Pick<FortuneResult, "title" | "summary"> & {
  share?: string;
  advice?: string;
  details?: { label?: string; content: string }[];
  /** 入力された悩み。これを引用した鑑定文はシェア文から除外する */
  question?: string;
};

export function buildShareText(
  result: ShareInput,
  platform: SharePlatform,
  fortuneId?: string
): string {
  const { total, weighted } = LIMITS[platform];

  // 何の占いをしたのかが分からないと読み手が試しようがないため、占術名を明示する
  const fortuneName = FORTUNES.find((f) => f.id === fortuneId)?.name;
  const lead = fortuneName ? `世界の占い堂で「${fortuneName}」を占ってみた！` : "世界の占い堂で占ってみた！";

  // 誘い文 → リンク → 空行 → ハッシュタグ の順。リンクはタグに埋もれず単独行に置く
  // （Xのintentに&urlを渡すと本文末尾＝タグの後ろに連結されてしまうので、本文に含める）
  const footerHead = `\n\n${CTA}\n`;
  const footerTail = `\n\n${TAGS}`;
  const footer = `${footerHead}${APP_URL}${footerTail}`;
  const urlUnits = weighted ? X_URL_UNITS : measure(APP_URL, weighted);
  const fixed =
    measure(`${lead}\n\n`, weighted) +
    measure(footerHead, weighted) + urlUnits + measure(footerTail, weighted);
  let budget = total - fixed;

  // 見出しには、その人固有の結果を一目で伝える share を優先して使う。
  // titleは「5枚スプレッド」「今日のバイオリズム」のように占術の枠組みを述べるだけのことが多く、
  // 見た人が「自分は何が出るんだろう」と思う材料にならない
  // 見出しにも悩みが混ざらないようにする（占術を追加したときの取りこぼし対策）
  const safe = (t: string) => (t && !quotesQuestion(t, result.question) ? t : "");
  const headline = safe((result.share ?? "").trim()) || safe(result.title);
  const headlineBudget = Math.max(0, Math.min(MAX_HEADLINE, budget - MIN_SUMMARY - 2));
  const truncated = truncate(headline, headlineBudget, weighted);
  const clipped = truncated === headline ? truncated : `${trimDangling(truncated.replace(/…$/, ""))}…`;
  // shareは「引いたのは正義」のように文として読めるので括弧で囲まず、そのまま置く
  const headlineLine = clipped ? (result.share ? `${clipped}\n` : `【${clipped}】\n`) : "";
  budget -= measure(headlineLine, weighted);

  // まず読みやすい長さへ要約し、そのうえで投稿先の上限にも文末で収める。
  // 尻切れ（末尾が「…」）になる候補は読んでも何も伝わらないので、
  // 文として言い切れる項目が他にあればそちらを優先する
  let body = "";
  for (const candidate of bodyCandidates(result)) {
    const text = summarize(summarize(candidate, BODY_TARGET, false), budget, weighted);
    if (!body) body = text;
    if (!text.endsWith("…")) { body = text; break; }
  }

  return `${lead}\n\n${headlineLine}${body}${footer}`;
}

export function buildXShareUrl(result: ShareInput, fortuneId?: string): string {
  const text = buildShareText(result, "x", fortuneId);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function buildThreadsShareUrl(result: ShareInput, fortuneId?: string): string {
  const text = buildShareText(result, "threads", fortuneId);
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`;
}
