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

// エレメント別の会話の癖と、月が示す情緒的な欲求。
// 相性文をスコア帯だけで書き分けると組み合わせが違っても同文になるため、実際の星座から組み立てる
const TALK: Record<string, string> = {
  火: "思ったことをその場で勢いよく口にする",
  地: "確かめてから具体的な言葉で話す",
  風: "理屈を整理しながら軽やかに言葉を交わす",
  水: "言葉より表情や間合いで伝えようとする",
};
const NEED: Record<string, string> = {
  火: "自分の情熱をまっすぐ肯定してもらうこと",
  地: "変わらない安心と生活の安定が保たれること",
  風: "考えを自由に話せて、束縛されないこと",
  水: "気持ちを言葉にしなくても汲み取ってもらうこと",
};

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

  // 会話の癖は太陽星座のエレメントから、情緒の求めは月星座のエレメントから導く
  const talkA = TALK[el(A.sun)], talkB = TALK[el(B.sun)];
  const comm = el(A.sun) === el(B.sun)
    ? `お二人とも「${el(A.sun)}」のエレメントで、${talkA}話し方をします。テンポが揃うので会話は驚くほど楽ですが、同じ癖しか持たない分、その伝え方で届かない話題が出ると二人そろって手詰まりになります。行き詰まったら、あえて普段と違う方法（文字にする・日を改める）に切り替えてみてください。`
    : `お一人目（${SIGN_NAMES[A.sun]}・${el(A.sun)}）は${talkA}タイプ、お二人目（${SIGN_NAMES[B.sun]}・${el(B.sun)}）は${talkB}タイプです。${tier === "high" ? "話し方は違っても向いている方向が同じなので、少し待てば必ず噛み合います。" : tier === "mid" ? "テンポの差はありますが、急かさなければ自然と着地点が見つかります。" : "会話の速度も伝え方も異なるため、相手の沈黙や勢いを『拒絶』『圧』と受け取らないことがすれ違いを防ぎます。"}どちらが正しいかを争わず、話題ごとに合わせる側を交代するのが現実的です。`;
  const friction: Record<string, string> = {
    high: `全体に調和の取れた相性ですが、強いて言えば${lowName}に少し差があります。そこさえ意識して歩み寄れば、ほぼ死角のない関係です。些細なことでも早めに言葉にして共有すれば、大きなすれ違いに発展することはまずないでしょう。`,
    mid: `特に${lowName}で温度差が出やすい組み合わせ。違いが見えたときは正そうとせず、まず相手の感じ方を受け止めると衝突を避けられます。ぶつかった直後ではなく、少し時間を置いてから話し合うと、感情的にならず建設的な着地点が見つかります。`,
    low: `${lowName}をはじめ、価値観の差を感じる場面が多めの相性。だからこそ、違いを『間違い』と決めつけないことが、関係を守る鍵になります。対立を恐れるより、違いを認め合った上でどう歩み寄るかを話し合う姿勢そのものが、二人の関係を強くしていきます。`,
  };
  const approach = `月星座が示す情緒の求めは、お一人目（月${SIGN_NAMES[A.moon]}・${el(A.moon)}）が「${NEED[el(A.moon)]}」、お二人目（月${SIGN_NAMES[B.moon]}・${el(B.moon)}）が「${NEED[el(B.moon)]}」です。${el(A.moon) === el(B.moon) ? "同じものを求め合うため深く共鳴できますが、どちらも受け取る側に回ると、二人とも満たされないまま待ち続けることになります。先に与える側へ回る勇気を持ってください。" : "求めているものが違うので、自分がしてほしいことをそのまま相手にしても届きません。相手の月が求めるものを、相手の言葉で確かめることから始めてください。"}`;

  return {
    title: `相性 ${overall}点 ── ${stars(overall)}`,
    summary: `お二人の出生図を西洋占星術で実際に計算しました。総合相性は${overall}点。${verdict}`,
    details: [
      { label: "🌞 太陽どうし（基本的な価値観）", content: `お相手①：${SIGN_NAMES[A.sun]}／お相手②：${SIGN_NAMES[B.sun]}。相性度 ${sunSun}点 ${stars(sunSun)}。\n${sunComment}` },
      { label: "🌙 太陽×月（情緒・安心感）", content: `相性度 ${emo}点 ${stars(emo)}。一方の太陽（①${SIGN_NAMES[A.sun]}／②${SIGN_NAMES[B.sun]}）と他方の月（①${SIGN_NAMES[A.moon]}／②${SIGN_NAMES[B.moon]}）の響き合い。${emo >= 75 ? "一緒にいて深く安らげる、心が休まる関係です。" : emo >= 60 ? "相手の感情に寄り添う意識を持つと、安心感が育ちます。" : "感情の表し方が異なります。言葉で気持ちを伝え合うことが鍵です。"}${emo >= 75 ? "言葉にしなくても気持ちが伝わる場面が多く、一緒に過ごす時間そのものが二人にとっての癒やしになるでしょう。" : emo >= 60 ? "感じ方にズレがあっても、素直に「うれしい」「さみしい」と口にする習慣を持てば、そのズレはむしろ関係を深めるきっかけになります。" : "無理に相手と同じ感情表現を求めるより、それぞれのペースで気持ちを開示し合うことが、すれ違いを防ぐいちばんの近道です。"}` },
      { label: "💕 金星×火星（恋愛・惹かれ合う力）", content: `相性度 ${romance}点 ${stars(romance)}。愛情表現の金星（①${SIGN_NAMES[A.venus]}／②${SIGN_NAMES[B.venus]}）と情熱の火星（①${SIGN_NAMES[A.mars]}／②${SIGN_NAMES[B.mars]}）の化学反応。${romance >= 75 ? "強く惹かれ合い、ときめきが長続きする関係です。" : romance >= 60 ? "ほどよい刺激のある関係。相手の好みを知ると一層深まります。" : "魅力の方向性が異なります。お互いの「好き」を素直に伝え合って。"}${romance >= 75 ? "見つめ合うだけで気持ちが通じるような自然な化学反応が起きやすい相性で、マンネリを感じにくく長く新鮮な関係を築けます。" : romance >= 60 ? "好みのズレを面白がれる余裕があれば、お互いに知らなかった魅力を発見でき、関係にさらに深みが増していきます。" : "惹かれるポイントが正反対だからこそ、相手の好みに合わせてみる小さな挑戦が、思いがけない新しい扉を開いてくれます。"}` },
      { label: "💬 コミュニケーション・日常の相性", content: comm },
      { label: "⚡ ぶつかりやすい点", content: friction[tier] },
      { label: "🌸 相手への接し方", content: approach },
      { label: "🔮 総合鑑定", content: `太陽（価値観）${sunSun}点・情緒${emo}点・恋愛${romance}点を総合すると、お二人の相性は${overall}点という結果になりました。${verdict}数字はあくまで星々が示す傾向であり、実際の関係を育てるのはお二人自身の日々の心がけです。` },
    ],
    lucky: { number: String(overall) },
    advice: `相性は「点数」より「向き合い方」で育ちます。${overall >= 70 ? "恵まれた相性です。当たり前にせず感謝を伝え合うことで、さらに深まります。" : "違いのある相性ほど、理解しようとする姿勢が二人を強く結びつけます。星は傾向を示すだけ。育てるのはお二人自身です。"}`,
  };
}
