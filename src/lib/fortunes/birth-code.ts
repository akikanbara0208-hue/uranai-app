import { FortuneResult } from "@/lib/types";
import { julianDay, getSunLongitude, getMoonLongitude } from "@/lib/fortunes/astrology";

// ══════════════════════════════════════════════
// 誕生コード（当アプリ独自の統合診断）
// 伝統占術ではなく、あなたの誕生日から得られる「実データ4要素」
//   ① 数秘ライフパス ② 干支（十二支） ③ 生まれた日の月相 ④ 七十二候
// を組み合わせた、当アプリオリジナルのプロファイル。各要素はすべて実計算。
// ══════════════════════════════════════════════

const ANIMALS = ["鼠", "牛", "虎", "兎", "龍", "蛇", "馬", "羊", "猿", "鶏", "犬", "猪"];
const ANIMAL_TRAIT = ["機知", "忍耐", "勇気", "優しさ", "理想", "洞察", "自由", "和合", "才知", "勤勉", "誠実", "純真"];
const MOON_PHASES = [
  ["新月", "始まり・無限の可能性"], ["三日月", "意志・芽生え"], ["上弦の月", "決断・行動"], ["十三夜月", "成長・前進"],
  ["満月", "達成・充溢"], ["十六夜月", "成熟・共有"], ["下弦の月", "手放し・整理"], ["暁月", "内省・浄化"],
];
const LIFEPATH_KEY: Record<number, string> = {
  1: "開拓", 2: "調和", 3: "創造", 4: "堅実", 5: "自由", 6: "愛", 7: "探求", 8: "実現", 9: "博愛",
  11: "直感", 22: "創建", 33: "奉仕",
};

function reduceNum(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) n = String(n).split("").reduce((a, c) => a + Number(c), 0);
  return n;
}

export function getBirthCodeReading(birthday: string, name?: string): FortuneResult {
  const [y, m, d] = birthday.split("-").map(Number);
  const jd = julianDay(y, m, d);

  // ① 数秘ライフパス
  const lifePath = reduceNum(String(y).split("").reduce((a, c) => a + Number(c), 0) + m + d);
  const lpKey = LIFEPATH_KEY[lifePath] || "個性";

  // ② 干支（立春境界）
  const baziYear = (m === 1 || (m === 2 && d < 4)) ? y - 1 : y;
  const animalIdx = ((baziYear - 4) % 12 + 12) % 12;

  // ③ 生まれた日の月相（太陽と月の離角）
  const elong = ((getMoonLongitude(jd) - getSunLongitude(jd)) % 360 + 360) % 360;
  const phaseIdx = Math.floor(elong / 45) % 8;

  // ④ 七十二候（太陽黄経・立春315°起点）
  const sunLon = getSunLongitude(jd - 0.5 + (12 - 9) / 24);
  const koIdx = Math.floor((((sunLon - 315) % 360) + 360) % 360 / 5) % 72;

  const code = `L${lifePath}-${ANIMALS[animalIdx]}-${MOON_PHASES[phaseIdx][0]}`;
  const nameLine = name ? `${name}さんの` : "あなたの";

  return {
    title: `誕生コード：${code}`,
    summary: `${nameLine}誕生日に刻まれた4つの実データ──数秘「ライフパス${lifePath}」、干支「${ANIMALS[animalIdx]}」、生まれた日の月相「${MOON_PHASES[phaseIdx][0]}」、七十二候「第${koIdx + 1}候」──を統合した、当アプリ独自のプロファイルです。これらはすべて生年月日からの実計算で導いた値であり、伝統占術の寄せ集めではなく、世界であなただけの組み合わせになります。`,
    details: [
      { label: `① 数秘ライフパス ${lifePath}（${lpKey}）`, content: `生年月日の数を還元した、あなたの人生の主題は「${lpKey}」。これが行動の根本動機になります。困ったときに立ち返るべき軸であり、あなたが心から満たされる方向を指し示します。` },
      { label: `② 干支：${ANIMALS[animalIdx]}（${ANIMAL_TRAIT[animalIdx]}）`, content: `生まれ年の十二支が示す本能的な気質は「${ANIMAL_TRAIT[animalIdx]}」。とっさの場面で出るあなたの素の力です。意識して鍛えた長所とは違い、生まれつき備わった反射のような強みだと考えてください。` },
      { label: `③ 生まれた日の月相：${MOON_PHASES[phaseIdx][0]}`, content: `誕生日の夜空の月の満ち欠けは「${MOON_PHASES[phaseIdx][0]}」。テーマは「${MOON_PHASES[phaseIdx][1]}」。感情とリズムの土台を表します。気分の波もまた、この月のリズムに沿った自然なものとして受け入れると楽になります。` },
      { label: `④ 七十二候：第${koIdx + 1}候`, content: `あなたの誕生日の太陽黄経が指すのは、一年を72に分けた繊細な季節区分のうち第${koIdx + 1}候。古来この微小な季節の移ろいは、自然のわずかな機微を映してきました。あなたには、季節の小さな変化を肌で感じ取る感性が生まれながらに宿っています。` },
      { label: "💞 恋愛・人間関係", content: `恋愛や人とのつながりでは、主題の「${lpKey}」と本能の「${ANIMAL_TRAIT[animalIdx]}」が素直に表れます。${MOON_PHASES[phaseIdx][0]}のリズムを持つあなたは、感情の満ち欠けに正直であるほど良縁に恵まれます。無理に自分を作らず、「${MOON_PHASES[phaseIdx][1]}」という自分のテンポを大切にする相手とこそ、深く結ばれます。` },
      { label: "💼 仕事・成果", content: `仕事においては「${lpKey}」を軸に動くと、あなた本来の力が発揮されます。干支「${ANIMALS[animalIdx]}」の持つ「${ANIMAL_TRAIT[animalIdx]}」は、ここぞという場面であなたを後押ししてくれる隠れた武器です。流行や周囲の評価より、自分の主題に沿った働き方を選ぶことが、長い目で見た成果につながります。` },
      { label: "🍀 開運アクション", content: `あなたのラッキーナンバーは${lifePath}。月相「${MOON_PHASES[phaseIdx][0]}」が意味する「${MOON_PHASES[phaseIdx][1]}」を、毎月の月のリズムに合わせて生活に取り入れると運が巡ります。新月には願いを立て、満月には手放す──そんな自然の周期と歩調を合わせることが、あなたにとって最も自然な開運法です。` },
      { label: "⑤ 統合メッセージ", content: `「${lpKey}」を志し、「${ANIMAL_TRAIT[animalIdx]}」を本能に持ち、「${MOON_PHASES[phaseIdx][1]}」のリズムで生きる──これがあなたという唯一無二のコード「${code}」です。4つの実データが一致して指し示すあなたの核を、日々の選択の羅針盤にしてください。` },
    ],
    lucky: { number: String(lifePath) },
    advice: `誕生コード「${code}」は、伝統占術ではなくあなたの誕生日から導いた実データの組み合わせです。だからこそ、世界であなただけのもの。「${lpKey}」という主題を信じて進むとき、あなたの個性は最も輝きます。`,
  };
}
