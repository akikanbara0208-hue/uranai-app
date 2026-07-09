import { FortuneResult } from "@/lib/types";
import { julianDay, getSunLongitude, getMoonLongitude, getPlanetLongitude } from "@/lib/fortunes/astrology";

// ══════════════════════════════════════════════
// 相性占い（西洋占星術シナストリー）
// 2人の出生図の太陽・月・金星・火星を実計算し、星のエレメントの調和から相性を読む。
// ══════════════════════════════════════════════

const SIGN_NAMES = ["牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座","水瓶座","魚座"];
const SIGN_ELEM  = ["火","地","風","水","火","地","風","水","火","地","風","水"];

type Chart = { sun: number; moon: number; venus: number; mars: number };

function chartOf(birthday: string, hour?: number): Chart {
  const [y, m, d] = birthday.split("-").map(Number);
  const jd = julianDay(y, m, d) - 0.5 + ((typeof hour === "number" ? hour : 12) - 9) / 24;
  const sign = (lon: number) => Math.floor(((lon % 360) + 360) % 360 / 30);
  return {
    sun: sign(getSunLongitude(jd)),
    moon: sign(getMoonLongitude(jd)),
    venus: sign(getPlanetLongitude(jd, "venus")),
    mars: sign(getPlanetLongitude(jd, "mars")),
  };
}

// エレメント同士の親和度（0-100）
function elemAffinity(a: string, b: string): number {
  if (a === b) return 92;
  const harmonic = (x: string, y: string) =>
    (x === "火" && y === "風") || (x === "風" && y === "火") ||
    (x === "地" && y === "水") || (x === "水" && y === "地");
  if (harmonic(a, b) || harmonic(b, a)) return 88;
  const friction = (x: string, y: string) =>
    (x === "火" && y === "水") || (x === "水" && y === "火") ||
    (x === "風" && y === "地") || (x === "地" && y === "風");
  if (friction(a, b) || friction(b, a)) return 52;
  return 64; // 火地・風水（穏やかな差異）
}

const el = (sign: number) => SIGN_ELEM[sign];

// 同じエレメント同士の追加コメント（4元素それぞれ固有の意味づけ）
const SAME_ELEM_EXTRA: Record<string, string> = {
  火: "情熱のままに動きたい気持ちが重なるため、一緒にいると勢いがついて何でも実現できそうな高揚感があります。",
  地: "堅実さや安定志向が一致するため、将来設計や日々の暮らし方についても自然と歩調が合うでしょう。",
  風: "知的好奇心や会話を楽しむ感覚が共通しているため、話題が尽きず刺激し合える関係になります。",
  水: "感情の機微を言葉にせずとも察し合えるため、深いところで安心を分かち合える絆が育ちます。",
};

// エレメントの補い合い（火⇔風、地⇔水）の追加コメント
function harmonicExtra(a: string, b: string): string {
  const pair = [a, b].sort().join("");
  if (pair === "火風") return "火の情熱を風が言葉にして周囲に伝え、風のひらめきを火が即行動に移す好循環が生まれます。";
  return "地の安定感が水の感情を優しく受け止め、水の共感力が地の頑固さを和らげる、支え合いの関係です。";
}

// エレメントの穏やかな差異（火⇔地、風⇔水）の追加コメント
function midExtra(a: string, b: string): string {
  const pair = [a, b].sort().join("");
  if (pair === "地火") return "火の勢いと地の慎重さでテンポは違いますが、瞬発力と持続力が組み合わさることで、物事を最後までやり遂げる力に変わります。";
  return "風の軽やかさと水の深さでテンポは違いますが、会話の広がりと感情の深まりが交互に働き、互いの世界を広げ合えます。";
}

// エレメントの摩擦（火⇔水、風⇔地）の追加コメント
function frictionExtra(a: string, b: string): string {
  const pair = [a, b].sort().join("");
  if (pair === "水火") return "火のストレートさと水の繊細さがぶつかりやすい組み合わせですが、その分お互いにない感受性を学び合えます。";
  return "風の柔軟さと地の頑固さで意見が噛み合わないこともありますが、違いを面白がれれば視野が大きく広がる関係です。";
}

export function getCompatibilityReading(
  birthdayA: string, birthdayB: string, hourA?: number, hourB?: number,
): FortuneResult {
  const A = chartOf(birthdayA, hourA);
  const B = chartOf(birthdayB, hourB);

  const sunSun = elemAffinity(el(A.sun), el(B.sun));
  const emo = Math.round((elemAffinity(el(A.sun), el(B.moon)) + elemAffinity(el(B.sun), el(A.moon))) / 2);
  const romance = Math.round((elemAffinity(el(A.venus), el(B.mars)) + elemAffinity(el(B.venus), el(A.mars))) / 2);
  const overall = Math.round(sunSun * 0.35 + emo * 0.30 + romance * 0.35);

  const stars = (s: number) => s >= 85 ? "★★★★★" : s >= 70 ? "★★★★☆" : s >= 60 ? "★★★☆☆" : s >= 50 ? "★★☆☆☆" : "★☆☆☆☆";
  const verdict =
    overall >= 85 ? "魂レベルで惹かれ合う最高の相性。自然体で深く理解し合える関係です。" :
    overall >= 70 ? "とても良い相性。価値観が響き合い、一緒にいて心地よい関係を築けます。" :
    overall >= 60 ? "良い相性。違いもありますが、それが互いを成長させる刺激になります。" :
    overall >= 50 ? "学びの相性。価値観の違いを尊重し合えれば、深い絆に育ちます。" :
    "挑戦的だが成長できる相性。違いを面白がれるかが鍵。惹かれ合う磁力は強いものです。";

  const sunComment =
    el(A.sun) === el(B.sun) ? `お二人とも「${el(A.sun)}」のエレメント。根っこの価値観が似ており、説明不要で通じ合えます。${SAME_ELEM_EXTRA[el(A.sun)]}` :
    sunSun >= 85 ? `「${el(A.sun)}」と「${el(B.sun)}」は補い合う関係。違う強みが噛み合い、最高のチームになれます。${harmonicExtra(el(A.sun), el(B.sun))}` :
    sunSun >= 60 ? `「${el(A.sun)}」と「${el(B.sun)}」。テンポの違いはありますが、互いの世界を広げ合えます。${midExtra(el(A.sun), el(B.sun))}` :
    `「${el(A.sun)}」と「${el(B.sun)}」。価値観に違いがある分、理解しようとする姿勢が絆を深めます。${frictionExtra(el(A.sun), el(B.sun))}`;

  // 総合スコア帯と、最も差の出やすい領域（いずれも計算済みの値に基づく）
  const tier = overall >= 78 ? "high" : overall >= 62 ? "mid" : "low";
  const lowest = romance <= emo && romance <= sunSun ? "romance" : emo <= sunSun ? "emo" : "sun";
  const lowName = lowest === "romance" ? "恋愛のテンポ（金星×火星）" : lowest === "emo" ? "感情の通わせ方（太陽×月）" : "基本的な価値観（太陽どうし）";

  const comm: Record<string, string> = {
    high: "価値観や感性のエレメントがよく調和しているお二人。日常会話のテンポも合いやすく、一緒にいて自然体でいられます。何気ない雑談の時間が、二人の絆を静かに育てます。些細な日常の共有を惜しまないことが、長く色あせない心地よさを保つ秘訣です。",
    mid: "ところどころテンポやノリの違いはありますが、それがかえって会話に新鮮さを与えます。相手の話に『そういう見方もあるね』と耳を傾けると、理解がぐっと深まります。ときには意見がすれ違っても、それを『相性が悪い』と捉えず、互いを知るための材料にできる二人です。",
    low: "感じ方や表現の仕方に違いがある二人。言わなくても伝わると思わず、気持ちや考えを丁寧に言葉にすることが、すれ違いを防ぐいちばんの近道です。沈黙で察してもらおうとせず、こまめな言葉のキャッチボールを積み重ねることが、確かな信頼につながります。",
  };
  const friction: Record<string, string> = {
    high: `全体に調和の取れた相性ですが、強いて言えば${lowName}に少し差があります。そこさえ意識して歩み寄れば、ほぼ死角のない関係です。些細なことでも早めに言葉にして共有すれば、大きなすれ違いに発展することはまずないでしょう。`,
    mid: `特に${lowName}で温度差が出やすい組み合わせ。違いが見えたときは正そうとせず、まず相手の感じ方を受け止めると衝突を避けられます。ぶつかった直後ではなく、少し時間を置いてから話し合うと、感情的にならず建設的な着地点が見つかります。`,
    low: `${lowName}をはじめ、価値観の差を感じる場面が多めの相性。だからこそ、違いを『間違い』と決めつけないことが、関係を守る鍵になります。対立を恐れるより、違いを認め合った上でどう歩み寄るかを話し合う姿勢そのものが、二人の関係を強くしていきます。`,
  };
  const approach: Record<string, string> = {
    high: "相手の世界やペースも尊重し、近づきすぎず離れすぎずの心地よい距離を保つこと。お互いの自由を認め合うほど、ときめきが長く続きます。記念日や小さな出来事を一緒に喜び合うことが、この相性が持つ良さをさらに引き立ててくれます。",
    mid: "違いを感じたら、相手を変えようとする前に『なぜそう感じるのか』を一度想像してみて。その想像力が、二人のすれ違いをやさしくほどいてくれます。完璧に理解し合おうとせず、『違うからこそ面白い』と捉える余裕が、関係を長続きさせる潤滑油になります。",
    low: "正反対だからこそ、相手はあなたに無い視点をくれる存在。意見が割れたときこそ学びのチャンスと捉えると、ぶつかりが二人を成長させる力に変わります。ぶつかるたびに離れるのではなく、そのつど歩み寄る努力を重ねることが、他にはない強い絆を育てていきます。",
  };

  return {
    title: `相性 ${overall}点 ── ${stars(overall)}`,
    summary: `お二人の出生図を西洋占星術で実際に計算しました。総合相性は${overall}点。${verdict}`,
    details: [
      { label: "🌞 太陽どうし（基本的な価値観）", content: `お相手①：${SIGN_NAMES[A.sun]}／お相手②：${SIGN_NAMES[B.sun]}。相性度 ${sunSun}点 ${stars(sunSun)}。\n${sunComment}` },
      { label: "🌙 太陽×月（情緒・安心感）", content: `相性度 ${emo}点 ${stars(emo)}。一方の太陽（①${SIGN_NAMES[A.sun]}／②${SIGN_NAMES[B.sun]}）と他方の月（①${SIGN_NAMES[A.moon]}／②${SIGN_NAMES[B.moon]}）の響き合い。${emo >= 75 ? "一緒にいて深く安らげる、心が休まる関係です。" : emo >= 60 ? "相手の感情に寄り添う意識を持つと、安心感が育ちます。" : "感情の表し方が異なります。言葉で気持ちを伝え合うことが鍵です。"}${emo >= 75 ? "言葉にしなくても気持ちが伝わる場面が多く、一緒に過ごす時間そのものが二人にとっての癒やしになるでしょう。" : emo >= 60 ? "感じ方にズレがあっても、素直に「うれしい」「さみしい」と口にする習慣を持てば、そのズレはむしろ関係を深めるきっかけになります。" : "無理に相手と同じ感情表現を求めるより、それぞれのペースで気持ちを開示し合うことが、すれ違いを防ぐいちばんの近道です。"}` },
      { label: "💕 金星×火星（恋愛・惹かれ合う力）", content: `相性度 ${romance}点 ${stars(romance)}。愛情表現の金星（①${SIGN_NAMES[A.venus]}／②${SIGN_NAMES[B.venus]}）と情熱の火星（①${SIGN_NAMES[A.mars]}／②${SIGN_NAMES[B.mars]}）の化学反応。${romance >= 75 ? "強く惹かれ合い、ときめきが長続きする関係です。" : romance >= 60 ? "ほどよい刺激のある関係。相手の好みを知ると一層深まります。" : "魅力の方向性が異なります。お互いの「好き」を素直に伝え合って。"}${romance >= 75 ? "見つめ合うだけで気持ちが通じるような自然な化学反応が起きやすい相性で、マンネリを感じにくく長く新鮮な関係を築けます。" : romance >= 60 ? "好みのズレを面白がれる余裕があれば、お互いに知らなかった魅力を発見でき、関係にさらに深みが増していきます。" : "惹かれるポイントが正反対だからこそ、相手の好みに合わせてみる小さな挑戦が、思いがけない新しい扉を開いてくれます。"}` },
      { label: "💬 コミュニケーション・日常の相性", content: comm[tier] },
      { label: "⚡ ぶつかりやすい点", content: friction[tier] },
      { label: "🌸 相手への接し方", content: approach[tier] },
      { label: "🔮 総合鑑定", content: `太陽（価値観）${sunSun}点・情緒${emo}点・恋愛${romance}点を総合すると、お二人の相性は${overall}点という結果になりました。${verdict}数字はあくまで星々が示す傾向であり、実際の関係を育てるのはお二人自身の日々の心がけです。` },
    ],
    lucky: { number: String(overall) },
    advice: `相性は「点数」より「向き合い方」で育ちます。${overall >= 70 ? "恵まれた相性です。当たり前にせず感謝を伝え合うことで、さらに深まります。" : "違いのある相性ほど、理解しようとする姿勢が二人を強く結びつけます。星は傾向を示すだけ。育てるのはお二人自身です。"}`,
  };
}
