import { FortuneResult } from "@/lib/types";
import { julianDay, getSunLongitude } from "@/lib/fortunes/astrology";

// ══════════════════════════════════════════════
// パワーストーン占い
// 生まれた日の太陽星座を実計算し、星座に伝統的に対応づけられた守護石を導く。
// （パワーストーン文化は現代スピリチュアルだが、星座と宝石の対応は古くから文書化されている）
// ══════════════════════════════════════════════

type SignStone = {
  sign: string;
  stones: { name: string; effect: string }[];
  theme: string;
  care: string;
};

const SIGN_STONES: SignStone[] = [
  { sign: "牡羊座", theme: "情熱・行動・勝負", care: "月光浴で浄化", stones: [
    { name: "カーネリアン", effect: "やる気と行動力を高め、目標達成を後押しする" },
    { name: "ガーネット", effect: "情熱と持久力を授け、努力を実りに変える" },
    { name: "ルビー", effect: "勝負運とカリスマ性を引き出す" }] },
  { sign: "牡牛座", theme: "愛・豊かさ・安定", care: "流水で浄化", stones: [
    { name: "ローズクォーツ", effect: "愛と優しさを育て、人間関係を円満にする" },
    { name: "エメラルド", effect: "豊かさと癒しをもたらし、心を安定させる" },
    { name: "翡翠", effect: "繁栄と健康、徳を積む力を授ける" }] },
  { sign: "双子座", theme: "知性・伝達・好奇心", care: "セージで浄化", stones: [
    { name: "シトリン", effect: "明るさと金運、コミュニケーション力を高める" },
    { name: "アゲート（瑪瑙）", effect: "心のバランスを保ち、良い縁を結ぶ" },
    { name: "フローライト", effect: "思考をクリアにし、学びを深める" }] },
  { sign: "蟹座", theme: "感情・家庭・癒し", care: "月光浴で浄化", stones: [
    { name: "ムーンストーン", effect: "感情を穏やかに整え、直感を高める" },
    { name: "パール（真珠）", effect: "母性と優しさ、心の平安を授ける" },
    { name: "アクアマリン", effect: "癒しと安心をもたらし、絆を深める" }] },
  { sign: "獅子座", theme: "自信・輝き・創造", care: "日光に短時間あてる", stones: [
    { name: "タイガーアイ", effect: "決断力と洞察力、金運を引き寄せる" },
    { name: "サンストーン", effect: "自信と生命力を高め、存在感を放つ" },
    { name: "ルビー", effect: "情熱とリーダーシップを輝かせる" }] },
  { sign: "乙女座", theme: "調整・誠実・健康", care: "水晶クラスターで浄化", stones: [
    { name: "ペリドット", effect: "心の曇りを払い、前向きさと健康を保つ" },
    { name: "アマゾナイト", effect: "迷いを整理し、希望へ導く" },
    { name: "サファイア", effect: "誠実さと集中力、知性を高める" }] },
  { sign: "天秤座", theme: "調和・美・人間関係", care: "月光浴で浄化", stones: [
    { name: "ラピスラズリ", effect: "幸運と真実を呼び、邪気を払う" },
    { name: "ローズクォーツ", effect: "愛と美、調和の縁を引き寄せる" },
    { name: "オパール", effect: "魅力と表現力、感性を高める" }] },
  { sign: "蠍座", theme: "変容・洞察・守護", care: "セージで浄化", stones: [
    { name: "オブシディアン", effect: "強力に邪気を払い、本質を見抜く力を授ける" },
    { name: "マラカイト", effect: "変容を支え、心身を守る" },
    { name: "トパーズ", effect: "希望と再生、目標達成を後押しする" }] },
  { sign: "射手座", theme: "拡大・冒険・自由", care: "流水で浄化", stones: [
    { name: "ターコイズ", effect: "旅と挑戦を守り、成功へ導く" },
    { name: "アメジスト", effect: "直感と精神性を高め、心を鎮める" },
    { name: "ラピスラズリ", effect: "幸運と高い視座をもたらす" }] },
  { sign: "山羊座", theme: "堅実・達成・責任", care: "水晶クラスターで浄化", stones: [
    { name: "ガーネット", effect: "努力を実りに変え、持久力を授ける" },
    { name: "オニキス", effect: "意志を固め、誘惑や邪気から守る" },
    { name: "水晶（クリスタル）", effect: "全体を浄化し、目標達成を支える万能石" }] },
  { sign: "水瓶座", theme: "独創・自由・革新", care: "月光浴で浄化", stones: [
    { name: "アメジスト", effect: "直感とひらめき、精神の安定をもたらす" },
    { name: "アクアマリン", effect: "自由な発想とコミュニケーションを促す" },
    { name: "フローライト", effect: "独創性と集中力、天才性を引き出す" }] },
  { sign: "魚座", theme: "直感・共感・癒し", care: "月光浴で浄化", stones: [
    { name: "アクアマリン", effect: "感受性を癒し、慈愛と安らぎを授ける" },
    { name: "アメジスト", effect: "霊性と直感を高め、心を浄化する" },
    { name: "ムーンストーン", effect: "夢と直感を導き、感情を整える" }] },
];

export function getPowerStoneReading(birthday: string): FortuneResult {
  const [y, m, d] = birthday.split("-").map(Number);
  const signIdx = Math.floor(getSunLongitude(julianDay(y, m, d)) / 30) % 12;
  const s = SIGN_STONES[signIdx];
  const main = s.stones[0];

  return {
    title: `あなたの守護石は「${main.name}」`,
    summary: `生まれた日の太陽星座は「${s.sign}」。星座と宝石の対応は古くから文書に残されており、${s.sign}には守護の石が伝統的に定められています。あなたのテーマは「${s.theme}」。この方向を後押ししてくれるパワーストーンをご紹介します。`,
    details: [
      { label: `💎 第一の守護石：${main.name}`, content: `${main.effect}。${s.sign}のあなたを最も力強く支える石です。` },
      { label: "✨ 相性のよい石", content: s.stones.slice(1).map((st) => `「${st.name}」── ${st.effect}`).join("\n") },
      { label: "🌟 守護石のテーマ", content: `${s.sign}の守護石は「${s.theme}」を後押しします。この方向で力を借りると、石のエネルギーとあなたの本質が響き合います。` },
      { label: "❤️ 恋愛・対人へのサポート", content: `${s.sign}のテーマ「${s.theme}」は、人との関わりの中でも力を発揮します。守護石「${main.name}」を身につけると、自分らしさを保ちながら良い縁を引き寄せやすくなります。相性のよい石を組み合わせれば、関係に調和とあたたかさが生まれます。` },
      { label: "💼 仕事・金運へのサポート", content: `「${s.theme}」の方向に沿って動くとき、${s.sign}のあなたの運気はもっとも伸びやかになります。守護石「${main.name}」は${main.effect}石として、ここぞという場面であなたを後押しします。焦らず本質を大切にする姿勢が、結果として豊かさを呼び込みます。` },
      { label: "🧼 浄化の方法", content: `おすすめの浄化法は「${s.care}」。パワーストーンは身につけるうちにエネルギーが曇るため、定期的に浄化するとよいとされます。` },
      { label: "🌙 開運アクション", content: `朝、「${main.name}」をそっと握って「${s.theme}」を一日の意図として込めると、${s.sign}のあなたらしいエネルギーが整いやすくなります。曇りを感じたら「${s.care}」で早めにリセットすることも忘れずに。` },
      { label: "🤝 石とのつき合い方", content: `${s.sign}のあなたには、第一の守護石「${main.name}」だけでなく、「${s.stones.slice(1).map((st) => st.name).join("」「")}」との組み合わせも力になります。身につける・持ち歩く・枕元に置くなど、「${s.theme}」を意識しながら生活に取り入れてみてください。` },
    ],
    lucky: { item: main.name },
    advice: `パワーストーンは、持つ人の意識と響き合ってこそ力を発揮するといわれます。「${main.name}」を完璧なお守りとして崇めるより、本質を思い出させてくれる相棒として、肩の力を抜いてつき合ってみてください。あなた自身が「${s.theme}」を生きようとする一歩こそが、何よりの開運につながります。`,
  };
}
