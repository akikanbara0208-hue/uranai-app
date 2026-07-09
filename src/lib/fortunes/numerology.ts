import { FortuneResult } from "@/lib/types";

const LIFE_PATH: Record<number, {
  title: string; archetype: string; description: string;
  strength: string; challenge: string; shadow: string;
  love: string; career: string; money: string; health: string;
  famous: string; compatible: string[]; advice: string;
}> = {
  1: {
    title: "パイオニア", archetype: "先駆者・創始者",
    description: "独立した精神と強いリーダーシップで新しい道を切り開く使命を持ちます。",
    strength: "独創性、決断力、自信、革新性、先見の明",
    challenge: "傲慢さ、孤独、他者への依存が苦手、協調性の欠如",
    shadow: "過度な自己主張と支配欲。一人で全てを抱え込もうとする",
    love: "対等なパートナーシップを求める。束縛を嫌い、独立した恋愛スタイル。相手の自立を尊重する",
    career: "起業家、経営者、発明家、政治家、スポーツ選手。独立した立場が最適",
    money: "お金を稼ぐ力は強いが使い方が大胆。長期的な財務計画を持つことが大切",
    health: "頭痛や眼精疲労に注意。過度のストレスが体に出やすい。適度な運動と休息を",
    famous: "マハトマ・ガンジー、スティーブ・ジョブズ、マーティン・ルーサー・キング",
    compatible: ["3", "5"],
    advice: "他者に頼ることも強さだと知ることで、人生がより豊かになります。",
  },
  2: {
    title: "協調者", archetype: "外交官・調停者",
    description: "平和と調和を愛し、人と人を結びつける橋渡しの使命を持ちます。",
    strength: "共感力、協調性、直感力、忍耐、献身性",
    challenge: "自分の意見を言えない、依存傾向、過度な気遣いでの疲弊",
    shadow: "受け身すぎる態度と他者の評価への過度な依存",
    love: "深い絆と安心感のある関係を好む。献身的だが自己犠牲になりすぎないように",
    career: "カウンセラー、外交官、保育士、医療福祉、パートナーシップビジネス",
    money: "お金への執着は少ない。パートナーとの共同財産管理が向いている",
    health: "感情的なストレスが消化器系に出やすい。境界線を作り自分を守ることが大切",
    famous: "オードリー・ヘプバーン、ダイアナ妃、バラク・オバマ",
    compatible: ["6", "8"],
    advice: "自分自身を大切にすることも、他者への愛と同じくらい重要です。",
  },
  3: {
    title: "表現者", archetype: "芸術家・コミュニケーター",
    description: "創造力と表現力に溢れた芸術家。喜びを世界に広める使命を持ちます。",
    strength: "創造性、コミュニケーション力、楽観主義、ユーモア、魅力",
    challenge: "散漫さ、表面的になりがち、感情の分散",
    shadow: "自己表現への過度な依存と批判への脆弱性",
    love: "楽しく刺激的な恋愛を好む。会話の弾む相手に惹かれる。冗談が通じる関係を大切に",
    career: "芸術家、作家、俳優、教師、デザイナー、カウンセラー、コメディアン",
    money: "稼ぐのも使うのも大胆。財務管理のサポートを借りると安心",
    health: "喉・声・甲状腺に注意。創造的な表現ができないとストレスが体に出る",
    famous: "ジャスティン・ビーバー、デヴィッド・ボウイ、セリーヌ・ディオン",
    compatible: ["1", "5"],
    advice: "才能を一点に集中させることで、素晴らしい作品が生まれます。",
  },
  4: {
    title: "建設者", archetype: "職人・基盤構築者",
    description: "実直で信頼できる基盤構築者。着実に現実を積み上げる使命を持ちます。",
    strength: "誠実さ、組織力、忍耐力、実用性、信頼性",
    challenge: "変化への抵抗、頑固さ、創造性の制限",
    shadow: "完璧主義から来る硬直さと感情の抑圧",
    love: "安定した長期的な関係を求める。誠実で責任感のあるパートナーを好む",
    career: "建築家、エンジニア、会計士、マネージャー、大工、農業、行政",
    money: "堅実な財務管理の才能。しかし時に節約しすぎて楽しみを犠牲にする",
    health: "骨・関節・背骨に注意。完璧主義から来るストレスに気をつけて",
    famous: "オプラ・ウィンフリー、アーノルド・シュワルツェネッガー、ビル・ゲイツ",
    compatible: ["2", "6"],
    advice: "完璧を求めすぎず、時には流れに乗ることも大切です。",
  },
  5: {
    title: "自由人", archetype: "冒険家・変革者",
    description: "変化と自由を愛する冒険家。多様な体験を通じて知恵を広める使命。",
    strength: "適応力、自由への欲求、多才さ、魅力、冒険心",
    challenge: "一つのことへの継続、責任感の醸成、散漫になりがち",
    shadow: "過度な自由への執着と責任からの逃避",
    love: "自由と刺激を共に楽しめるパートナーを求める。束縛されない関係が最適",
    career: "旅行業、マーケター、セールス、フリーランス、ジャーナリスト、冒険家",
    money: "稼ぐのは得意だが計画的な管理が苦手。緊急時の備えを大切に",
    health: "神経系・副腎に注意。変化のない生活はストレスに。適度な刺激が必要",
    famous: "エルヴィス・プレスリー、マーカス・アウレリウス、アンジェリーナ・ジョリー",
    compatible: ["1", "3"],
    advice: "自由を大切にしながら、深く根を張ることも忘れずに。",
  },
  6: {
    title: "愛の守護者", archetype: "癒し手・奉仕者",
    description: "愛と奉仕の心を持つ癒し手。家族とコミュニティを守る使命を持ちます。",
    strength: "愛情深さ、責任感、思いやり、芸術的センス、忠誠心",
    challenge: "過保護、完璧主義、自己犠牲の傾向",
    shadow: "コントロール欲求とマルチシップ（全てを一人で抱える）",
    love: "深く愛し尽くす。家庭を最優先にする献身的なパートナー。安定と調和を求める",
    career: "医療・福祉・教育・カウンセリング・インテリア・料理・デザイン",
    money: "家族や愛する人への投資を惜しまない。自分自身への投資も大切に",
    health: "心臓・血圧・婦人科系に注意。他者のケアに集中しすぎて自分の健康を犠牲にしがち",
    famous: "ジョン・レノン、マイケル・ジャクソン、エルトン・ジョン",
    compatible: ["2", "4"],
    advice: "自分自身を十分に愛することが、他者を真に愛する源です。",
  },
  7: {
    title: "求道者", archetype: "賢者・探求者",
    description: "真理と知恵を追い求める探求者。深い洞察で世界に光をもたらす使命。",
    strength: "分析力、直感、精神性、知的好奇心、洞察力",
    challenge: "孤立感、過度な分析、信頼の難しさ",
    shadow: "完全な孤独への執着と現実世界への不満",
    love: "精神的な深さを共有できるパートナーを求める。数少ない深い縁を大切にする",
    career: "研究者、哲学者、占い師、心理士、技術者、作家、スピリチュアル実践者",
    money: "物質より精神を重視。お金そのものへの執着は少ないが、困窮しやすいことも",
    health: "消化器・神経系に注意。孤独すぎる生活は精神に影響。自然の中で充電を",
    famous: "レオナルド・ダ・ヴィンチ、チャールズ・ダーウィン、マリー・キュリー",
    compatible: ["3", "5"],
    advice: "内なる知恵を信頼し、時には他者と分かち合ってください。",
  },
  8: {
    title: "力の体現者", archetype: "達成者・権力者",
    description: "物質と精神の両世界をつなぐ達成者。豊かさを創造し分かち合う使命。",
    strength: "実行力、野心、ビジネスセンス、権威、組織力",
    challenge: "お金と権力への執着、ワーカホリック傾向",
    shadow: "物質主義への過度な傾倒と感情の無視",
    love: "強さと成功を尊重するパートナーを求める。対等なパワーカップルが理想",
    career: "経営者、投資家、法律家、不動産、銀行家、政治家",
    money: "財を築く大きな能力を持つ。ただし失うことへの恐れを手放すことが成長の鍵",
    health: "過労・ストレスが体に直結。権力への欲求が緊張を生む。体を動かすことでリリースを",
    famous: "エリザベス・テイラー、ジェフ・ベゾス、マドンナ",
    compatible: ["2", "4"],
    advice: "物質的な成功は手段であり、目的ではありません。",
  },
  9: {
    title: "人類の奉仕者", archetype: "完成者・ヒューマニスト",
    description: "博愛と慈悲の心を持つ完成者。全人類への愛と奉仕の使命を持ちます。",
    strength: "慈悲、寛大さ、創造力、カリスマ、知恵",
    challenge: "執着の手放し、高い理想と現実のバランス",
    shadow: "殉教者的思考と感情的な孤独感",
    love: "すべての人を愛するが故に、特定の人との深い関係が難しいことも。深い共感力が魅力",
    career: "芸術家、医療、教育、慈善活動、スピリチュアル、社会活動",
    money: "お金より使命を優先。ただし自分の経済的基盤を安定させることも大切",
    health: "免疫系・皮膚に注意。感情の解放が健康の鍵。アート療法が効果的",
    famous: "マザー・テレサ、ガンジー、ボブ・マーリー",
    compatible: ["3", "6"],
    advice: "まず自分を満たすことで、より多くの人に与えられます。",
  },
  11: {
    title: "霊的インスピレーター", archetype: "ヴィジョナリー・使者",
    description: "高い直感と霊的な洞察力を持つ使者。インスピレーションで世界を照らす使命。",
    strength: "直感、霊感、インスピレーション、理想主義、カリスマ",
    challenge: "敏感すぎる神経系、地に足をつけること",
    shadow: "高すぎる理想からの挫折感と現実逃避",
    love: "魂レベルのつながりを求める。高い理想を持つパートナーとの精神的な融合",
    career: "スピリチュアルリーダー、芸術家、発明家、心理士、教師",
    money: "霊感と直感で財を得ることも。しかし現実的な計画も必要",
    health: "神経系が非常に繊細。刺激の少ない環境と瞑想が不可欠",
    famous: "ニコラ・テスラ、ハリー・フーディーニ、ジェニファー・アニストン",
    compatible: ["2", "6"],
    advice: "あなたの高い感受性は才能です。それを世界のために使いましょう。",
  },
  22: {
    title: "マスタービルダー", archetype: "偉大な建設者",
    description: "壮大なビジョンを現実にする力を持つ究極の建設者。",
    strength: "実用的な理想主義、組織力、規律、大局観",
    challenge: "自己批判と完璧主義を手放すこと",
    shadow: "桁外れのプレッシャーとそれに伴う麻痺",
    love: "使命と愛のバランスを保つことが課題。深い絆を大切に",
    career: "大企業経営者、建築家、政治家、NGOリーダー、都市計画家",
    money: "大きな財を動かす能力がある。社会的な富の創出が使命",
    health: "過度な責任感から来るストレス。定期的な休息と遊びを取り入れて",
    famous: "ダライ・ラマ、アインシュタイン、シュリ・チンモイ",
    compatible: ["4", "8"],
    advice: "あなたには世界を変える力があります。一歩一歩着実に。",
  },
  33: {
    title: "マスターヒーラー", archetype: "愛の教師",
    description: "無条件の愛で世界を癒す使命を持つ最高の奉仕者。",
    strength: "無条件の愛、癒しの力、創造性、奉仕心",
    challenge: "自己犠牲の傾向を手放し、愛のバランスを保つこと",
    shadow: "殉教者的傾向と自分を後回しにしすぎる傾向",
    love: "すべての存在への愛が溢れる。パートナーには精神的成長を求める",
    career: "ヒーラー、教師、スピリチュアルカウンセラー、芸術家",
    money: "物質より精神と愛を優先。豊かさは愛から自然に生まれると信じている",
    health: "心臓・循環器系に注意。愛するほど与えるが、自分への愛も同量必要",
    famous: "フランシス・アシジ、テンジン・ギャツォ（現ダライ・ラマ）",
    compatible: ["6", "9"],
    advice: "自分への愛が、世界への愛の源泉です。",
  },
};

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: "リーダー的な自己表現。独立心が強く、自分の言葉と行動で世界に影響を与える",
  2: "穏やかで協調的な自己表現。調和の中で人を導く表現者",
  3: "クリエイティブで魅力的な自己表現。言葉と芸術で人を惹きつける",
  4: "信頼感と安定感を与える自己表現。誠実な姿が人を安心させる",
  5: "自由で魅力的な自己表現。変化と冒険の中で輝く",
  6: "愛と思いやりの自己表現。人を癒し守る姿が印象的",
  7: "知的で神秘的な自己表現。深い洞察力が人を魅了する",
  8: "力強く権威ある自己表現。成功と達成が周囲に影響を与える",
  9: "寛大で包容力ある自己表現。全てを包む愛が自然に溢れる",
};

const SOUL_URGE_MEANINGS: Record<number, string> = {
  1: "魂が最も望むのは：自立と先駆者としての道。自分の力で道を切り開くことに深い満足感を感じる",
  2: "魂が最も望むのは：調和と深い繋がり。人との深い関係の中に真の喜びを見出す",
  3: "魂が最も望むのは：自己表現と創造。自分の内なる世界を表現することで魂が満たされる",
  4: "魂が最も望むのは：安定と秩序。確固たる基盤の上で積み上げることに満足感を感じる",
  5: "魂が最も望むのは：自由と体験。多様な経験を通じて世界を感じることに喜びがある",
  6: "魂が最も望むのは：愛と奉仕。誰かを愛し守ることに魂の深い充足感がある",
  7: "魂が最も望むのは：真理と知恵。宇宙の秘密を理解することが最大の喜び",
  8: "魂が最も望むのは：達成と認知。目標を達成し実力を認められることに満足感を感じる",
  9: "魂が最も望むのは：奉仕と完成。人類全体に貢献することが魂の最深の使命",
};

// 今年の個人年数
function getPersonalYear(birthday: string, currentYear: number): number {
  const [, monthStr, dayStr] = birthday.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const sum = month + day + currentYear;
  const digits = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  return digits > 9 ? String(digits).split("").map(Number).reduce((a, b) => a + b, 0) : digits;
}

const PERSONAL_YEAR_MEANINGS: Record<number, string> = {
  1: "新しいサイクルの始まりの年。種を蒔く年。新しいプロジェクトや方向性のスタートに最適",
  2: "関係と協力の年。忍耐と外交が鍵。パートナーシップが深まる年",
  3: "自己表現と創造性の年。社交的な機会が増える。喜びと楽しみを大切に",
  4: "基盤を固める年。努力と規律が問われる年。長期的な計画を実行に移す",
  5: "変化と自由の年。予期せぬ展開が多い。柔軟性を持って変化を歓迎して",
  6: "責任と奉仕の年。家族や人間関係に焦点が当たる。癒しと愛の年",
  7: "内省と成長の年。学びと精神性が深まる年。一人の時間を大切に",
  8: "達成と豊かさの年。努力が実を結ぶ年。財務と仕事に大きな展開",
  9: "完成と解放の年。古いものを手放す年。次のサイクルへの準備",
};

function reduceToSingleDigit(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n < 10) return n;
  return reduceToSingleDigit(String(n).split("").reduce((sum, d) => sum + Number(d), 0));
}

function getLifePathNumber(birthday: string): number {
  const digits = birthday.replace(/-/g, "").split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

// かな→ローマ字変換（日本語名にピタゴラス式数秘術を正しく適用するため）
const KANA_ROMAJI: Record<string, string> = {
  きゃ:"kya",きゅ:"kyu",きょ:"kyo",しゃ:"sha",しゅ:"shu",しょ:"sho",ちゃ:"cha",ちゅ:"chu",ちょ:"cho",
  にゃ:"nya",にゅ:"nyu",にょ:"nyo",ひゃ:"hya",ひゅ:"hyu",ひょ:"hyo",みゃ:"mya",みゅ:"myu",みょ:"myo",
  りゃ:"rya",りゅ:"ryu",りょ:"ryo",ぎゃ:"gya",ぎゅ:"gyu",ぎょ:"gyo",じゃ:"ja",じゅ:"ju",じょ:"jo",
  びゃ:"bya",びゅ:"byu",びょ:"byo",ぴゃ:"pya",ぴゅ:"pyu",ぴょ:"pyo",
  あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",
  さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",
  な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",
  ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",
  ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",わ:"wa",を:"wo",ん:"n",
  が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",
  だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",
  ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
  ぁ:"a",ぃ:"i",ぅ:"u",ぇ:"e",ぉ:"o",
};

// 文字列をローマ字(a-z)へ。ラテン文字はそのまま、カナは変換、漢字等は除去
function romanizeName(name: string): string {
  // カタカナ→ひらがな（コードポイントを0x60ずらす）
  const hira = name.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  let out = "";
  for (let i = 0; i < hira.length; i++) {
    const two = hira.slice(i, i + 2);
    if (KANA_ROMAJI[two]) { out += KANA_ROMAJI[two]; i++; continue; }
    const one = hira[i];
    if (KANA_ROMAJI[one]) { out += KANA_ROMAJI[one]; continue; }
    if (/[a-zA-Z]/.test(one)) out += one.toLowerCase();
    // 漢字・記号・長音などは数秘術に算入しない
  }
  return out;
}

const PYTHAGOREAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

// 名前の数（表現数）。算出不能（漢字のみ等）は 0 を返す
function getNameNumber(name: string): number {
  const romanized = romanizeName(name);
  if (!romanized) return 0;
  const sum = romanized.split("").reduce((acc, c) => acc + (PYTHAGOREAN[c] || 0), 0);
  return reduceToSingleDigit(sum);
}

// 魂の数（母音のみ）。算出不能は 0 を返す
function getSoulNumber(name: string): number {
  const romanized = romanizeName(name);
  const vowels = romanized.split("").filter((c) => "aeiou".includes(c));
  if (vowels.length === 0) return 0;
  const vowelMap: Record<string, number> = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = vowels.reduce((acc, c) => acc + (vowelMap[c] || 0), 0);
  return reduceToSingleDigit(sum);
}

export function getNumerologyReading(birthday: string, name: string): FortuneResult {
  const lifePathNum = getLifePathNumber(birthday);
  const nameNum = getNameNumber(name);
  const soulNum = getSoulNumber(name);
  const personalYearNum = getPersonalYear(birthday, new Date().getFullYear());

  const lp = LIFE_PATH[lifePathNum] || LIFE_PATH[9];

  // 名前の数（表現数・魂の数）はローマ字/かな入力時のみ正確に算出できる
  const nameDetails = (nameNum > 0 || soulNum > 0)
    ? [
        ...(nameNum > 0 ? [{ label: "🔢 表現数（外側の自分）", content: `表現数 ${nameNum} ── ${EXPRESSION_MEANINGS[nameNum] || EXPRESSION_MEANINGS[9]}` }] : []),
        ...(soulNum > 0 ? [{ label: "💫 魂の数（内なる欲求）", content: `魂の数 ${soulNum} ── ${SOUL_URGE_MEANINGS[soulNum] || SOUL_URGE_MEANINGS[9]}` }] : []),
      ]
    : [{ label: "🔢 表現数・魂の数について", content: "数秘術の名前の数はローマ字（A=1…）で計算します。お名前を「ローマ字」または「カタカナ／ひらがな」で入力すると、表現数と魂の数も鑑定できます。" }];

  return {
    title: `ライフパス ${lifePathNum}：${lp.title}（${lp.archetype}）`,
    summary: `${name || "あなた"}の人生の数字は「${lifePathNum}」。${lp.archetype}としての使命を持ちます`,
    details: [
      { label: "📖 人生の使命・テーマ", content: lp.description },
      { label: "✨ 才能・強み", content: lp.strength },
      { label: "🌱 成長の課題", content: lp.challenge },
      { label: "🌑 影の側面（向き合うべきこと）", content: lp.shadow },
      { label: "❤️ 恋愛・パートナーシップ", content: lp.love },
      { label: "💼 天職・キャリア", content: lp.career },
      { label: "💰 金銭・財運", content: lp.money },
      { label: "🌿 健康・体のメッセージ", content: lp.health },
      ...nameDetails,
      { label: "📅 今年の個人年数", content: `個人年 ${personalYearNum} ── ${PERSONAL_YEAR_MEANINGS[personalYearNum] || ""}` },
      { label: "🌟 同じライフパスの偉人", content: lp.famous },
      { label: "💞 相性の良い数字", content: `ライフパス ${lp.compatible.join("・")} のパートナーと深い絆を結びやすい` },
    ],
    lucky: { number: String(lifePathNum) },
    advice: lp.advice,
  };
}
