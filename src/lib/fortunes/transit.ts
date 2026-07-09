import { FortuneResult } from "@/lib/types";
import { julianDay, getSunLongitude, getMoonLongitude, getPlanetLongitude } from "@/lib/fortunes/astrology";

// ══════════════════════════════════════════════
// パーソナル今日の運勢（西洋占星術トランジット）
// 「今日の天体の位置」と「あなたの出生の太陽」の角度（アスペクト）を実計算し、
// 今日のあなたへの星の後押しを読む。毎日結果が変わる。
// ══════════════════════════════════════════════

const SIGNS = ["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"];

type Aspect = { name: string; tone: "吉" | "凶" | "転機"; score: number };

// 2天体の角度からアスペクトを判定
function aspect(a: number, b: number): Aspect | null {
  let sep = Math.abs(a - b) % 360;
  if (sep > 180) sep = 360 - sep;
  if (Math.abs(sep - 0) <= 8) return { name: "合（コンジャンクション）", tone: "転機", score: 1 };
  if (Math.abs(sep - 120) <= 8) return { name: "三分（トライン）", tone: "吉", score: 2 };
  if (Math.abs(sep - 60) <= 6) return { name: "六分（セクスタイル）", tone: "吉", score: 1 };
  if (Math.abs(sep - 90) <= 6) return { name: "矩（スクエア）", tone: "凶", score: -2 };
  if (Math.abs(sep - 180) <= 8) return { name: "衝（オポジション）", tone: "凶", score: -1 };
  return null;
}

// 天体別・アスペクトの吉凶別の読み（全天体共通の定型文は使わない）
const PLANET_ASPECT_TEXTS: Record<string, { 吉: string; 凶: string; 転機: string }> = {
  太陽: {
    吉: "活力に追い風が吹く配置。今日は主役の意識で、やりたいことから手をつけると流れに乗れます。",
    凶: "エネルギーが空回りしやすい配置。頑張りすぎに注意して、ペース配分を意識すると乗り切れます。",
    転機: "生き方のテーマにスイッチが入る配置。ふと浮かんだ「こうしたい」が、今後の指針になりそうです。",
  },
  金星: {
    吉: "恋愛・対人運に追い風。素直な好意や感謝を言葉にすると、関係がぐっと深まります。",
    凶: "人間関係に小さなすれ違いが起きやすい配置。結論を急がず、聞き役に回ると丸く収まります。",
    転機: "対人関係に新しい風が吹く配置。意外な人との出会いや、関係が一歩進むきっかけがありそうです。",
  },
  火星: {
    吉: "行動力に火がつく配置。懸案の仕事ほど今日片づけると、実力以上の成果が出せます。",
    凶: "焦りや苛立ちが判断を鈍らせやすい配置。即断即決を避け、一晩置く余裕を持ちましょう。",
    転機: "挑戦のスイッチが入る配置。新しい仕事や役割の打診は、前向きに検討する価値があります。",
  },
  木星: {
    吉: "幸運の扉が開く配置。チャンスと感じたら遠慮なく手を挙げて。拡大の流れに乗れる日です。",
    凶: "気が大きくなりやすい配置。うまい話や衝動的な約束は、一度持ち帰って冷静に検討を。",
    転機: "可能性が広がる転機の配置。学び・旅・新分野など、世界を広げる誘いに縁がある日です。",
  },
};

export function getTransitReading(birthday: string): FortuneResult {
  const [by, bm, bd] = birthday.split("-").map(Number);
  const natalSun = getSunLongitude(julianDay(by, bm, bd));

  const now = new Date();
  const jd = julianDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const tSun = getSunLongitude(jd);
  const tMoon = getMoonLongitude(jd);
  const tVenus = getPlanetLongitude(jd, "venus");
  const tMars = getPlanetLongitude(jd, "mars");
  const tJup = getPlanetLongitude(jd, "jupiter");

  const moodSign = SIGNS[Math.floor(tMoon / 30)];
  const natalSignIdx = Math.floor(natalSun / 30);
  const natalSign = SIGNS[natalSignIdx];

  const lines: { planet: string; theme: string; lon: number; asp: Aspect | null }[] = [
    { planet: "太陽", theme: "全体運・活力", lon: tSun, asp: aspect(tSun, natalSun) },
    { planet: "金星", theme: "恋愛・人間関係", lon: tVenus, asp: aspect(tVenus, natalSun) },
    { planet: "火星", theme: "仕事・行動力", lon: tMars, asp: aspect(tMars, natalSun) },
    { planet: "木星", theme: "幸運・拡大", lon: tJup, asp: aspect(tJup, natalSun) },
  ];

  // 三区分（トリプリシティ）：火地風水のエレメント相性。火×風・地×水は調和、同エレメントは強い調和
  const signRelation = (idx: number): "same" | "harmony" | "tension" => {
    if (idx === natalSignIdx) return "same";
    const a = idx % 4;
    const b = natalSignIdx % 4;
    return a === b || Math.abs(a - b) === 2 ? "harmony" : "tension";
  };

  // アスペクトがない天体の読み：今日その天体がいる星座と、出生太陽星座のエレメント相性で読む
  const noAspectText = (planet: string, lon: number): string => {
    const idx = Math.floor(lon / 30);
    const sign = SIGNS[idx];
    const rel = signRelation(idx);
    switch (planet) {
      case "太陽":
        return rel === "same"
          ? `今日の太陽は、あなたの生まれと同じ${sign}を運行中。一年に一度、太陽が自分の星座に還るこの季節は、自分らしさが自然と輝きます。素のままの選択が吉。`
          : rel === "harmony"
          ? `今日の太陽は${sign}を運行中。あなたの${natalSign}と調和するエレメントの並びで、肩の力を抜いた自然体でいるほど活力が湧いてくる一日です。`
          : `今日の太陽は${sign}を運行中。あなたの${natalSign}とは気質の異なるエレメントの並びで、周囲とのテンポの違いを感じやすいかも。自分のリズムを守ることが活力の源になります。`;
      case "金星":
        return rel === "same"
          ? `愛の星・金星が、あなたと同じ${sign}を運行中。魅力が自然とにじみ出る配置で、飾らないあなたのままで好印象を残せます。`
          : rel === "harmony"
          ? `愛の星・金星は今日${sign}にあり、あなたの${natalSign}と調和するエレメントの並び。会話に柔らかさが宿り、素直な一言が関係を温めます。`
          : `愛の星・金星は今日${sign}にあり、あなたの${natalSign}とは肌合いの異なるエレメント。相手の流儀に合わせる余裕を持つと、人間関係がスムーズに運びます。`;
      case "火星":
        return rel === "same"
          ? `行動の星・火星が、あなたと同じ${sign}を運行中。エンジンがかかりやすい配置で、手をつけた仕事がぐんぐん進みます。`
          : rel === "harmony"
          ? `行動の星・火星は今日${sign}にあり、あなたの${natalSign}と噛み合うエレメントの並び。段取り通りに淡々と進めるほど、成果が積み上がる一日です。`
          : `行動の星・火星は今日${sign}にあり、あなたの${natalSign}とは勢いの質が異なるエレメント。焦って飛ばすより、一つずつ確実に片づける進め方が功を奏します。`;
      default: // 木星
        return rel === "same"
          ? `幸運の星・木星が、あなたと同じ${sign}に滞在中。約12年に一度の拡大期にあたり、蒔いた種が育ちやすい追い風の季節です。`
          : rel === "harmony"
          ? `幸運の星・木星は${sign}を運行中。あなたの${natalSign}と響き合うエレメントの並びで、視野を少し広げた選択が後々の実りにつながります。`
          : `幸運の星・木星は${sign}を運行中。あなたの${natalSign}とは方向性の異なるエレメントですが、普段選ばない分野に幸運の種が隠れている暗示。少しの冒険が吉です。`;
    }
  };

  const total = lines.reduce((s, l) => s + (l.asp?.score ?? 0), 0);
  const score = Math.max(20, Math.min(98, 60 + total * 9));
  const stars = score >= 85 ? "★★★★★" : score >= 70 ? "★★★★☆" : score >= 55 ? "★★★☆☆" : score >= 40 ? "★★☆☆☆" : "★☆☆☆☆";

  const verdict =
    score >= 80 ? "星の後押しが強い好調日。思い切って動くほど良い流れに乗れます。" :
    score >= 60 ? "穏やかに整った一日。日常を丁寧に過ごすと小さな幸運に恵まれます。" :
    score >= 45 ? "やや揺らぎのある日。無理せず、ペースを守ることが吉。" :
    "踏ん張りどころの日。今日は守りを固め、大きな決断は控えめに。";

  // 今日の配置から、追い風となる天体と注意が要る天体を抽出（新しい計算は加えず、既出のアスペクトを集計）
  const luckyPlanets = lines.filter((l) => l.asp?.tone === "吉").map((l) => l.planet);
  // アスペクトがなくても、エレメントが調和する星座にいる天体は穏やかな追い風として扱う
  const harmonyThemes = lines.filter((l) => !l.asp && signRelation(Math.floor(l.lon / 30)) !== "tension").map((l) => l.theme.split("・")[0]);
  const tensePlanets = lines.filter((l) => l.asp?.tone === "凶").map((l) => l.planet);
  const turnPlanets = lines.filter((l) => l.asp?.tone === "転機").map((l) => l.planet);

  const detail = (l: { planet: string; theme: string; lon: number; asp: Aspect | null }) => {
    if (!l.asp) return noAspectText(l.planet, l.lon);
    return `今日の${l.planet}があなたの太陽と「${l.asp.name}」。${PLANET_ASPECT_TEXTS[l.planet][l.asp.tone]}`;
  };

  const jupSignIdx = Math.floor(tJup / 30);
  const jupSign = SIGNS[jupSignIdx];
  const jupRel = signRelation(jupSignIdx);
  const moneyContent = lines[3].asp
    ? `幸運と拡大を司る木星が今日「${lines[3].asp.name}」を結んでいます。${lines[3].asp.tone === "吉" ? "金運にも追い風。臨時収入やお得な巡り合わせ、価値ある買い物のチャンスに恵まれそうです。" : lines[3].asp.tone === "凶" ? "今日は財布の紐を締めるのが吉。大きな出費や投資の決断は日を改めると安心です。" : "お金の使い方に変化の兆し。新しい支出先や収入源が見えてくるかもしれません。"}`
    : jupRel === "same"
    ? `金運を司る木星が、あなたと同じ${jupSign}に滞在中の拡大期。収入の器が育ちやすいときで、学びや自己投資への出費は生きたお金になります。`
    : jupRel === "harmony"
    ? `金運を司る木星は今、${jupSign}にあり、あなたの${natalSign}と調和するエレメント。堅実な管理を土台に、直感的に「良い」と感じたものへの支出はお金の巡りを良くします。`
    : `金運を司る木星は今、${jupSign}にあり、あなたの${natalSign}とは質の異なるエレメント。衝動買いより比較検討を。ひと呼吸おいてから決める買い物が満足度を高めます。`;

  const actionContent =
    score >= 80 ? `好調な今日は、ためらっていたことに一歩踏み出す絶好のチャンス。${luckyPlanets.length ? `特に${luckyPlanets.join("・")}が後押しする分野で、積極的に動いて運の波に乗りましょう。` : "気になっていた人への連絡や新しい挑戦に、迷わず動いて吉です。"}` :
    score >= 60 ? `穏やかな今日は、日常を丁寧に整えるのが開運の鍵。${luckyPlanets.length ? `${luckyPlanets.join("・")}の分野で小さな一歩を重ねると、思わぬ幸運が芽吹きます。` : harmonyThemes.length ? `特に${harmonyThemes.join("・")}の分野には星のエレメントが穏やかに味方しています。小さな一歩を重ねると、思わぬ幸運が芽吹きます。` : "身の回りの片付けや感謝を伝える小さな行動が、良い流れを呼び込みます。"}` :
    `揺らぎのある今日は、無理に動かず守りを固めるのが賢明。心と体を休め、英気を養うことで次の好機に備えられます。深呼吸とゆとりを忘れずに。`;

  const cautionContent = tensePlanets.length
    ? `今日は${tensePlanets.join("・")}があなたの太陽と緊張の角度を結んでいます。${tensePlanets.includes("金星") ? "人間関係では言葉のすれ違いに注意を。" : ""}${tensePlanets.includes("火星") ? "焦りや衝動からの判断ミスに気をつけて。" : ""}${tensePlanets.includes("太陽") ? "頑張りすぎての消耗に注意し、ペース配分を。" : ""}${tensePlanets.includes("木星") ? "気が大きくなりすぎての油断や過剰に注意を。" : ""}慎重に進めば、緊張は成長のきっかけに変わります。`
    : `今日は太陽と強い緊張を結ぶ天体がなく、大きな波乱の心配は少ない一日。油断さえしなければ、穏やかに過ごせるでしょう。`;

  return {
    title: `今日のあなたの運勢 ${score}点 ${stars}`,
    summary: `${now.getMonth() + 1}月${now.getDate()}日、あなたの出生の太陽（${SIGNS[Math.floor(natalSun / 30)]}）に、今日空を運行する天体が結ぶ角度（アスペクト）を実際に計算しました。これは毎日変わる「今日だけのあなたの空模様」です。今日の月は${moodSign}にあり、場の空気をやわらかく彩っています。${verdict}`,
    details: [
      { label: "🌞 全体運・活力", content: detail(lines[0]) },
      { label: "💕 恋愛・人間関係", content: detail(lines[1]) },
      { label: "💼 仕事・行動力", content: detail(lines[2]) },
      { label: "🍀 幸運・拡大", content: detail(lines[3]) },
      { label: "💰 今日の金運", content: moneyContent },
      { label: `🌙 今日の月：${moodSign}`, content: `今日の月は${moodSign}を運行中。${moodSign}的な気分が一日のトーンになります。${turnPlanets.length ? `さらに${turnPlanets.join("・")}が転機の角度を結び、変化のスイッチが入りやすい日でもあります。` : ""}月の流れに沿って過ごすと、心地よく一日を運べます。` },
      { label: "🎯 今日の開運アクション", content: actionContent },
      { label: "⚠️ 今日の注意点", content: cautionContent },
    ],
    lucky: { number: String(score) },
    advice: `星は人を縛るのではなく、背中を押したり、立ち止まる合図をくれたりする道しるべです。今日のあなたの点数は${score}点。これは固定された運命ではなく、追い風と向かい風の今日の配分にすぎません。${score >= 60 ? "良い流れを信じて、自分らしく一歩を踏み出してください。" : "向かい風の日は無理をせず、自分をいたわることが明日の好転につながります。"}トランジットは明日にはまた姿を変えます。一日一日の空模様を味方につけて過ごしましょう。`,
  };
}
