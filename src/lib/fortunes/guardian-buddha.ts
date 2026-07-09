import { FortuneResult } from "@/lib/types";

// ══════════════════════════════════════════════
// 十二支守り本尊（八体仏）
// 生まれ年の干支ごとに守護する仏が伝統的に定まっている（真言宗などに伝わる確立した対応）。
// ══════════════════════════════════════════════

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ANIMALS = ["ねずみ", "うし", "とら", "うさぎ", "たつ", "へび", "うま", "ひつじ", "さる", "とり", "いぬ", "いのしし"];

type Buddha = {
  name: string;
  branches: string[];     // 守護する干支
  benefit: string;        // ご利益
  guard: string;          // 守護・本質
  mantra: string;         // 真言
  ennichi: string;        // 縁日
  message: string;
  item: string;
};

// 干支インデックス(0=子) → 守り本尊
const GUARDIAN_BY_BRANCH: Buddha[] = (() => {
  const senju: Buddha = {
    name: "千手観音菩薩", branches: ["子"],
    benefit: "あらゆる願いを聞き届け、苦しみから救う。災難除け・縁結び・諸願成就",
    guard: "千の手と千の眼で見落としなく人々を救う大慈悲の仏。困っている人を放っておけないあなたの優しさは、この仏の慈悲と響き合っています。",
    mantra: "オン バザラ タラマ キリク",
    ennichi: "毎月17日",
    message: "あなたの手は誰かを救うためにある。差し伸べた手は、巡り巡って自分を救う。",
    item: "水晶の数珠",
  };
  const kokuzo: Buddha = {
    name: "虚空蔵菩薩", branches: ["丑", "寅"],
    benefit: "無限の知恵と記憶力、智慧と福徳を授ける。学業・技芸・記憶力向上",
    guard: "宇宙（虚空）のように無限の智慧と慈悲を蔵する仏。知識を求め、コツコツ積み上げるあなたの努力に、計り知れない智慧の蔵が開かれます。",
    mantra: "ノウボウ アキャシャ キャラバヤ オン アリキャ マリ ボリ ソワカ",
    ennichi: "毎月13日",
    message: "学びは裏切らない。今日積んだ一つが、いつか無限の蔵となって返る。",
    item: "黄色の石（シトリン）",
  };
  const monju: Buddha = {
    name: "文殊菩薩", branches: ["卯"],
    benefit: "「三人寄れば文殊の知恵」の智慧の仏。学業成就・合格・判断力",
    guard: "鋭い智慧の剣で迷いを断ち切る仏。物事の本質を見抜き、正しく判断する力を授けます。考える力に長けたあなたの導き手です。",
    mantra: "オン アラハシャ ノウ",
    ennichi: "毎月25日",
    message: "迷ったら、本質を見よ。あなたの中の智慧の剣が、必ず道を照らす。",
    item: "青い石（ラピスラズリ）",
  };
  const fugen: Buddha = {
    name: "普賢菩薩", branches: ["辰", "巳"],
    benefit: "慈悲と実践の仏。延命・増益・女性の守護・行動力",
    guard: "白い象に乗り、慈悲の実践を司る仏。理想を「行い」に移す力を授けます。信念を持って静かに進むあなたを、長く力強く守護します。",
    mantra: "オン サンマヤ サトバン",
    ennichi: "毎月14日",
    message: "願うだけでなく、行いなさい。一歩の実践が、千の祈りに勝る。",
    item: "白い石（ハウライト）",
  };
  const seishi: Buddha = {
    name: "勢至菩薩", branches: ["午"],
    benefit: "智慧の光ですべてを照らす。智慧明瞭・家内安全・災難除け",
    guard: "智慧の光で人々の迷いの闇を照らす仏。情熱と行動力にあふれるあなたの内なる光を、正しい方向へ導きます。",
    mantra: "オン サンザンサク ソワカ",
    ennichi: "毎月23日",
    message: "あなたの光は人を照らすためにある。まず、自分の足元を照らしなさい。",
    item: "金色の石（ルチルクォーツ）",
  };
  const dainichi: Buddha = {
    name: "大日如来", branches: ["未", "申"],
    benefit: "宇宙の根本仏。すべての仏の中心。所願成就・現世安穏・健康長寿",
    guard: "密教における宇宙の真理そのもの、すべての仏の根源。穏やかで全体を支えるあなたの本質は、万物を照らす太陽（大日）と重なります。",
    mantra: "オン アビラウンケン バザラ ダトバン",
    ennichi: "毎月28日",
    message: "あなたはすでに、すべてを照らす光の一部。焦らず、ただ在るだけで満ちている。",
    item: "太陽の石（サンストーン）",
  };
  const fudo: Buddha = {
    name: "不動明王", branches: ["酉"],
    benefit: "煩悩を断ち、迷いを打ち砕く。厄除け・魔除け・勝負運・決断力",
    guard: "燃え盛る炎を背負い、揺るがぬ意志で人々を守る明王。困難に動じない強さと、誘惑を断つ決断力を授けます。芯の強いあなたの守護者です。",
    mantra: "ノウマク サンマンダ バザラダン カン",
    ennichi: "毎月28日",
    message: "動じるな。炎の中に立っても揺るがぬ心が、すべての厄を焼き払う。",
    item: "赤い石（ガーネット）",
  };
  const amida: Buddha = {
    name: "阿弥陀如来", branches: ["戌", "亥"],
    benefit: "無量の光と寿命で人々を救う。極楽往生・現世安穏・家庭円満",
    guard: "無限の光（無量光）と無限の命（無量寿）を持つ救いの仏。誠実で情に厚いあなたを、深い慈悲で包み込み、安らぎへと導きます。",
    mantra: "オン アミリタ テイゼイ カラ ウン",
    ennichi: "毎月15日",
    message: "そのままのあなたで救われている。肩の力を抜いて、安心して歩みなさい。",
    item: "紫の石（アメジスト）",
  };
  return [senju, kokuzo, kokuzo, monju, fugen, fugen, seishi, dainichi, dainichi, fudo, amida, amida];
})();

export function getGuardianBuddhaReading(birthday: string): FortuneResult {
  const [y, m, d] = birthday.split("-").map(Number);
  // 干支は立春（2/4頃）を境に替わる
  const baziYear = (m === 1 || (m === 2 && d < 4)) ? y - 1 : y;
  const branchIdx = ((baziYear - 4) % 12 + 12) % 12;
  const branch = BRANCHES[branchIdx];
  const animal = ANIMALS[branchIdx];
  const buddha = GUARDIAN_BY_BRANCH[branchIdx];

  return {
    title: `あなたの守り本尊は「${buddha.name}」`,
    summary: `${branch}（${animal}）年生まれのあなたを生涯にわたり守護する本尊は「${buddha.name}」です。十二支ごとに守り本尊が定まるのは、古くから日本に伝わる確かな信仰です。一生に一体、変わることなく寄り添う守護仏があなたにはついています。`,
    details: [
      { label: `🪷 守り本尊：${buddha.name}`, content: buddha.guard },
      { label: "🙏 ご利益（功徳）", content: buddha.benefit },
      { label: "❤️ 恋愛・人間関係へのご加護", content: `${buddha.name}の慈悲は、あなたの人間関係にもやさしく及びます。「${buddha.benefit.split("。")[0]}」の力は、誠実な縁を結び、こじれた関係をほどく後押しとなります。人に向けた思いやりは、めぐりめぐってあなた自身を守る力に変わっていきます。` },
      { label: "💼 仕事・学びへのご加護", content: `迷いや困難の多い場面でこそ、${buddha.name}のご加護は強く働きます。本尊の存在を意識すると、判断に芯が通り、重ねた努力が実を結びやすくなります。焦らず一歩ずつ積み上げる姿勢が、最良の結果へとつながります。` },
      { label: "📿 ご真言", content: `「${buddha.mantra}」── この真言を心静かに唱えると、本尊との縁が深まります。` },
      { label: "🗓 縁日", content: `${buddha.ennichi}。この日に手を合わせると、ご加護がいっそう高まると伝わります。` },
      { label: "💬 本尊からのメッセージ", content: `「${buddha.message}」` },
      { label: "🌸 開運アクション", content: `ラッキーアイテムである「${buddha.item}」を身につけたり、目に入る場所に置いたりすると、本尊との縁が結ばれやすくなります。朝の静かな時間に手を合わせ、感謝を伝える習慣を持つとよいでしょう。小さな祈りの積み重ねが、見えない加護を少しずつ厚くしていきます。` },
    ],
    lucky: { item: buddha.item, number: String(branchIdx + 1) },
    advice: `守り本尊は、特別な修行をせずとも、心の中で手を合わせるだけであなたを見守ってくれる身近な存在です。うれしいときも苦しいときも、${buddha.name}を思い浮かべ、静かに語りかけてみてください。古来、人々はそうして見えない力に支えられながら、日々を生き抜いてきました。`,
  };
}
