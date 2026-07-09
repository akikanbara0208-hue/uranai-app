import { FortuneResult } from "@/lib/types";

// ══════════════════════════════════════════════
// トランプ占い（カートマンシー）
// 52枚のトランプの伝統的な意味で、あなたの問いを占う。引くたびに結果が変わる。
// ══════════════════════════════════════════════

const SUITS = [
  { mark: "♥", name: "ハート", theme: "愛情・感情・人間関係", tone: 1 },
  { mark: "♦", name: "ダイヤ", theme: "金銭・現実・成果", tone: 1 },
  { mark: "♣", name: "クラブ", theme: "仕事・成長・行動", tone: 1 },
  { mark: "♠", name: "スペード", theme: "試練・思考・変化（要注意）", tone: -1 },
];
const RANKS = [
  { label: "A", key: "始まり・大きな力・原点" },
  { label: "2", key: "対・選択・パートナーシップ" },
  { label: "3", key: "発展・創造・広がり" },
  { label: "4", key: "安定・基盤・停滞" },
  { label: "5", key: "変化・試練・刺激" },
  { label: "6", key: "調和・回復・助け合い" },
  { label: "7", key: "内省・神秘・試される時" },
  { label: "8", key: "前進・力・現実化" },
  { label: "9", key: "達成間近・あと一歩・充実" },
  { label: "10", key: "完成・区切り・到達" },
  { label: "J", key: "知らせ・若い力・きっかけ" },
  { label: "Q", key: "成熟・受容・支える女性性" },
  { label: "K", key: "完成された力・権威・決断" },
];
const POSITIONS = ["🃏 今の状況", "🃏 鍵となること", "🃏 これからの結末"];

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s; };
}

export function getCartomancyReading(question: string): FortuneResult {
  // question には呼び出し側で Date.now() が連結され、引くたびに変わる
  const seed = question.split("").reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7);
  const next = rng(seed >>> 0);

  // 52枚から3枚を重複なく引く
  const drawn: number[] = [];
  while (drawn.length < 3) {
    const c = next() % 52;
    if (!drawn.includes(c)) drawn.push(c);
  }

  let toneSum = 0;
  const details = drawn.map((c, i) => {
    const suit = SUITS[Math.floor(c / 13)];
    const rank = RANKS[c % 13];
    toneSum += suit.tone;
    return {
      label: `${POSITIONS[i]}：${rank.label}${suit.mark}（${suit.name}）`,
      content: `「${rank.key}」── ${suit.theme}の領域でのテーマです。${i === 0 ? "今あなたが置かれている状況を示します。" : i === 1 ? "この問いを動かす鍵・気をつける点です。" : "このまま進んだ場合の結末の方向性です。"}`,
    };
  });

  const lastSuit = SUITS[Math.floor(drawn[2] / 13)];
  const outlook = toneSum >= 2
    ? "全体に追い風。前向きに動いて良い流れです。"
    : toneSum <= -1
    ? "試練の札が目立ちます。慎重に、無理をせず進むのが吉。"
    : "良い面と注意点が混在。鍵の札を意識すれば道は開けます。";

  const q = question.split("|")[0];

  const firstSuit = SUITS[Math.floor(drawn[0] / 13)];
  const keySuit = SUITS[Math.floor(drawn[1] / 13)];
  const keyRank = RANKS[drawn[1] % 13];
  const suitNames = drawn.map((c) => SUITS[Math.floor(c / 13)].name).join("・");

  return {
    title: `トランプ占いの結果（結末：${RANKS[drawn[2] % 13].label}${lastSuit.mark}）`,
    summary: `「${q.slice(0, 40)}」という問いに対し、シャッフルした52枚のトランプから3枚を引きました。今の状況・鍵・結末の順に並んだ3枚が、この問いをめぐる流れを一つの物語として描き出しています。${outlook}`,
    details: [
      ...details,
      { label: "🔮 総合", content: `3枚の流れが示すのは──${outlook} 結末の札「${RANKS[drawn[2] % 13].label}${lastSuit.mark}（${lastSuit.theme}）」が、この件の行き着く先を物語っています。最初の「${firstSuit.name}」から結末の「${lastSuit.name}」へと、テーマがどう移り変わるかにも目を向けてみてください。` },
      { label: "♤ スートが映すテーマの重心", content: `引いた3枚のスートは「${suitNames}」。ハートは感情、ダイヤは現実と金銭、クラブは仕事と行動、スペードは試練と思考を司ります。今あなたの問いがどの領域で揺れているのかが、この組み合わせに表れています。${toneSum <= -1 ? "スペードが効いているぶん、感情に流されず、頭を冷やして扱うべきテーマです。" : "比較的扱いやすい札が揃い、素直に行動へ移しやすい配置です。"}` },
      { label: "🗝 鍵の札を活かすには", content: `2枚目の鍵の札「${keyRank.label}${keySuit.mark}」が示すのは「${keyRank.key}」。ここがこの問いを良い結末へ動かすための分岐点です。結末を急いで求めるよりも、まずはこの鍵に丁寧に向き合うこと。${keySuit.theme}の領域であなたが何を選ぶかが、3枚目の景色を静かに変えていきます。` },
      { label: "🌱 今日意識すること", content: `${outlook} 大きく動かそうとせず、今日できる小さな一歩から始めてみましょう。3枚目の結末は確定した未来ではなく、今の延長線上にある"傾き"にすぎません。あなたの選択しだいで、その色合いはいくらでも塗り替えられます。` },
    ],
    drawnCards: drawn.map((c, i) => {
      const suit = SUITS[Math.floor(c / 13)];
      const rank = RANKS[c % 13];
      return { position: POSITIONS[i], name: `${rank.label}${suit.mark}`, symbol: suit.mark };
    }),
    advice: `カードは未来を固定するものではなく、今この瞬間のあなたの心を映す鏡です。引いた3枚から受け取った気づきを、ひとつでも今日の行動に落とし込んでみてください。迷いがかえって深まったときは、心を静かに整えてからもう一度引けば、その時のあなたに必要な札があらためて現れます。`,
  };
}
