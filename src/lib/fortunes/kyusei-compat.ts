import { FortuneResult } from "@/lib/types";

// ══════════════════════════════════════════════
// 九星気学 相性占い
// 2人の本命星（九星）を実算出し、五行の相生・相剋で相性を判定する。
// ══════════════════════════════════════════════

const STAR_NAMES = ["一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星", "六白金星", "七赤金星", "八白土星", "九紫火星"];
// 各星の五行（0木1火2土3金4水）
const STAR_ELEM = [4, 2, 0, 0, 2, 3, 3, 2, 1];
const ELEM_NAME = ["木", "火", "土", "金", "水"];

// 本命星（1〜9）。立春(2/4頃)前は前年扱い
function honmei(birthday: string): number {
  const [y, m, d] = birthday.split("-").map(Number);
  const adj = (m === 1 || (m === 2 && d < 4)) ? y - 1 : y;
  let n = adj;
  while (n >= 10) n = String(n).split("").reduce((a, c) => a + Number(c), 0);
  let star = (11 - n) % 9;
  if (star === 0) star = 9;
  return star; // 1..9
}

// 五行関係
function relation(eA: number, eB: number): { type: string; score: number; note: string } {
  if (eA === eB) return { type: "比和（同じ五行）", score: 85, note: "同じ気を持つ似た者同士。価値観が合い安心できますが、譲り合いの意識を持つとさらに円満に。" };
  if ((eA + 1) % 5 === eB) return { type: "相生（あなたが相手を生かす）", score: 92, note: "あなたが相手を育て支える関係。与える喜びがあり、相手から感謝と幸運が返ってきます。" };
  if ((eB + 1) % 5 === eA) return { type: "相生（相手があなたを生かす）", score: 92, note: "相手があなたを引き立て支えてくれる関係。素直に頼ることで運が開けます。" };
  if ((eA + 2) % 5 === eB) return { type: "相剋（あなたが相手を抑える）", score: 60, note: "あなたが相手に強く出やすい関係。少し力を緩め、相手を立てると良いバランスに。" };
  return { type: "相剋（相手があなたを抑える）", score: 60, note: "相手のペースに飲まれやすい関係。自分の軸を保つことで対等で良い関係になります。" };
}

export function getKyuseiCompatReading(birthdayA: string, birthdayB: string): FortuneResult {
  const sa = honmei(birthdayA), sb = honmei(birthdayB);
  const eA = STAR_ELEM[sa - 1], eB = STAR_ELEM[sb - 1];
  const r = relation(eA, eB);
  const stars = r.score >= 90 ? "★★★★★" : r.score >= 80 ? "★★★★☆" : r.score >= 65 ? "★★★☆☆" : "★★☆☆☆";

  // 五行関係のカテゴリ（relation() と同じ判定。ロジックは変更しない）
  const rcat =
    eA === eB ? "hiwa" :
    (eA + 1) % 5 === eB ? "sojo_give" :
    (eB + 1) % 5 === eA ? "sojo_receive" :
    (eA + 2) % 5 === eB ? "sokoku_active" :
    "sokoku_passive";

  const basic: Record<string, string> = {
    hiwa: "同じ五行を持つお二人は、感覚や価値観が似た者同士。一緒にいて気を遣わず、自然体でいられる安心感があります。似ているぶん遠慮も出やすいので、思いやりを言葉にすると円満です。",
    sojo_give: "あなたの気が相手を育て、支える流れの関係。あなたが与えることで相手が伸び、その成長があなたにも幸運となって返ってきます。世話を焼きすぎず、相手の自立も信じるとより良い循環になります。",
    sojo_receive: "相手の気があなたを引き立て、後押ししてくれる関係。素直に頼り、受け取ることで運が開けます。感謝を返すことで、支え合いの良い循環が生まれます。",
    sokoku_active: "あなたの気が相手より強く出やすい関係。知らず知らず主導権を握りがちなので、少し力を緩めて相手を立てると、ぐっと和やかになります。",
    sokoku_passive: "相手の気が強く働き、あなたが受けて立つ側になりやすい関係。相手の勢いに飲まれず、自分の考えも穏やかに伝えていくことで、対等で心地よいバランスに近づきます。",
  };
  const love: Record<string, string> = {
    hiwa: "恋愛では、似た感覚ゆえにテンポが合い、居心地の良い関係に。一方で刺激は少なめなので、新鮮な体験を意識して取り入れると、ときめきが長続きします。",
    sojo_give: "あなたが相手を包み込み、応援する形の恋愛。相手はあなたといると安心して力を発揮できます。尽くしすぎて疲れないよう、自分の喜びも大切にしてください。",
    sojo_receive: "相手がリードし、あなたを引き上げてくれる恋愛。甘え上手になれると、二人の愛情はより深まります。受け取った優しさは素直に喜んで返しましょう。",
    sokoku_active: "情熱的でメリハリのある恋愛になりやすい関係。あなたが引っ張る場面が増えますが、相手の気持ちのペースにも耳を傾けると、長く続きます。",
    sokoku_passive: "ドキドキと刺激のある恋愛。相手の魅力に強く惹かれるぶん、振り回されすぎないよう、自分の気持ちも素直に伝えていくと安定します。",
  };
  const values: Record<string, string> = {
    hiwa: "物事の捉え方が近いため、話が早く通じ合えます。ただ二人とも同じ視点に偏りやすいので、ときには違う意見をあえて出し合うと、視野が広がります。",
    sojo_give: "あなたが聞き役・支え役に回ると会話が円滑に進みます。相手の話を引き出すのが上手なので、その強みを活かすと信頼が深まります。",
    sojo_receive: "相手の知恵や視点から学べることが多い関係。素直に耳を傾ける姿勢が、良い会話と成長を生みます。",
    sokoku_active: "あなたの主張が前に出やすいので、伝え方をやわらかくすると好転します。命令ではなく提案の形にすると、相手も受け取りやすくなります。",
    sokoku_passive: "相手の言葉の勢いに押されがちですが、遠慮せず自分の思いも言葉にして。落ち着いて伝えれば、気持ちはちゃんと届きます。",
  };
  const friction: Record<string, string> = {
    hiwa: "似ているがゆえに、同じ弱点で二人とも行き詰まりやすいのが注意点。どちらかが冷静になる役を担うと、共倒れを防げます。",
    sojo_give: "尽くす側に偏ると、見返りを期待して疲れてしまうことが。『してあげたのに』が積もる前に、自分の負担も正直に伝えましょう。",
    sojo_receive: "頼りすぎると、相手に負担が偏ることも。受け取るだけでなく、できる形で返す意識を持つと長続きします。",
    sokoku_active: "強く出すぎると、相手が萎縮したり反発したりしやすい関係。勝ち負けにこだわらないことが、衝突を減らす鍵です。",
    sokoku_passive: "我慢を重ねると、不満が一気に噴き出すことがあります。小さな違和感のうちに、こまめに気持ちを共有しておくと安心です。",
  };
  const approach: Record<string, string> = {
    hiwa: "似た者同士だからこそ、相手を『もう一人の自分』と思って大切に。自分がされて嬉しいことを相手にもしてあげると、関係が温まります。",
    sojo_give: "相手の成長を信じて見守る姿勢が大切。手を出しすぎず、相手が自分の力で進めるよう応援役に徹すると、よい関係が続きます。",
    sojo_receive: "相手の好意を遠慮なく受け取り、感謝を返すこと。『ありがとう』『助かった』をこまめに伝えると、相手も嬉しくなります。",
    sokoku_active: "相手を立てる場面を意識的に作ること。一歩引いて相手に花を持たせると、関係がぐっと滑らかになります。",
    sokoku_passive: "相手の勢いに合わせすぎず、自分の心地よいペースも大事にして。無理を続けないことが、結果的に関係を長持ちさせます。",
  };

  return {
    title: `九星相性 ${r.score}点 ${stars}`,
    summary: `${STAR_NAMES[sa - 1]}（${ELEM_NAME[eA]}）× ${STAR_NAMES[sb - 1]}（${ELEM_NAME[eB]}）の相性は「${r.type}」。${r.note} 九星気学の五行（木・火・土・金・水）の流れから、お二人の関係を読み解きました。`,
    details: [
      { label: "⭐ お二人の本命星", content: `お一人目：${STAR_NAMES[sa - 1]}（五行：${ELEM_NAME[eA]}）／お二人目：${STAR_NAMES[sb - 1]}（五行：${ELEM_NAME[eB]}）` },
      { label: `🔗 五行の関係：${r.type}`, content: r.note },
      { label: "💞 二人の基本相性", content: basic[rcat] },
      { label: "💕 恋愛・パートナーとして", content: love[rcat] },
      { label: "💬 価値観・コミュニケーション", content: values[rcat] },
      { label: "⚡ ぶつかりやすい点", content: friction[rcat] },
      { label: "🌸 相手への接し方", content: approach[rcat] },
    ],
    lucky: { number: String(r.score) },
    advice: r.score >= 90
      ? "自然と高め合える二人。新しい挑戦を一緒に始めると、互いの運気がさらに伸びます。背中を押し合ってください。"
      : r.score >= 80
      ? "落ち着いた良縁。共通の目標や習慣を一つ持つと、結びつきがより強くなります。"
      : "相剋は『刺激と成長』の関係。相手の領域に踏み込みすぎず、自分の軸を保つと、長く心地よい距離で付き合えます。",
  };
}
