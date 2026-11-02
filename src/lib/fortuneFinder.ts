// 「知りたいこと」を選ぶと、その占いだけを一覧に残すための対応表。
// reason は各占いの鑑定結果に実際にある項目に合わせて書く（同じ文の使い回しはしない）。
export interface Topic {
  label: string;
  picks: { id: string; reason: string }[];
}

export const FINDER_TOPICS: Topic[] = [
  {
    label: "相手の気持ち",
    picks: [
      { id: "tarot", reason: "「あの人は私をどう思っている？」と書いて、5枚のカードで読めます" },
      { id: "compatibility", reason: "相手の生年月日から、感情面の噛み合い方と接し方が分かります" },
      { id: "lenormand", reason: "具体的な絵柄のカードで、相手との状況を読むのに向いています" },
    ],
  },
  {
    label: "恋愛",
    picks: [
      { id: "sukuyo", reason: "生まれ持った恋愛の傾向と、関係の深め方が分かります" },
      { id: "gypsy-cards", reason: "恋愛・パートナーとのことを、今後の展開まで読みます" },
      { id: "shichu-suimei", reason: "日柱からあなたの恋愛の本質を読みます" },
      { id: "feng-shui", reason: "恋愛・縁談の運を上げる暮らし方が分かります" },
      { id: "tarot", reason: "恋の問いを書くと、5枚のカードが恋愛への影響を読みます" },
      { id: "numerology", reason: "「恋愛・パートナーシップ」を、生年月日の数字から読みます" },
      { id: "transit", reason: "今日の恋愛運を、今の天体の位置から読みます" },
    ],
  },
  {
    label: "相性",
    picks: [
      { id: "compatibility", reason: "二人の太陽・月・金星・火星を計算し、星のエレメントから相性を読みます" },
      { id: "kyusei-compat", reason: "二人の本命星から、ぶつかりやすい点と接し方が分かります" },
      { id: "numerology-compat", reason: "二人のライフパス数から、関係を深める鍵が分かります" },
      { id: "eto-compat", reason: "生まれ年の干支で、手軽に相性を確かめられます" },
    ],
  },
  {
    label: "結婚",
    picks: [
      { id: "shibi", reason: "命盤から恋愛・結婚運を読みます（生まれた時刻が分かると正確です）" },
      { id: "tibetan", reason: "生まれ年の元素と動物から、恋愛・結婚運を読みます" },
      { id: "omikuji", reason: "「恋愛・縁談」の項目で、今の流れをさっと確かめられます" },
    ],
  },
  {
    label: "復縁・別れ",
    picks: [
      { id: "tarot", reason: "「復縁できる？」と問いを書いて、これからの流れを5枚で読みます" },
      { id: "iching", reason: "進むか引くかの判断を、今の状況を表す卦から読みます" },
      { id: "gypsy-cards", reason: "相手との今後の展開と、心に留めておきたいことが分かります" },
    ],
  },
  {
    label: "出会い",
    picks: [
      { id: "omikuji", reason: "「待ち人」の項目で、待っている人の気配が分かります" },
      { id: "kyusei-kigaku", reason: "縁の傾向に加えて、今年の運気と開運方位が分かります" },
      { id: "birth-flower", reason: "花が示す愛と縁、人との縁の育て方を読みます" },
    ],
  },
  {
    label: "仕事・転職",
    picks: [
      { id: "vedic", reason: "今は進めるべきか待つべきかを、運気の季節から読みます" },
      { id: "geomancy", reason: "転職などの問いを書くと、16の図形が仕事・進路の答えを出します" },
      { id: "sukuyo", reason: "向いている働き方と、これからの運の流れが分かります" },
      { id: "kyusei-kigaku", reason: "仕事・天職の傾向と、今年のテーマを合わせて読みます" },
      { id: "tarot", reason: "仕事の問いを書くと、5枚のカードが仕事への影響を読みます" },
      { id: "shibi", reason: "命盤から仕事・適職運を読みます" },
      { id: "juni-choku", reason: "今日の仕事・お金の過ごし方が分かります" },
    ],
  },
  {
    label: "向いていること・天職",
    picks: [
      { id: "numerology", reason: "人生の使命・才能・天職を、生年月日の数字から読みます" },
      { id: "big-five", reason: "質問に答えて性格を分析し、才能の活かし方が分かります" },
      { id: "maya", reason: "ツォルキン暦から、あなたの使命を読みます" },
    ],
  },
  {
    label: "金運・お金",
    picks: [
      { id: "transit", reason: "今日の金運を、今の天体の位置から読みます" },
      { id: "sukuyo", reason: "お金の稼ぎ方・貯め方の傾向が生まれ持った宿から分かります" },
      { id: "iching", reason: "お金の問いを書くと、卦が金運・財運を示します" },
      { id: "shibi", reason: "命盤から一生の金運・財運の傾向を読みます" },
      { id: "tarot", reason: "お金の問いを書くと、5枚のカードが金運への影響を読みます" },
      { id: "blood-type", reason: "血液型ごとのお金の使い方の傾向が分かります" },
      { id: "omikuji", reason: "「金運・財運」の項目で、今の運をさっと確かめられます" },
    ],
  },
  {
    label: "健康・体調",
    picks: [
      { id: "biorhythm", reason: "身体・感情・知性のサイクルから、今日の状態と明日の予報が分かります" },
      { id: "numerology", reason: "「健康・体のメッセージ」で、気をつけたい点が分かります" },
      { id: "blood-type", reason: "血液型ごとの体のケアとストレスの原因が分かります" },
    ],
  },
  {
    label: "心の疲れ・繊細さ",
    picks: [
      { id: "hsp", reason: "感受性の強さを測り、日常での自己ケアの方法が分かります" },
      { id: "chakra", reason: "今いちばん浄化が必要なエネルギーを示します" },
      { id: "biorhythm", reason: "感情のサイクルから、今の波が高いか低いかを確かめられます" },
    ],
  },
  {
    label: "人間関係",
    picks: [
      { id: "tibetan", reason: "対人・人間関係の傾向を、生まれ年から読みます" },
      { id: "gypsy-cards", reason: "特定の人とのことを問いに書くと、周囲との関係を読みます" },
      { id: "maya", reason: "「対人運」の項目で、人との関わり方が分かります" },
      { id: "sukuyo", reason: "「対人・人間関係」の項目で、生まれ持った人付き合いの傾向が分かります" },
      { id: "birth-flower", reason: "花が示す「対人運」から、人との縁の育て方を読みます" },
      { id: "hsp", reason: "周りに気疲れしやすい人向けに、感受性と人間関係の付き合い方が分かります" },
      { id: "iching", reason: "関係の悩みを問いに書くと、卦が「恋愛・人間関係」を示します" },
      { id: "geomancy", reason: "16の図形が「恋愛・人間関係」の項目で答えを示します" },
      { id: "transit", reason: "今日の人付き合いの運を、天体の位置から読みます" },
      { id: "juni-choku", reason: "「人付き合い・縁」の項目で、今日の過ごし方が分かります" },
    ],
  },
  {
    label: "家族・親子",
    picks: [
      { id: "kyusei-compat", reason: "恋人以外の相手でも、二人の価値観の違いと接し方が分かります" },
      { id: "numerology-compat", reason: "家族の生年月日を入れて、話の噛み合い方を確かめられます" },
      { id: "cartomancy", reason: "家族の悩みをそのまま問いに書いて、トランプで読みます" },
    ],
  },
  {
    label: "今日の運勢",
    picks: [
      { id: "transit", reason: "あなたの生年月日と今日の天体から、今日だけの運勢を計算します" },
      { id: "omikuji", reason: "入力なしで、今日の運勢をすぐ引けます" },
      { id: "juni-choku", reason: "今日向いていること・控えた方がよいことが分かります" },
      { id: "rokuyo", reason: "大安・仏滅など今日の六曜から、行動の指針が分かります" },
    ],
  },
  {
    label: "今年の運勢",
    picks: [
      { id: "kyusei-kigaku", reason: "今年の流年星とテーマを、本命星から読みます" },
      { id: "numerology", reason: "「今年の個人年数」で、今年の過ごし方が分かります" },
      { id: "eto", reason: "干支と五行から、今年の運気の流れを読みます" },
      { id: "astrology", reason: "今年の木星のテーマから、伸びやすいことが分かります" },
    ],
  },
  {
    label: "迷っていること・決断",
    picks: [
      { id: "iching", reason: "決断の場面で古くから使われてきた占いで、今どう動くかを読みます" },
      { id: "geomancy", reason: "悩みを書くと、図形が判断と今後の流れを示します" },
      { id: "rune", reason: "問いに対して3枚のルーンが短く背中を押します" },
    ],
  },
  {
    label: "自分の性格",
    picks: [
      { id: "big-five", reason: "5つの性格因子で、心理学にもとづいて分析します" },
      { id: "astrology", reason: "生まれた日の星の配置から、性格を多面的に読みます" },
      { id: "temperament", reason: "質問に答えて、4つの気質のどれに近いかが分かります" },
      { id: "shichu-suimei", reason: "生年月日時の四本の柱から、才能と成長のテーマを読みます" },
    ],
  },
  {
    label: "人生全体・将来",
    picks: [
      { id: "comprehensive", reason: "東洋・西洋を横断して、過去・現在・未来をまとめて読みます" },
      { id: "sanmeigaku", reason: "年齢ごとの人生のステージを読みます" },
      { id: "birth-code", reason: "数秘・干支・月相・七十二候をまとめた、あなただけのコードが出ます" },
    ],
  },
  {
    label: "引っ越し・方位",
    picks: [
      { id: "feng-shui", reason: "吉方位と今年の方位、インテリアの整え方が分かります" },
      { id: "kyusei-kigaku", reason: "本命星から開運方位・色・アイテムが分かります" },
    ],
  },
  {
    label: "見た夢の意味",
    picks: [{ id: "dream", reason: "夢に出てきたものから、今の深層心理を読みます" }],
  },
  {
    label: "よく見る数字",
    picks: [{ id: "angel-number", reason: "繰り返し見る数字に込められたメッセージを読みます" }],
  },
  {
    label: "名前の運勢",
    picks: [
      { id: "seimei-handan", reason: "名前の画数の五格から、運命と人間関係を読みます" },
      { id: "kabbalah", reason: "名前の文字を数に変換し、魂の道を読みます" },
    ],
  },
  {
    label: "前世・魂",
    picks: [
      { id: "past-life", reason: "前世の姿と、今世に持ち越した課題が分かります" },
      { id: "akashic", reason: "魂の本質と今世のメッセージを読みます" },
      { id: "vedic", reason: "カルマと魂の課題を、月の位置から読みます" },
    ],
  },
  {
    label: "守ってくれる存在",
    picks: [
      { id: "deity", reason: "生年月日と価値観から、世界の神話の守護神を導きます" },
      { id: "guardian-buddha", reason: "生まれ年の守り本尊と、ご利益・ご真言が分かります" },
      { id: "spirit-animal", reason: "今のあなたに必要な知恵を持つ守護動物が分かります" },
    ],
  },
  {
    label: "開運・ラッキーアイテム",
    picks: [
      { id: "power-stone", reason: "守護の石と、石とのつき合い方が分かります" },
      { id: "feng-shui", reason: "ラッキーカラーと開運アイテムが分かります" },
      { id: "birthstone", reason: "誕生月の石が持つ力を読みます" },
    ],
  },
  {
    label: "試験・勉強",
    picks: [
      { id: "omikuji", reason: "「学問・試験」の項目で、今の運を確かめられます" },
      { id: "guardian-buddha", reason: "仕事・学びへのご加護と、ご真言が分かります" },
    ],
  },
  {
    label: "なくし物・旅行",
    picks: [{ id: "omikuji", reason: "「失せもの」「旅行・外出」の項目があります" }],
  },
];

