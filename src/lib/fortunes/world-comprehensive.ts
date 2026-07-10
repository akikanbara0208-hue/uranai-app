import { FortuneResult } from "@/lib/types";

function dateSeed(bd: string): number {
  return (Math.abs(parseInt(bd.replace(/-/g, ""), 10)) || 1) >>> 0;
}
function strSeed(s: string): number {
  let h = 5381;
  for (const c of s) h = (((h << 5) + h) + c.charCodeAt(0)) | 0;
  return (Math.abs(h) || 1) >>> 0;
}
function rng(seed: number) {
  let s = ((seed >>> 0) || 1);
  return (max: number): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s % max;
  };
}
function pick<T>(arr: T[], r: ReturnType<typeof rng>): T {
  return arr[r(arr.length)];
}
function parseDate(bd: string) {
  const parts = bd.split("-").map(Number);
  return { y: parts[0] || 1990, m: parts[1] || 1, d: parts[2] || 1 };
}

// ──────────────────────────────────────────────────────────────
// 簡易的な各占い要素の算出（依存なし・スタンドアロン実装）
// ──────────────────────────────────────────────────────────────

function getLifePathNumber(birthday: string): number {
  const digits = birthday.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, d) => a + d, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return sum;
}

function getWesternSign(m: number, d: number): string {
  // signs[m-1] = 月mの分割日(cut)以降に始まる星座、cut未満は1つ前の星座
  const signs = ["水瓶座","魚座","牡羊座","牡牛座","双子座","蟹座","獅子座","乙女座","天秤座","蠍座","射手座","山羊座"];
  const cuts   = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  return d < cuts[m - 1] ? signs[m - 2 < 0 ? 11 : m - 2] : signs[m - 1];
}

function getChineseZodiac(y: number, m: number, d: number): string {
  const names = ["鼠","牛","虎","兎","龍","蛇","馬","羊","猿","鶏","犬","猪"];
  const adjusted = m < 2 || (m === 2 && d < 4) ? y - 1 : y;
  return names[((adjusted - 4) % 12 + 12) % 12];
}

function getElement(y: number): string {
  // 年の十干による五行。(y-4)%10 は甲=0 起点の天干インデックス。
  // 甲乙=木, 丙丁=火, 戊己=土, 庚辛=金, 壬癸=水 の順に対応する。
  const elements = ["木","火","土","金","水"];
  const idx = Math.floor(((y - 4) % 10 + 10) % 10 / 2);
  return elements[idx];
}

function getTarotMajor(seed: number): { name: string; meaning: string } {
  const cards = [
    { name: "愚者", meaning: "自由な始まりと可能性" },
    { name: "魔術師", meaning: "意志と創造の力" },
    { name: "女教皇", meaning: "直感と内なる知恵" },
    { name: "女帝", meaning: "豊穣と愛の育み" },
    { name: "皇帝", meaning: "安定と構造の力" },
    { name: "教皇", meaning: "伝統と精神的な導き" },
    { name: "恋人", meaning: "選択と心のつながり" },
    { name: "戦車", meaning: "意志による勝利" },
    { name: "力", meaning: "内なる強さと忍耐" },
    { name: "隠者", meaning: "内省と孤独の智慧" },
    { name: "運命の輪", meaning: "変化と巡るサイクル" },
    { name: "正義", meaning: "均衡と因果の法則" },
    { name: "吊られた男", meaning: "視点の転換と犠牲" },
    { name: "死神", meaning: "終わりと変容の始まり" },
    { name: "節制", meaning: "バランスと調整の時" },
    { name: "悪魔", meaning: "解放へのチャレンジ" },
    { name: "塔", meaning: "変革と突破口" },
    { name: "星", meaning: "希望と癒しの光" },
    { name: "月", meaning: "幻想と直感の深み" },
    { name: "太陽", meaning: "喜びと成功の輝き" },
    { name: "審判", meaning: "目覚めと再生" },
    { name: "世界", meaning: "達成と統合の完成" },
  ];
  return cards[seed % cards.length];
}

function getNakshatra(birthday: string): string {
  const nakshatras = [
    "アシュヴィニー","バラニー","クリッティカー","ローヒニー","ムリガシラー",
    "アールドラー","プナルヴァス","プシュヤ","アーシュレーシャー","マガー",
    "プールヴァパールグニー","ウッタラパールグニー","ハスタ","チトラー","スワーティ",
    "ヴィシャーカー","アヌラーダー","ジェーシュタ","ムーラ","プールヴァアシャーダー",
    "ウッタラアシャーダー","シュラヴァナ","ダニシュタ","シャタビシャ","プールヴァバードラパダー",
    "ウッタラバードラパダー","レーヴァティー",
  ];
  const seed = dateSeed(birthday);
  return nakshatras[seed % 27];
}

function getMayaSign(birthday: string): string {
  const signs = [
    "イミシュ（ワニ）","イク（風）","アクバル（夜）","カン（とうもろこし）","チッチャン（蛇）",
    "キミ（死）","マニク（鹿）","ラマット（金星）","ムルク（雨）","オク（犬）",
    "チュエン（猿）","エブ（歯）","ベン（葦）","イシュ（ジャガー）","メン（鷹）",
    "キブ（フクロウ）","カバン（地震）","エズナブ（刃）","カワク（嵐）","アハウ（太陽）",
  ];
  const { y, m, d } = parseDate(birthday);
  const jd = 367 * y - Math.floor(7 * (y + Math.floor((m + 9) / 12)) / 4) + Math.floor(275 * m / 9) + d + 1721013.5;
  const tzolkin = ((jd - 584283) % 260 + 260) % 260;
  return signs[Math.floor(tzolkin) % 20];
}

// ──────────────────────────────────────────────────────────────
// 過去・現在・未来の詳細テンプレート群
// ──────────────────────────────────────────────────────────────

const PAST_THEMES = [
  "幼少期からの感受性と独特の世界観が、今のあなたの核心を形成してきました。",
  "人生の初期に受けた愛情と試練が、あなたの深い共感力と強さの源泉となっています。",
  "過去の別れや変化の経験が、あなたにとって真に大切なものを明確にしてきました。",
  "幼い頃から感じていた「何か違う」という感覚が、あなた独自の視点と才能を育んできました。",
  "過去の失敗と挑戦の積み重ねが、今のあなたの揺るぎない基盤を作り上げています。",
];

const PAST_LESSONS = [
  "あなたの魂は多くの生涯を通じて「愛と自立のバランス」というテーマを深めてきました。今世でそのテーマが結実しようとしています。",
  "過去の困難な状況があなたに「自分を信じる力」という最大の宝を与えました。その宝は今、最も必要な場所で輝き始めています。",
  "これまでの縁と別れの全てが、あなたの魂に不可欠な学びをもたらしました。後悔すべきものは一つもありません。",
  "幾度かの大きな変化を経て、あなたは本物の自分に近づいてきました。過去の自分を誇りに思ってください。",
  "苦労した時期に培われた忍耐と洞察力が、今のあなたの最大の強みとなっています。",
];

const PRESENT_ENERGIES = [
  "今のあなたには変容と成長のエネルギーが強く流れています。これは単なる変化ではなく、魂レベルの進化のプロセスです。",
  "現在のあなたは人生の重要な岐路に立っています。複数の可能性が同時に開いており、選択の力が最大化されています。",
  "今このとき、あなたのエネルギーは静かな充電と準備の時期にあります。表面は穏やかでも、内側では大きな力が蓄積されています。",
  "現在のあなたは過去の努力の実りを受け取る時期に入っています。播いてきた種が芽吹き始めています。",
  "今のあなたには人との深いつながりが大きな課題となっています。関係性を通じて魂が進化する特別な時期です。",
];

const PRESENT_BLOCKS = [
  "現在あなたの前に立っている最大の壁は「自分の価値への疑い」です。しかしその疑いこそが、超えるべき最後の試練です。",
  "今のあなたが解放すべきテーマは「完璧でなければならない」という内なる声です。不完全さの中に最大の美があります。",
  "現在のあなたには「手放すこと」が最も重要な課題です。執着を解放した瞬間、新しいエネルギーが流れ込みます。",
  "今のあなたが超えるべきは「過去のパターン」への無意識の執着です。新しい選択が別の現実を作り出します。",
  "現在のあなたに最も必要なのは「内なる声を信頼すること」です。外の正解より、内側の知恵に従う時が来ています。",
];

const FUTURE_VISIONS = [
  "今から1〜2年以内に、長らく温めていた夢の種が現実の形をとり始めます。その始まりは予想より小さく見えるかもしれませんが、本物の始まりは常に静かです。",
  "3〜5年後のあなたは、今とは全く異なる環境で、今のあなたが夢見る以上の充実を生きています。その道は今すでに開き始めています。",
  "近い未来に、あなたの才能と情熱が交わる「天職の交差点」に到達します。その機会はあなたの準備が整ったときに現れます。",
  "1年以内に大きな縁の転換があります。別れと出会いが同時期に訪れ、その後のあなたの世界を豊かに塗り替えます。",
  "未来のあなたは「今悩んでいることの意味」を深く理解し、それが自分の最大の贈り物だったと気づきます。",
];

const FUTURE_KEYS = [
  "未来を開く鍵は「自分の直感に従う小さな勇気」です。大きな決断より、毎日の小さな「yes」の積み重ねが未来を変えます。",
  "あなたの未来を最も豊かにするのは「本物のつながり」です。量より質の縁を育てることに時間とエネルギーを注いでください。",
  "未来へのキーワードは「行動する前に内省する習慣」です。考える時間が、行動の質と方向性を根本から変えます。",
  "あなたの未来に最も必要なのは「失敗を恐れない実験精神」です。挑戦の数が可能性の量を決めます。",
  "未来を開く最大の鍵は「自分に与える時間と空間」です。創造性と直感は静けさの中で最もよく働きます。",
];

// ──────────────────────────────────────────────────────────────
// 30. 総合鑑定（過去・現在・未来）
// ──────────────────────────────────────────────────────────────

export function getComprehensiveReading(birthday: string, name: string = ""): FortuneResult {
  const { y, m, d } = parseDate(birthday);
  const bdSeed = dateSeed(birthday);
  const nameSeed = name ? strSeed(name) : bdSeed;
  const combinedSeed = (bdSeed ^ nameSeed) >>> 0;
  const r  = rng(combinedSeed);
  const r2 = rng(combinedSeed + 777);
  const r3 = rng(combinedSeed + 1234);

  // 各占い要素の算出
  const lifePathNum   = getLifePathNumber(birthday);
  const westernSign   = getWesternSign(m, d);
  const chineseZodiac = getChineseZodiac(y, m, d);
  const element       = getElement(y);
  const pastCard      = getTarotMajor(bdSeed % 22);
  const presentCard   = getTarotMajor((bdSeed + 7) % 22);
  const futureCard    = getTarotMajor((bdSeed + 14) % 22);
  const nakshatra     = getNakshatra(birthday);
  const mayaSign      = getMayaSign(birthday);

  // 数秘から運命の説明
  const lifePathMeanings: Record<number, string> = {
    1: "独立・革新・先駆者としての使命",
    2: "調和・協力・共感の架け橋としての使命",
    3: "表現・創造・喜びをもたらす使命",
    4: "基盤・安定・現実を構築する使命",
    5: "自由・変化・冒険を通じた使命",
    6: "愛・責任・癒しをもたらす使命",
    7: "探求・知恵・精神的な真実への使命",
    8: "豊かさ・力・物質と精神を統合する使命",
    9: "完成・奉仕・人類への愛の使命",
    11: "直感・啓示・高次の使命",
    22: "宇宙的構造・大きなビジョンを現実化する使命",
  };

  const elementMeanings: Record<string, string> = {
    金: "決断力と義を大切にし、純粋さと秩序を求める魂",
    水: "知恵と柔軟性に満ち、深い感受性で流れを読む魂",
    木: "成長と慈悲の力を持ち、人と自然の循環を大切にする魂",
    火: "情熱と礼を持ち、変革と輝きを世界にもたらす魂",
    土: "信頼と誠実さの基盤となり、豊かさを育む魂",
  };

  const pastTheme    = pick(PAST_THEMES, r);
  const pastLesson   = pick(PAST_LESSONS, r2);
  const presentEnergy = pick(PRESENT_ENERGIES, r3);
  const presentBlock  = pick(PRESENT_BLOCKS, rng(combinedSeed + 2345));
  const futureVision  = pick(FUTURE_VISIONS, rng(combinedSeed + 3456));
  const futureKey     = pick(FUTURE_KEYS, rng(combinedSeed + 4567));

  // ライフタイムテーマの統合
  const lifepathMeaning = lifePathMeanings[lifePathNum] || "多様な可能性を持つ独自の使命";
  const elementMeaning  = elementMeanings[element] || "深い本質を持つ魂";

  // 西洋占星術のエレメント判定
  const astroElement = ["牡羊座","獅子座","射手座"].includes(westernSign) ? "火" :
                       ["牡牛座","乙女座","山羊座"].includes(westernSign) ? "土" :
                       ["双子座","天秤座","水瓶座"].includes(westernSign) ? "風" : "水";

  const astroQuality = ["牡羊座","蟹座","天秤座","山羊座"].includes(westernSign) ? "活動宮（変化を起こす）" :
                       ["牡牛座","獅子座","蠍座","水瓶座"].includes(westernSign) ? "不動宮（持続させる）" : "柔軟宮（適応する）";

  const luckyNumbers = [lifePathNum, (lifePathNum + 3) % 9 + 1, (lifePathNum + 6) % 9 + 1];
  const luckyColors  = ["金色", "紫", "青", "緑", "赤", "白", "橙", "銀"];
  const luckyItems   = ["水晶球", "月のお守り", "天然石", "星のチャーム", "太陽のシンボル"];

  return {
    title: `総合鑑定：${name ? name + "さんの" : ""}過去・現在・未来`,
    summary: `東洋・西洋・古代・スピリチュアルの叡智を横断した総合鑑定です。数秘術「${lifePathNum}（${lifepathMeaning}）」、西洋占星術「${westernSign}」、干支「${chineseZodiac}年生まれ・${element}の気質」、ヴェーダ占星術「${nakshatra}」、マヤ暦「${mayaSign}」──これらが示す魂の青写真と、過去・現在・未来の深層を読み解きます。`,
    details: [
      // ─── 魂の設計図 ───
      {
        label: "【魂の設計図】あなたの本質とは何か",
        content: `数秘術ライフパス「${lifePathNum}」は「${lifepathMeaning}」を示します。西洋占星術の「${westernSign}（${astroElement}・${astroQuality}）」という使命の器に、中国五行「${element}の気質（${elementMeaning}）」が命を吹き込んでいます。ヴェーダ占星術ではナクシャトラ「${nakshatra}」、マヤ暦では「${mayaSign}」のエネルギーを持って生まれました。これら異なる文明の叡智が一致して示すあなたの本質は、${pick(["愛と知恵を統合して世界に何かをもたらす使命", "深い感受性と行動力で他者の人生を変容させる力", "独自の視点と情熱で新しい道を切り開く使命", "誠実さと深い思いやりで周囲を支え育てる力", "自由と創造性で世界を彩り可能性を広げる使命"], rng(combinedSeed + 100))}を持つ魂です。`,
      },
      // ─── 過去 ───
      {
        label: "【過去】あなたを形成してきたもの",
        content: `タロット大アルカナ「${pastCard.name}」があなたの過去のテーマを示しています。このカードの本質「${pastCard.meaning}」は、あなたのこれまでの人生を貫くエネルギーです。\n\n${pastTheme}\n\n干支「${chineseZodiac}」の本能と「${element}」の気質が幼少期から今日まで、あなたの基本的な反応パターンと世界との関わり方を決定してきました。その中で育まれた「${lifepathMeaning}」の種が、様々な経験を通じて確かに芽を出してきています。`,
      },
      {
        label: "【過去】魂が学んできた教訓",
        content: `${pastLesson}\n\nマヤ暦の「${mayaSign}」に生まれた魂は、過去において「創造と表現のテーマ」を繰り返し体験してきました。そしてヴェーダ占星術の「${nakshatra}」というナクシャトラは、あなたが過去から現在まで育ててきた深い内なる才能を示しています。過去の全ての経験は、偶然ではなく魂の精密な計画によるものです。`,
      },
      // ─── 現在 ───
      {
        label: "【現在】今この瞬間の位置",
        content: `タロット「${presentCard.name}」があなたの現在のエネルギーを照らし出しています。「${presentCard.meaning}」という本質が今のあなたに働きかけています。\n\n${presentEnergy}\n\n${westernSign}という星座の${astroQuality}のエネルギーと、${element}の気質が今の状況に対してどう反応しているかを見ると、あなたは今「${lifePathNum}」のライフパスナンバーが示す道の上で、重要な選択点にいることがわかります。`,
      },
      {
        label: "【現在】今解放すべきもの・超えるべき課題",
        content: `${presentBlock}\n\nナクシャトラ「${nakshatra}」の持ち主に共通する現在の課題は、「持っている深い知恵を外に表現すること」です。内側に豊かなものを持ちながら、それを世界に出すことへの躊躇が今のあなたの最大の試練です。「${westSignComplex(westernSign)}」という星のサポートを受けながら、この課題を意識的に取り組んでください。`,
      },
      // ─── 未来 ───
      {
        label: "【未来】これから開いていく可能性",
        content: `タロット「${futureCard.name}」があなたの未来の方向性を指し示しています。「${futureCard.meaning}」というエネルギーが今後のあなたの人生に流れ込んできます。\n\n${futureVision}\n\nマヤ暦「${mayaSign}」のサイクルは、${2 + (bdSeed % 3)}年後に重要な転換点を示しています。その時期に向けて、今から意識を整えていくことで、最良のタイミングで最大の飛躍を受け取ることができます。`,
      },
      {
        label: "【未来】未来を最大化する鍵",
        content: `${futureKey}\n\nライフパス「${lifePathNum}」の魂が未来において最も輝くとき、それは「${lifepathMeaning}」のテーマを人生の中心に置いたときです。${element}の気質を持つあなたは、${element === "火" ? "情熱を行動に変える即断力" : element === "水" ? "柔軟に状況に適応する知恵" : element === "木" ? "着実に成長を積み上げる忍耐" : element === "金" ? "本質を見極める鋭い判断力" : "地に足のついた誠実な積み重ね"}を活かすことで、未来の扉が最も力強く開きます。`,
      },
      // ─── 統合メッセージ ───
      {
        label: "【統合】宇宙からあなたへのメッセージ",
        content: `東洋・西洋・古代・現代の叡智が一致して告げるメッセージがあります。\n\n「${westernSign}」の感受性、「${chineseZodiac}」の本能、「${element}」の気質、「ライフパス${lifePathNum}」の使命、「${nakshatra}」の才能、「${mayaSign}」のエネルギー──これらは全て、あなたという一つの魂のさまざまな側面です。過去の全ての経験は必然であり、現在の全ての課題は成長への招待状であり、未来の全ての可能性はすでに種として存在しています。\n\n宇宙はあなたを通じて何かを表現しようとしています。その表現の道具となることに「YES」と答えるとき、人生は最も豊かに、そして最も美しく流れ始めます。`,
      },
    ],
    lucky: {
      number: luckyNumbers.join(" / "),
      color:  pick(luckyColors, r),
      item:   pick(luckyItems, rng(combinedSeed + 9999)),
    },
    advice: `過去（${pastCard.name}）・現在（${presentCard.name}）・未来（${futureCard.name}）──タロットの三枚が示す流れの中に、あなたの人生の大きな物語があります。過去の経験を宝として、現在の課題に勇気を持って向き合い、未来のビジョンを信頼する。その三つが揃ったとき、あなたの人生は「${lifepathMeaning}」という本来の使命を生き始めます。`,
  };
}

function westSignComplex(sign: string): string {
  const map: Record<string, string> = {
    "牡羊座": "行動と先駆けの星座",
    "牡牛座": "安定と豊かさの星座",
    "双子座": "知性と表現の星座",
    "蟹座":   "感情と家族の星座",
    "獅子座": "創造と輝きの星座",
    "乙女座": "奉仕と完璧の星座",
    "天秤座": "調和と美の星座",
    "蠍座":   "変容と深さの星座",
    "射手座": "自由と哲学の星座",
    "山羊座": "野心と構造の星座",
    "水瓶座": "革新と人類愛の星座",
    "魚座":   "共感と直感の星座",
  };
  return map[sign] || sign;
}
