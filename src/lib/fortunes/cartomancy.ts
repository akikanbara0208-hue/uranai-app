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
  { label: "A", key: "始まり・大きな力・原点", text: "何かがまっさらな状態から動き出す、強い原初のエネルギーを持つ札です。可能性はまだ何色にも染まっておらず、これから何を選ぶかによって大きく形を変えていきます。" },
  { label: "2", key: "対・選択・パートナーシップ", text: "一人ではなく、誰かとの関わりの中で物事が進んでいく札です。二つの道の間で選択を迫られたり、協力によって物事が動く場面を示します。" },
  { label: "3", key: "発展・創造・広がり", text: "一つだったものが形を増やし、発展・成長していく札です。創造的なアイデアや人との輪が広がり、可能性が枝分かれしていく段階を表します。" },
  { label: "4", key: "安定・基盤・停滞", text: "四本の柱が支えるような、安定した基盤ができあがる札です。ただしその安定が行き過ぎると、変化を嫌う停滞にもなり得ることを示しています。" },
  { label: "5", key: "変化・試練・刺激", text: "積み上げてきた安定が揺さぶられ、試練や刺激が訪れる札です。混乱に感じても、それは次の段階へ進むために必要な変化の合図です。" },
  { label: "6", key: "調和・回復・助け合い", text: "乱れていたものが調和を取り戻し、助け合いの中で回復していく札です。誰かとの支え合いが、状況を穏やかに整えてくれます。" },
  { label: "7", key: "内省・神秘・試される時", text: "外側の動きより、内側との対話が求められる札です。答えを急がず、自分自身と静かに向き合うことで見えてくる真実があります。" },
  { label: "8", key: "前進・力・現実化", text: "内省を経て、再び力強く前進していく段階を示す札です。頭の中にあった構想を、現実の形にしていく力が満ちています。" },
  { label: "9", key: "達成間近・あと一歩・充実", text: "目標まであと一歩というところまで来ている、充実した札です。ゴールを目前にした今こそ、最後まで気を抜かず丁寧に進むことが求められます。" },
  { label: "10", key: "完成・区切り・到達", text: "一つのサイクルが完成し、区切りを迎える札です。ここで得た結果を土台に、また新しいサイクルが静かに始まろうとしています。" },
  { label: "J", key: "知らせ・若い力・きっかけ", text: "新しい知らせや、若く新鮮なエネルギーが動き出すきっかけを示す札です。行動に移す前の、最初の一歩を後押しする合図です。" },
  { label: "Q", key: "成熟・受容・支える女性性", text: "包み込むような受容力と、成熟した優しさを持つ札です。力で押すのではなく、受け止め、支えることで物事がうまく運びます。" },
  { label: "K", key: "完成された力・権威・決断", text: "経験に裏打ちされた、揺るぎない力と決断力を示す札です。責任を引き受け、はっきりとした意志で舵を取ることが求められる場面です。" },
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

  const POSITION_FRAME = [
    "今あなたが置かれている状況を示すのは",
    "この問いを動かす鍵・気をつける点として現れているのは",
    "このまま進んだ場合の結末の方向性を示すのは",
  ];

  let toneSum = 0;
  const details = drawn.map((c, i) => {
    const suit = SUITS[Math.floor(c / 13)];
    const rank = RANKS[c % 13];
    toneSum += suit.tone;
    return {
      label: `${POSITIONS[i]}：${rank.label}${suit.mark}（${suit.name}）`,
      content: `${POSITION_FRAME[i]}「${rank.label}${suit.mark}」──「${rank.key}」。${rank.text}この札は${suit.theme}の領域のテーマを帯びており、${suit.tone > 0 ? "そちらの方向へ状況が動きやすいことを示しています。" : "この領域では慎重な判断が必要になりそうです。"}`,
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
