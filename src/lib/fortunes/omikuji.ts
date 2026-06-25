import { FortuneResult } from "@/lib/types";

const RESULTS = [
  {
    rank: "大吉", rankEn: "Dai-kichi", probability: 10,
    poem: "春の花 咲き誇るごと 運気満ちて 天の恵みを 受け取る時よ",
    general: "最高の運気が訪れています。大きな挑戦も恐れずに進んでください。天の後押しが感じられる時期です。",
    love: "素晴らしい縁が結ばれます。積極的な行動が吉。告白・プロポーズ・新しい出会いのどれも最良のタイミング。",
    work: "昇進・成功・新展開。実力が認められる時期。新しいプロジェクトへの挑戦も◎。",
    money: "予期せぬ収入や幸運なチャンスが到来。ただし感謝の心を忘れずに。",
    health: "心身ともに絶好調。今の状態を維持しましょう。新しい健康習慣を始めるのにも最適。",
    travel: "どこへ行っても吉。良い出会いがあるでしょう。遠方への旅も安全で実り多い。",
    study: "努力が実を結ぶ時。試験・資格取得・新しい学びへの挑戦はすべて吉。",
    waiting: "来ます。良い知らせが届くでしょう。",
    lost: "見つかります。思わぬ場所を探してみて。",
    advice: "この幸運を独り占めせず、周囲の人とも喜びを分かち合いましょう。感謝の気持ちが更なる幸運を呼び込みます。",
    lucky: { color: "金・黄", number: "1", item: "太陽石", direction: "南" },
  },
  {
    rank: "中吉", rankEn: "Chuu-kichi", probability: 25,
    poem: "夏の雨 大地を潤し 芽吹く種 着実な歩みが 実りをもたらす",
    general: "着実に物事が進む良い時期。焦らず一歩一歩進みましょう。努力が確実に報われます。",
    love: "焦らず自然体で。相手のペースを大切に。じっくり育む愛が長続きします。",
    work: "地道な努力が報われます。継続が力になる時期。焦らず一歩ずつ着実に進んで。",
    money: "着実な積み上げが実を結ぶ時。無理な投機より確実な貯蓄が吉。",
    health: "概ね良好。規則正しい生活を心がけて。早寝早起きが体調維持の鍵。",
    travel: "吉。事前の準備をしっかりと。地に足のついた旅が良い体験をもたらす。",
    study: "コツコツ積み上げる勉強が実を結ぶ。急ぎすぎず丁寧に学んで。",
    waiting: "やがて来ます。もう少しの辛抱を。",
    lost: "しばらく待てば見つかります。焦らずに。",
    advice: "今は種まきの時期。丁寧に土台を作ることが後の大きな実りになります。急がば回れの精神で。",
    lucky: { color: "緑・青", number: "6", item: "四葉のクローバー", direction: "東" },
  },
  {
    rank: "小吉", rankEn: "Shou-kichi", probability: 30,
    poem: "秋の風 さらりと過ぎて 静かな日々 小さな幸せに 目を向けましょう",
    general: "小さな幸せが積み重なる時期。日常の恵みに感謝を。大きなことより今できることを丁寧に。",
    love: "ゆっくりと関係を深める時。焦りは禁物。日々の小さな思いやりが心を繋げます。",
    work: "目の前の仕事を丁寧にこなすことが大切。評価は後からついてきます。",
    money: "大きな動きより日々の積み重ね。節約と小さな投資が財を育てます。",
    health: "良好。無理をせず適度な休息を。体の小さなサインを大切に。",
    travel: "吉。近場の旅行が特に良い。日帰り旅行や散歩も新鮮な発見をもたらします。",
    study: "焦らず基礎から積み上げる。小さな理解の積み重ねが大きな知識になります。",
    waiting: "もう少し時間がかかります。その間に準備を整えて。",
    lost: "近くにあります。よく探してみて。",
    advice: "小さな喜びの積み重ねが、大きな幸福への道です。今日の小さな感謝を忘れずに。",
    lucky: { color: "黄・橙", number: "3", item: "小石", direction: "西" },
  },
  {
    rank: "吉", rankEn: "Kichi", probability: 20,
    poem: "冬枯れの 木々に宿りし 命の芽 春を信じて 今日も前を向く",
    general: "特別な変化はありませんが、安定した日々が続きます。穏やかな中に確かな幸せがあります。",
    love: "現状維持。相手への感謝の気持ちを忘れずに。穏やかな愛の時間を大切に。",
    work: "平穏。今の仕事を着実にこなしましょう。信頼の積み重ねが土台になります。",
    money: "安定。大きな動きは控えめに。日々のお金の使い方を丁寧に見直して。",
    health: "普通。暴飲暴食に注意。規則正しい生活が体を守ります。",
    travel: "問題なし。安全に気をつけて。穏やかな旅が心を癒します。",
    study: "着実な学びの時。基礎固めに集中して。",
    waiting: "来るものは来ます。焦らず自然の流れに任せて。",
    lost: "時間をかけて探せば見つかります。",
    advice: "今は充電の時期。自分を磨くことに時間を使いましょう。次のステージへの準備をじっくりと。",
    lucky: { color: "白・銀", number: "5", item: "白い石", direction: "北" },
  },
  {
    rank: "末吉", rankEn: "Suekichi", probability: 10,
    poem: "雲の間に 時折見える 星明かり 焦らず待てば 道は開けん",
    general: "今は準備の時期。焦らず着実に基盤を固めましょう。将来への種まきの大切な時。",
    love: "無理に動かず、自然の流れに任せて。今は自分磨きが最善の恋愛戦略。",
    work: "今は学ぶ時期。スキルアップに集中しましょう。実力を蓄えれば必ず機会は来ます。",
    money: "節約の時期。不要な出費を控えましょう。将来への備えを着実に。",
    health: "少し注意が必要。早寝早起きを心がけて。体の声に耳を傾けて。",
    travel: "控えめに。必要な場合は安全を最優先に。",
    study: "今は基礎固めの時期。焦らず丁寧に積み上げて。",
    waiting: "まだ時間がかかります。待ちながら準備を。",
    lost: "すぐには見つかりにくい。少し時間をおいてから探してみて。",
    advice: "今はゆっくり歩みを進める時。最後には笑える日が必ず来ます。準備は裏切りません。",
    lucky: { color: "水色・薄紫", number: "7", item: "三日月", direction: "北東" },
  },
  {
    rank: "凶", rankEn: "Kyou", probability: 5,
    poem: "嵐の夜 激しく揺れど 夜明けには 穏やかな朝 必ず来たる",
    general: "試練の時期ですが、これは成長のチャンスです。慎重に行動し、大きな決断は先送りに。",
    love: "感情的になりやすい時。冷静さを保って。衝動的な言動が関係を傷つける可能性。",
    work: "ミスに注意。確認を怠らないように。新しい挑戦より現状維持が安全な時期。",
    money: "支出に慎重に。大きな投資や借金は避けること。手堅い管理が今は最善。",
    health: "体調管理に注意。無理は禁物。休息を優先し、無理な活動は控えて。",
    travel: "できれば延期を。やむを得ない場合は十分に準備と確認を。",
    study: "集中力が散りやすい時。焦らず小さなことから着実に。",
    waiting: "今は来ない可能性が高い。別のアプローチを考えてみて。",
    lost: "見つかりにくい状況。大切なものは保管場所を見直して。",
    advice: "凶はやがて吉に転じます。この試練を乗り越えることで、より強くなれます。今は嵐の中の静けさを探して。",
    lucky: { color: "黒・深紺", number: "9", item: "鉄の守護石", direction: "南西" },
  },
];

export function getOmikujiReading(): FortuneResult {
  const rand = Math.random() * 100;

  let cumulative = 0;
  let selected = RESULTS[RESULTS.length - 1];
  for (const r of RESULTS) {
    cumulative += r.probability;
    if (rand <= cumulative) { selected = r; break; }
  }

  return {
    title: `${selected.rank}（${selected.rankEn}）`,
    summary: `神籤の詩：「${selected.poem}」`,
    details: [
      { label: "🌟 全体運", content: selected.general },
      { label: "❤️ 恋愛・縁談", content: selected.love },
      { label: "💼 仕事・学業", content: selected.work },
      { label: "💰 金運・財運", content: selected.money },
      { label: "🌿 健康・病気", content: selected.health },
      { label: "✈️ 旅行・外出", content: selected.travel },
      { label: "📚 学問・試験", content: selected.study },
      { label: "⌛ 待ち人", content: selected.waiting },
      { label: "🔍 失せもの", content: selected.lost },
    ],
    lucky: selected.lucky,
    advice: selected.advice,
  };
}
