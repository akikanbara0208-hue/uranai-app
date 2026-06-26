import { Fortune } from "@/lib/types";

export const FORTUNES: Fortune[] = [
  // ══ カード・文字 ══
  { id: "tarot",       name: "タロット占い",     nameEn: "Tarot",          description: "22枚の大アルカナカードであなたの運命を読み解きます",             origin: "ヨーロッパ",           icon: "🃏", category: "cards",         inputType: "question"     },
  { id: "rune",        name: "ルーン占い",        nameEn: "Rune Divination", description: "古代北欧の文字ルーンがあなたへのメッセージを伝えます",          origin: "北欧",                 icon: "ᚠ",  category: "cards",         inputType: "question"     },
  { id: "oracle",      name: "オラクルカード",    nameEn: "Oracle Cards",    description: "天使や精霊からのメッセージをカードで受け取ります",               origin: "西洋",                 icon: "✨", category: "cards",         inputType: "question"     },
  { id: "iching",      name: "易経",              nameEn: "I Ching",         description: "3000年以上の歴史を持つ中国の易で今の状況を占います",             origin: "中国",                 icon: "☯️", category: "cards",         inputType: "question"     },
  { id: "omikuji",     name: "おみくじ",          nameEn: "Omikuji",         description: "神様からの一言。今日の運勢を神籤で引きます",                     origin: "日本",                 icon: "🎋", category: "cards",         inputType: "draw"         },
  { id: "dice",        name: "サイコロ占い",      nameEn: "Cleromancy",      description: "3つのサイコロが今この瞬間のあなたへのメッセージを告げます",       origin: "古代ギリシャ・ローマ", icon: "🎲", category: "cards",         inputType: "draw"         },
  { id: "lenormand",   name: "ルノルマンカード",  nameEn: "Lenormand Cards", description: "フランスの予言者ルノルマン由来の36枚のカードで運命を占います",   origin: "フランス",             icon: "🂠", category: "cards",         inputType: "question"     },
  { id: "gypsy-cards", name: "ジプシーカード",   nameEn: "Gypsy Cards",     description: "ロマの伝統に根ざす31枚のカードが過去・現在・未来を映します",     origin: "ロマ（中央ヨーロッパ）",icon:"🎠", category: "cards",         inputType: "question"     },
  // ══ 数と言葉 ══
  { id: "numerology",  name: "数秘術",            nameEn: "Numerology",      description: "名前と生年月日から導く数字があなたの本質を示します",             origin: "ピタゴラス・古代ギリシャ",icon:"🔢",category: "numbers",      inputType: "birthday_name"},
  { id: "angel-number",name: "エンジェルナンバー",nameEn: "Angel Number",    description: "繰り返し見る数字に込められた天使のメッセージを読みます",         origin: "新時代思想",           icon: "👼", category: "numbers",       inputType: "keyword"      },
  { id: "kabbalah",    name: "カバラ数秘術",      nameEn: "Kabbalistic Numerology", description: "ヘブライの神秘哲学カバラが名前に宿る魂の道を示します", origin: "ユダヤ神秘主義",       icon: "✡️", category: "numbers",       inputType: "name"         },
  // ══ 星と天体 ══
  { id: "astrology",   name: "西洋占星術",        nameEn: "Western Astrology",description: "生まれた日の星の配置があなたの性格と運命を示します",            origin: "バビロニア・ギリシャ", icon: "♈", category: "astrology",     inputType: "birthday_time"},
  { id: "birth-day",   name: "誕生曜日占い",      nameEn: "Birth Weekday",   description: "生まれた曜日の支配惑星があなたの本質的なエネルギーを示します",   origin: "西洋占星術",           icon: "📆", category: "astrology",     inputType: "birthday"     },
  // ══ 自然と身体 ══
  { id: "blood-type",  name: "血液型占い",        nameEn: "Blood Type",      description: "血液型から性格・相性・今日の運勢を読み解きます",                 origin: "日本",                 icon: "🩸", category: "nature",        inputType: "blood_type"   },
  { id: "dream",       name: "夢占い",            nameEn: "Dream Interpretation", description: "夢に現れたシンボルからあなたの深層心理を探ります",          origin: "世界共通",             icon: "💭", category: "nature",        inputType: "keyword"      },
  { id: "birthstone",  name: "誕生石占い",        nameEn: "Birthstone",      description: "誕生月の石が持つ力があなたへのメッセージを示します",             origin: "世界共通",             icon: "💎", category: "nature",        inputType: "birthday"     },
  { id: "birth-flower",name: "誕生花占い",        nameEn: "Birth Flower",    description: "誕生月の花が語る花言葉があなたの魂の本質と人生テーマを示します", origin: "世界共通",             icon: "🌸", category: "nature",        inputType: "birthday"     },
  { id: "moon-phase",  name: "ムーン占い",        nameEn: "Moon Phase",      description: "あなたが生まれた日の月相が示す魂の本質的なリズムと特性",         origin: "世界共通",             icon: "🌕", category: "nature",        inputType: "birthday"     },
  { id: "animal-fortune",name:"動物占い",         nameEn: "Animal Fortune",  description: "生年月日から導く守護動物が本質的な性格と才能を教えます",         origin: "日本",                 icon: "🦁", category: "nature",        inputType: "birthday"     },
  // ══ 東洋の叡智 ══
  { id: "shichu-suimei",name:"四柱推命",          nameEn: "Bazi (Four Pillars)",description:"生年月日時から四本の柱を立て、運命の流れを読みます",           origin: "中国",                 icon: "🀄", category: "eastern",       inputType: "birthday_time"},
  { id: "kyusei-kigaku",name:"九星気学",          nameEn: "Nine Star Ki",    description: "生まれた年の星が示す今年の運気と方位を読みます",                 origin: "中国・日本",           icon: "⭐", category: "eastern",       inputType: "birthday"     },
  { id: "feng-shui",   name: "風水",              nameEn: "Feng Shui",       description: "生まれた年の属性から今年の吉方位と開運法を伝えます",             origin: "中国",                 icon: "🧭", category: "eastern",       inputType: "birthday"     },
  { id: "seimei-handan",name:"姓名判断",          nameEn: "Japanese Name Reading", description: "名前の画数の五格から運命・才能・人間関係を読み解きます",  origin: "中国・日本",           icon: "✍️", category: "eastern",       inputType: "name"         },
  { id: "eto",         name: "干支占い",          nameEn: "Chinese Zodiac",  description: "12の干支と五行が示す性格・運勢・人生のサイクルを解読します",     origin: "中国",                 icon: "🐉", category: "eastern",       inputType: "birthday"     },
  { id: "rokuyo",      name: "六曜占い",          nameEn: "Rokuyo",          description: "今日の六曜（大安・仏滅など）が示すエネルギーと行動の指針",       origin: "中国・日本",           icon: "📅", category: "eastern",       inputType: "draw"         },
  { id: "sanmeigaku",  name: "算命学",            nameEn: "Sanmeigaku",      description: "生年月日から10の主星を割り出す中国伝来の運命鑑定術",             origin: "中国",                 icon: "⚖️", category: "eastern",       inputType: "birthday"     },
  { id: "shibi",       name: "紫微斗数",          nameEn: "Zi Wei Dou Shu", description: "紫微星を中心とした12宮の星配置で人生の全体像を鑑定します",       origin: "中国",                 icon: "🌟", category: "eastern",       inputType: "birthday_time"},
  // ══ 古代の叡智 ══
  { id: "vedic",       name: "ヴェーダ占星術",    nameEn: "Jyotish",         description: "5000年の歴史を持つインドのナクシャトラで魂の使命を読みます",     origin: "インド",               icon: "🕉️", category: "ancient",       inputType: "birthday"     },
  { id: "maya",        name: "マヤ暦",            nameEn: "Maya Tzolkin",    description: "260日周期のツォルキン暦があなたの魂のエネルギーと使命を示します", origin: "メキシコ・マヤ文明",   icon: "🌞", category: "ancient",       inputType: "birthday"     },
  { id: "egypt",       name: "エジプト占星術",    nameEn: "Egyptian Astrology",description:"古代エジプトの神々が誕生日から守護神と本質を告げます",           origin: "古代エジプト",         icon: "🏺", category: "ancient",       inputType: "birthday"     },
  { id: "babylon",     name: "バビロニア占星術",  nameEn: "Babylonian Astrology",description:"人類最古の占星術。7つの惑星神が示す運命のエッセンス",         origin: "古代バビロニア",       icon: "🌙", category: "ancient",       inputType: "birthday"     },
  { id: "celtic-tree", name: "ケルト樹木占い",   nameEn: "Celtic Tree Oracle",description:"古代ケルトの神聖な樹木があなたの本質と人生の季節を告げます",     origin: "古代ケルト",           icon: "🌳", category: "ancient",       inputType: "birthday"     },
  { id: "geomancy",    name: "ゲオマンシー",      nameEn: "Geomancy",        description: "中世に伝わる16の図形が問いへの答えを与えます",                   origin: "アラビア・中世ヨーロッパ",icon:"🔮",category: "ancient",       inputType: "question"     },
  // ══ スピリチュアル ══
  { id: "past-life",   name: "前世占い",          nameEn: "Past Life Reading",description:"魂の記憶が生年月日に刻んだ前世のテーマと今世への影響を読みます",  origin: "スピリチュアル",       icon: "👁️", category: "spiritual",     inputType: "birthday"     },
  { id: "aura",        name: "オーラ占い",        nameEn: "Aura Reading",    description: "生年月日から導くオーラカラーと魂のエネルギーの特性",             origin: "スピリチュアル",       icon: "🌈", category: "spiritual",     inputType: "birthday"     },
  { id: "chakra",      name: "チャクラ占い",      nameEn: "Chakra Reading",  description: "7つのチャクラの中で今最も活性化・浄化が必要なエネルギーを示します", origin: "インド・ヨガ",         icon: "⚡", category: "spiritual",     inputType: "question"     },
  { id: "akashic",     name: "アカシックレコード",nameEn: "Akashic Records", description: "宇宙の記録から魂の本質と今世のメッセージを読みます",             origin: "スピリチュアル",       icon: "🌌", category: "spiritual",     inputType: "question"     },
  { id: "spirit-animal",name:"スピリットアニマル",nameEn: "Spirit Animal",   description: "守護動物が今のあなたに必要な知恵とパワーを伝えます",             origin: "アメリカ先住民・シャーマニズム",icon:"🦅",category:"spiritual",inputType:"question"},
  // ══ 性格診断 ══
  { id: "mbti",        name: "MBTI診断",         nameEn: "MBTI Personality", description: "4つの心理的選好から16タイプで性格と才能の本質を明らかにします",  origin: "マイヤーズ＝ブリッグス", icon: "🧠", category: "personality",  inputType: "quiz"         },
  { id: "hsp",         name: "HSP診断",          nameEn: "HSP Assessment",  description: "高感受性者の特性を診断し、感受性という才能との付き合い方を示します", origin: "エレイン・アーロン博士",icon: "💫", category: "personality",  inputType: "quiz"         },
  { id: "enneagram",   name: "エニアグラム",      nameEn: "Enneagram",       description: "9つのタイプで核心的な動機と成長の道を深く理解する性格分類",       origin: "スーフィズム・現代心理学",icon:"⭕",category: "personality",  inputType: "quiz"         },
  { id: "big-five",    name: "ビッグファイブ",    nameEn: "Big Five (OCEAN)", description: "5つの性格因子で科学的にあなたのパーソナリティを分析します",      origin: "現代心理学",           icon: "📊", category: "personality",  inputType: "quiz"         },
  { id: "love-language",name:"愛情表現タイプ",    nameEn: "Five Love Languages",description:"5種類の愛の言語であなたの愛し方・愛され方のスタイルを明らかにします",origin:"チャップマン博士",  icon: "❤️", category: "personality",  inputType: "quiz"         },
  // ══ 総合鑑定 ══
  { id: "comprehensive",name:"総合鑑定",          nameEn: "Comprehensive Reading", description: "東洋・西洋・古代・スピリチュアルを横断した過去・現在・未来の総合分析", origin: "世界の叡智統合", icon: "🔯", category: "comprehensive", inputType: "birthday_name"},
];

export const FORTUNE_CATEGORIES = {
  cards:         { label: "カード・おみくじ", color: "purple"  },
  numbers:       { label: "数と言葉",         color: "blue"    },
  astrology:     { label: "星と天体",         color: "indigo"  },
  nature:        { label: "自然と身体",       color: "green"   },
  eastern:       { label: "東洋の叡智",       color: "red"     },
  ancient:       { label: "古代の叡智",       color: "amber"   },
  spiritual:     { label: "スピリチュアル",   color: "violet"  },
  personality:   { label: "性格診断",         color: "teal"    },
  comprehensive: { label: "総合鑑定",         color: "gold"    },
};
