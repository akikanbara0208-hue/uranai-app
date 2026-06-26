import { FortuneResult } from "@/lib/types";

// ── 黄道十二宮 ──────────────────────────────────────────
const SIGNS = [
  {
    name: "牡羊座", nameEn: "Aries", symbol: "♈", element: "火", quality: "活動",
    ruling: "火星", keyword: "始まり・勇気・先駆",
    personality: "積極的で情熱的、先駆者の精神を持つ",
    sun: "自信に満ち、挑戦を恐れない。行動力と直感に優れる",
    moon: "感情が爆発的で正直。怒りは速いが忘れるのも早い。刺激を求める",
    rising: "初対面は活発でエネルギッシュ。リーダー的な印象を与える",
    mercury: "直截的な発言。アイデアが次々浮かぶが計画より行動を優先",
    venus: "恋愛は積極的・情熱的。追いかけることが好き",
    mars: "本来の支配星。エネルギーが最大限に発揮される。競争心旺盛",
    jupiter: "新しいことへの挑戦で幸運が開ける。スポーツ・起業に吉",
    saturn: "衝動を抑えること、計画性を身につけることが人生の課題",
  },
  {
    name: "牡牛座", nameEn: "Taurus", symbol: "♉", element: "地", quality: "不動",
    ruling: "金星", keyword: "安定・豊かさ・感覚",
    personality: "安定を好み、感覚的な喜びを大切にする",
    sun: "忍耐強く信頼できる。美と快楽を愛し、物質的な豊かさを築く",
    moon: "安心と安定を感情の拠り所にする。変化を嫌い、食と自然に癒される",
    rising: "穏やかで落ち着いた印象。信頼感を与える。美的センスが際立つ",
    mercury: "じっくり考えて発言する。実践的な思考。一度決めたら曲げない",
    venus: "本来の支配星。愛情豊かで官能的。長続きする愛を好む",
    mars: "粘り強く行動するが、スタートが遅い。一度動き出すと止まらない",
    jupiter: "財運と美に関することで幸運。芸術・食・不動産が吉",
    saturn: "頑固さを手放し変化に適応することが人生の課題",
  },
  {
    name: "双子座", nameEn: "Gemini", symbol: "♊", element: "風", quality: "柔軟",
    ruling: "水星", keyword: "知性・コミュニケーション・変化",
    personality: "知的好奇心旺盛で会話上手、適応力が高い",
    sun: "多才で機知に富む。情報収集と発信が得意。飽きっぽい面も",
    moon: "感情を言葉で処理する。気分が変わりやすく、頭で感情を分析する傾向",
    rising: "軽やかで話しやすい雰囲気。若々しく機知あふれる印象",
    mercury: "本来の支配星。言葉の魔術師。会話・文章・交渉に天賦の才",
    venus: "会話と知的刺激で恋に落ちる。変化を好み、自由を大切にする",
    mars: "アイデアで動く。エネルギーが分散しがちだが同時並行が得意",
    jupiter: "学習・旅行・執筆・メディアで幸運が開ける",
    saturn: "一つのことを深め継続することが人生の課題",
  },
  {
    name: "蟹座", nameEn: "Cancer", symbol: "♋", element: "水", quality: "活動",
    ruling: "月", keyword: "感情・家族・記憶",
    personality: "感受性豊かで保護本能が強い、家族思い",
    sun: "深い共感力と直感力を持つ。家族と故郷を大切にする",
    moon: "本来の支配星。感情が豊かで敏感。気分が月の満ち欠けのように変わる",
    rising: "柔らかく温かい印象。親しみやすく、人の世話をするのが自然",
    mercury: "感情的な記憶力が抜群。感覚的・直感的な思考スタイル",
    venus: "愛情深く献身的。家庭的な幸せを恋愛に求める",
    mars: "感情が行動のエンジン。守るためなら強いエネルギーを発揮",
    jupiter: "家族・不動産・食に関することで幸運。母国への帰属が吉",
    saturn: "過去の手放しと感情的な自立が人生の課題",
  },
  {
    name: "獅子座", nameEn: "Leo", symbol: "♌", element: "火", quality: "不動",
    ruling: "太陽", keyword: "自己表現・創造・誇り",
    personality: "カリスマ的で寛大、自己表現を愛する",
    sun: "本来の支配星。輝くことが使命。創造性とリーダーシップに満ちる",
    moon: "承認を求め、ドラマチックな感情表現。称賛されると喜びが倍増",
    rising: "堂々として華やか。部屋に入るだけで存在感を放つ",
    mercury: "情熱的で説得力のある話し方。物語を語るのが得意",
    venus: "ロマンティックで情熱的な愛。特別扱いを大切にする",
    mars: "大きな目標に向かって燃える。競争で本領を発揮",
    jupiter: "創造的な表現・芸能・子どもに関することで幸運",
    saturn: "傲慢さを手放し、心から人を認めることが人生の課題",
  },
  {
    name: "乙女座", nameEn: "Virgo", symbol: "♍", element: "地", quality: "柔軟",
    ruling: "水星", keyword: "分析・奉仕・完璧",
    personality: "分析的で勤勉、細部への配慮が際立つ",
    sun: "几帳面で誠実。実用的な知性と奉仕精神を持つ",
    moon: "不安を整理・分析することで対処する。秩序が心の安定をもたらす",
    rising: "清潔で知的な印象。礼儀正しく控えめだが有能",
    mercury: "本来の支配星（と水星共同）。分析的・批判的思考の達人",
    venus: "丁寧に愛情を表現する。相手への細かい気配りが愛の証",
    mars: "完璧な準備をしてから行動する。細かい作業への集中力が高い",
    jupiter: "医療・健康・分析・農業に関することで幸運",
    saturn: "自己批判を手放し、不完全な自分を受け入れることが人生の課題",
  },
  {
    name: "天秤座", nameEn: "Libra", symbol: "♎", element: "風", quality: "活動",
    ruling: "金星", keyword: "調和・公正・美",
    personality: "調和を愛し、美的センスと外交力に優れる",
    sun: "公平で外交的。美と調和を追求する。優柔不断な面も",
    moon: "感情のバランスを常に保とうとする。不調和が最大のストレス",
    rising: "魅力的で洗練された印象。誰とも上手く接する社交的な雰囲気",
    mercury: "バランスのとれた判断力。両面を見て考えるが決断に時間がかかる",
    venus: "本来の支配星。美しいものと調和ある関係を愛する",
    mars: "穏やかに行動するが、不公正には毅然と立ち向かう",
    jupiter: "対人関係・法律・芸術・パートナーシップで幸運",
    saturn: "他者に依存せず自分の意見を持つことが人生の課題",
  },
  {
    name: "蠍座", nameEn: "Scorpio", symbol: "♏", element: "水", quality: "不動",
    ruling: "冥王星", keyword: "変容・深み・力",
    personality: "深い洞察力と強い意志、変容を司る",
    sun: "強烈な集中力と直感。秘密を守り、深く愛し、完全な変容を体験する",
    moon: "感情が深く強烈。傷つきたくない保護本能から秘密主義になることも",
    rising: "神秘的で強い眼差し。近寄りがたくも引きつける存在感",
    mercury: "鋭い洞察力と心理的直感。秘密を見抜く能力に長ける",
    venus: "深い一体感を求める。嫉妬が強いが愛する時は一途",
    mars: "本来の支配星（古典）。情熱的で持続的なエネルギー。執念が強い",
    jupiter: "変容・心理・遺産・秘密事に関することで幸運",
    saturn: "コントロール欲を手放し信頼することが人生の課題",
  },
  {
    name: "射手座", nameEn: "Sagittarius", symbol: "♐", element: "火", quality: "柔軟",
    ruling: "木星", keyword: "自由・冒険・哲学",
    personality: "自由と冒険を愛し、楽観的な哲学者",
    sun: "大らかで楽観的。真理を求めて旅し、知恵を広める使命を持つ",
    moon: "感情をポジティブに捉える。自由を制限されると情緒不安定になる",
    rising: "率直で明るく、冒険好きな印象。異文化への開放性がある",
    mercury: "大局的な思考。細部より全体像を掴む。哲学的な言葉を好む",
    venus: "自由を共有できる旅仲間を愛する。束縛される恋が苦手",
    mars: "理想と信念のために戦う。長距離のエネルギーを持つ",
    jupiter: "本来の支配星。旅・教育・宗教・海外・出版で幸運が最大化",
    saturn: "一つの場所と関係に根を張ることが人生の課題",
  },
  {
    name: "山羊座", nameEn: "Capricorn", symbol: "♑", element: "地", quality: "活動",
    ruling: "土星", keyword: "野心・規律・達成",
    personality: "責任感が強く、野心的で現実的な達成者",
    sun: "忍耐と野心で山を登り続ける。社会的地位と実績を積み上げる",
    moon: "感情を抑制し実用的に対処する。弱みを見せることへの抵抗感",
    rising: "落ち着いて信頼できる雰囲気。若い頃は老け見えだが歳とともに若返る",
    mercury: "論理的で実用的な思考。長期計画と戦略立案が得意",
    venus: "安定した関係を好む。愛情表現は地味だが誠実で長続き",
    mars: "粘り強く着実に行動。ゆっくりだが確実に目標を達成",
    jupiter: "キャリア・社会的地位・組織・伝統に関することで幸運",
    saturn: "本来の支配星。完璧を追い求めすぎず休むことが人生の課題",
  },
  {
    name: "水瓶座", nameEn: "Aquarius", symbol: "♒", element: "風", quality: "不動",
    ruling: "天王星", keyword: "革新・人道・独自性",
    personality: "独創的で人道的、未来を見据える革新者",
    sun: "前衛的で独自の視点を持つ。集団の自由のために戦う",
    moon: "感情を客観的に分析する。人類への愛と個人への親密さの葛藤",
    rising: "ユニークで親しみやすい印象。友人が多く、グループの中心になる",
    mercury: "革新的な思考。常識を疑い、未来志向の発想をする",
    venus: "まず友人から始まる恋愛。精神的なつながりを重視",
    mars: "集団のため・理想のために行動する。反骨心が原動力になる",
    jupiter: "友人・グループ・テクノロジー・社会変革に関することで幸運",
    saturn: "感情的なつながりを深め孤立を避けることが人生の課題",
  },
  {
    name: "魚座", nameEn: "Pisces", symbol: "♓", element: "水", quality: "柔軟",
    ruling: "海王星", keyword: "直感・慈悲・夢",
    personality: "感受性豊かで霊的、慈悲と共感の塊",
    sun: "境界が溶けるような共感力。芸術・夢・スピリチュアルに深く繋がる",
    moon: "感情が海のように広大。他人の痛みを自分のように感じてしまう",
    rising: "柔らかく夢見がちな印象。神秘的で詩的な雰囲気を放つ",
    mercury: "直感と象徴で思考する。論理より詩や比喩で表現することを好む",
    venus: "理想の愛を夢見る。魂レベルの繋がりを恋愛に求める",
    mars: "霊感と直感で行動する。明確な目標より感じるままに動く",
    jupiter: "芸術・音楽・スピリチュアル・慈善活動で幸運が開ける",
    saturn: "現実的な境界線を持ち、自分を守ることが人生の課題",
  },
];

// ── 天体計算 ──────────────────────────────────────────────
function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 太陽の真黄経（Jean Meeus式）— 楕円軌道補正込みで誤差±0.01°
function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T;
  const M  = (357.52911 + 35999.05029 * T) * Math.PI / 180;
  const C  = (1.9146 - 0.004817 * T) * Math.sin(M)
           + 0.019993 * Math.sin(2 * M)
           + 0.00029  * Math.sin(3 * M);
  return ((L0 + C) % 360 + 360) % 360;
}

// 月の黄経（主要摂動項込み）— 誤差±0.3°
function getMoonLongitude(jd: number): number {
  const T  = (jd - 2451545.0) / 36525.0;
  const L  = 218.3164477 + 481267.88123421 * T;
  const M  = (357.5291092  + 35999.0502909 * T) * Math.PI / 180;
  const Mp = (134.9633964  + 477198.8675055 * T) * Math.PI / 180;
  const D  = (297.8501921  + 445267.1114034 * T) * Math.PI / 180;
  const F  = (93.2720950   + 483202.0175233 * T) * Math.PI / 180;
  const lon = L
    + 6.289 * Math.sin(Mp)
    - 1.274 * Math.sin(2*D - Mp)
    + 0.658 * Math.sin(2*D)
    - 0.186 * Math.sin(M)
    - 0.059 * Math.sin(2*Mp - 2*D)
    - 0.057 * Math.sin(Mp - 2*D + M)
    + 0.053 * Math.sin(Mp + 2*D)
    + 0.046 * Math.sin(2*D - M)
    + 0.041 * Math.sin(Mp - M)
    - 0.035 * Math.sin(D)
    - 0.031 * Math.sin(Mp + M)
    - 0.015 * Math.sin(2*F - 2*D)
    + 0.011 * Math.sin(Mp - 4*D);
  return ((lon % 360) + 360) % 360;
}

// 外惑星は平均黄経で十分（移動が遅くサイン境界誤差が小さい）
const PLANET_REFS: Record<string, { l0: number; motion: number }> = {
  mercury: { l0: 252.251,  motion: 4.09233    },
  venus:   { l0: 181.979,  motion: 1.60213    },
  mars:    { l0: 355.433,  motion: 0.52403    },
  jupiter: { l0:  34.396,  motion: 0.08309    },
  saturn:  { l0:  49.944,  motion: 0.03346    },
};

function getSignIndex(jd: number, planet: string): number {
  if (planet === "sun")  return Math.floor(getSunLongitude(jd) / 30);
  if (planet === "moon") return Math.floor(getMoonLongitude(jd) / 30);
  const p = PLANET_REFS[planet];
  const d = jd - 2451545.0;
  const lon = ((p.l0 + p.motion * d) % 360 + 360) % 360;
  return Math.floor(lon / 30);
}

// 上昇星座（アセンダント）簡易計算
// lat: 北緯(度), birthHourJST: 出生時間(JST 0-23)
function getAscendantIndex(jd: number, birthHourJST: number, lat: number = 35.68): number {
  const d = jd - 2451545.0;
  const utcHour = birthHourJST - 9;
  const gmst = ((280.46061837 + 360.98564736629 * d + utcHour * 15) % 360 + 360) % 360;
  const lst = (gmst + 135) % 360; // 東経135°（日本標準子午線）

  const eps = 23.4393 * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const ramcRad = lst * (Math.PI / 180);

  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  let asc = Math.atan2(y, x) * (180 / Math.PI);
  if (asc < 0) asc += 360;
  return Math.floor(asc / 30);
}

// MC（中天）簡易計算
function getMCIndex(jd: number, birthHourJST: number): number {
  const d = jd - 2451545.0;
  const utcHour = birthHourJST - 9;
  const gmst = ((280.46061837 + 360.98564736629 * d + utcHour * 15) % 360 + 360) % 360;
  const lst = (gmst + 135) % 360;
  return Math.floor(lst / 30);
}

// 今日の通過天体（簡易トランジット）
function getTransitSign(planet: string): number {
  const now = new Date();
  const jdNow = julianDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return getSignIndex(jdNow, planet);
}

// 今年の星座別テーマ（木星トランジットで決まる大まかな流れ）
const YEARLY_THEMES: Record<string, string> = {
  牡羊座: "自己改革と新スタートの年。あなた自身に焦点が当たります。",
  牡牛座: "財運と価値観を整える年。自分の本当の価値に目覚めます。",
  双子座: "コミュニケーション・学習・ネットワークが開花する年。",
  蟹座: "家族・住まい・感情的ルーツに向き合う年。",
  獅子座: "創造性・恋愛・子どもに光が当たる年。自己表現の時。",
  乙女座: "健康・日常ルーティン・仕事改善に集中する年。",
  天秤座: "パートナーシップと対人関係が拡大する年。",
  蠍座: "変容・遺産・深い繋がりを通じて成長する年。",
  射手座: "旅・学習・哲学・海外との縁が広がる年。",
  山羊座: "キャリアと社会的地位が上昇する年。努力が実る。",
  水瓶座: "友人・グループ・未来のビジョンが拡大する年。",
  魚座: "スピリチュアルな深化と内省の年。癒しの時。",
};

// ── メイン関数 ──────────────────────────────────────────
export function getAstrologyReading(birthday: string, birthHour?: number): FortuneResult {
  const [yearStr, monthStr, dayStr] = birthday.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const jd = julianDay(year, month, day);

  // 出生天体
  const sunIdx = getSignIndex(jd, "sun");
  const moonIdx = getSignIndex(jd, "moon");
  const mercuryIdx = getSignIndex(jd, "mercury");
  const venusIdx = getSignIndex(jd, "venus");
  const marsIdx = getSignIndex(jd, "mars");
  const jupiterIdx = getSignIndex(jd, "jupiter");
  const saturnIdx = getSignIndex(jd, "saturn");

  const sunSign = SIGNS[sunIdx];
  const moonSign = SIGNS[moonIdx];
  const mercurySign = SIGNS[mercuryIdx];
  const venusSign = SIGNS[venusIdx];
  const marsSign = SIGNS[marsIdx];
  const jupiterSign = SIGNS[jupiterIdx];
  const saturnSign = SIGNS[saturnIdx];

  // 現在のトランジット
  const transitJupiterSign = SIGNS[getTransitSign("jupiter")];
  const yearlyTheme = YEARLY_THEMES[transitJupiterSign.name] || "";

  const hasTime = typeof birthHour === "number";
  const ascIdx = hasTime ? getAscendantIndex(jd, birthHour!) : null;
  const mcIdx = hasTime ? getMCIndex(jd, birthHour!) : null;
  const ascSign = ascIdx !== null ? SIGNS[ascIdx] : null;
  const mcSign = mcIdx !== null ? SIGNS[mcIdx] : null;

  const details = [
    {
      label: "☀️ 太陽星座（アイデンティティ・使命）",
      content: `${sunSign.symbol} ${sunSign.name} ── ${sunSign.sun}`,
    },
    {
      label: "🌙 月星座（感情・本能・内なる自己）",
      content: `${moonSign.symbol} ${moonSign.name} ── ${moonSign.moon}`,
    },
    ...(ascSign
      ? [{ label: "⬆️ 上昇星座・アセンダント（第一印象・外的人格）", content: `${ascSign.symbol} ${ascSign.name} ── ${ascSign.rising}` }]
      : [{ label: "⬆️ 上昇星座", content: "生まれた時間を入力するとアセンダントを算出できます" }]),
    ...(mcSign
      ? [{ label: "🏆 MC・中天（社会的使命・キャリア）", content: `${mcSign.symbol} ${mcSign.name} ── ${mcSign.jupiter}` }]
      : []),
    {
      label: "☿ 水星星座（思考・コミュニケーション）",
      content: `${mercurySign.symbol} ${mercurySign.name} ── ${mercurySign.mercury}`,
    },
    {
      label: "♀ 金星星座（愛・美・価値観）",
      content: `${venusSign.symbol} ${venusSign.name} ── ${venusSign.venus}`,
    },
    {
      label: "♂ 火星星座（行動力・情熱・欲求）",
      content: `${marsSign.symbol} ${marsSign.name} ── ${marsSign.mars}`,
    },
    {
      label: "♃ 木星星座（拡大・幸運・哲学）",
      content: `${jupiterSign.symbol} ${jupiterSign.name} ── ${jupiterSign.jupiter}`,
    },
    {
      label: "♄ 土星星座（課題・カルマ・成長）",
      content: `${saturnSign.symbol} ${saturnSign.name} ── ${saturnSign.saturn}`,
    },
    {
      label: "📅 今年の木星テーマ",
      content: `木星が${transitJupiterSign.name}を通過中 ── ${yearlyTheme}`,
    },
  ];

  const threeSign = ascSign
    ? `太陽：${sunSign.name} / 月：${moonSign.name} / 上昇：${ascSign.name}`
    : `太陽：${sunSign.name} / 月：${moonSign.name}`;

  return {
    title: `${sunSign.symbol} ${sunSign.name}のホロスコープ`,
    summary: threeSign,
    details,
    lucky: {
      color: sunSign.name === "牡羊座" ? "赤" : sunSign.name === "牡牛座" ? "緑" : sunSign.name === "双子座" ? "黄" : sunSign.name === "蟹座" ? "白" : sunSign.name === "獅子座" ? "金" : sunSign.name === "乙女座" ? "茶" : sunSign.name === "天秤座" ? "ピンク" : sunSign.name === "蠍座" ? "深紅" : sunSign.name === "射手座" ? "紫" : sunSign.name === "山羊座" ? "黒" : sunSign.name === "水瓶座" ? "水色" : "海の青",
      item: `${sunSign.ruling}のお守り`,
    },
    advice: `太陽が${sunSign.name}、月が${moonSign.name}のあなた。${sunSign.keyword}を軸に、${moonSign.moon.split("。")[0]}という感情パターンを持つ複雑で豊かな内面があります。${saturnSign.saturn}`,
  };
}
