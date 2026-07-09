import { FortuneResult } from "@/lib/types";

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

// 生年月日を数秘術的に1〜9に還元
function lifeNumber(y: number, m: number, d: number): number {
  let n = y + m + d;
  while (n > 9) {
    n = String(n).split("").reduce((a, c) => a + parseInt(c, 10), 0);
  }
  return n === 0 ? 9 : n;
}

type Culture = "greek" | "norse" | "egyptian" | "hindu" | "japanese" | "celtic";

interface DeityInfo {
  name: string;
  title: string;
  icon: string;
  origin: string;
  myth: string;
  power: string;
  message: string;
  lucky: string;
}

// 9領域 × 6文化 = 54柱
const DEITIES: Record<number, { domain: string; deities: Record<Culture, DeityInfo> }> = {
  1: {
    domain: "知恵・学問・真実",
    deities: {
      greek:    { name: "アテナ",         title: "知恵と戦略の女神",       icon: "🦉", origin: "古代ギリシャ",   myth: "ゼウスの頭から完全武装で生まれた知恵の女神。知識・技術・正義・戦略を司り、アテネの守護神でもあります。",         power: "知恵・戦略・技術・正義・芸術",   message: "知識こそ最強の武器。深く考え、学び続けることがあなたの使命です。",       lucky: "オリーブ" },
      norse:    { name: "オーディン",      title: "知識と魔法の最高神",     icon: "🐦", origin: "北欧神話",       myth: "知恵を得るために自らの目を犠牲にし、世界樹に9日間吊るされてルーン文字を発見した北欧の最高神。",               power: "知識・魔法・詩・ルーン・戦略",   message: "真の知恵は犠牲と探求の先にある。あなたには深く探求する魂があります。",   lucky: "ルーン石" },
      egyptian: { name: "トト",            title: "知識と書記の神",         icon: "🦅", origin: "古代エジプト",   myth: "人間に文字・科学・哲学・魔法を与えたエジプトの知識神。死者の審判でも公正な書記を務めます。",                   power: "知識・文字・時間・魔法・真実",   message: "記録し、学び、知識を次世代へ伝えることがあなたの使命です。",             lucky: "羽根ペン" },
      hindu:    { name: "サラスヴァティー", title: "学問と芸術の女神",       icon: "🎶", origin: "ヒンドゥー神話", myth: "4本の手でヴィーナを奏でる学問・芸術・知恵の女神。白い蓮の花に座り、純粋な知識と創造を象徴します。",           power: "学問・音楽・芸術・言語・知恵",   message: "知識と創造は一つ。学びと表現の中で魂が輝きます。",                       lucky: "白い蓮" },
      japanese: { name: "天照大御神",      title: "太陽と知恵の最高神",     icon: "☀️", origin: "日本神話",       myth: "日本神話の最高神。岩戸に隠れた際に世界が闇に包まれ、再び現れて光と知恵を取り戻したとされます。",               power: "知恵・光・統治・生命の根源",     message: "内なる光が周囲を照らします。知恵と慈愛で人々を導いてください。",         lucky: "勾玉" },
      celtic:   { name: "ブリジット",      title: "詩と知恵と炎の女神",     icon: "🔥", origin: "ケルト神話",     myth: "詩・鍛冶・癒しの三つの炎を守るケルトの女神。知識と創造と治癒を一身に体現します。",                         power: "詩・知恵・鍛冶・癒し・聖なる炎", message: "知識・創造・癒しの三位一体があなたの力の源です。",                       lucky: "炎" },
    },
  },
  2: {
    domain: "愛・美・豊穣",
    deities: {
      greek:    { name: "アフロディーテ", title: "愛と美の女神",           icon: "💕", origin: "古代ギリシャ",   myth: "海の泡から生まれた美と愛の女神。その美しさは神々をも惑わし、愛と欲望・豊穣を司ります。",                     power: "愛・美・魅力・豊穣・人間関係",   message: "愛することの力があなたの最大の武器。美しさで世界を変えられます。",       lucky: "薔薇" },
      norse:    { name: "フレイア",       title: "愛と魔法と戦の女神",     icon: "🐱", origin: "北欧神話",       myth: "愛と美と豊穣の女神でありながら、戦死者の半分を選ぶ力も持つ北欧最強の女神の一柱。",                         power: "愛・美・豊穣・魔法・強さ",       message: "愛と強さは共存します。深く愛することがあなたの本質の力です。",           lucky: "ネックレス" },
      egyptian: { name: "ハトホル",       title: "愛と喜びの女神",         icon: "🐄", origin: "古代エジプト",   myth: "牛の角を持つ愛・音楽・美・踊りの女神。人々に喜びと豊穣をもたらすエジプト最愛の女神。",                     power: "愛・美・音楽・踊り・母性・豊穣", message: "喜びと愛こそが神聖なもの。あなたの存在が周囲に幸福をもたらします。",   lucky: "黄金の鏡" },
      hindu:    { name: "ラクシュミー",   title: "幸運と美と豊穣の女神",   icon: "🪷", origin: "ヒンドゥー神話", myth: "蓮の花の上に立つ美の女神。富・幸運・豊穣・美を司り、宇宙の秩序を支えるヴィシュヌ神の妻。",               power: "美・富・幸運・豊穣・愛・繁栄",   message: "美と豊かさは内側から生まれます。感謝と愛が幸運を引き寄せます。",         lucky: "金貨" },
      japanese: { name: "弁財天",         title: "愛と芸術と富の女神",     icon: "🎵", origin: "日本神話",       myth: "七福神の紅一点。琵琶を奏でる音楽・芸術・弁舌・財運を司る女神。水の神としての側面も持ちます。",             power: "音楽・芸術・弁舌・財運・愛・水", message: "あなたの感性と表現力が人々の心を動かします。",                           lucky: "琵琶" },
      celtic:   { name: "エポナ",         title: "豊穣と旅と守護の女神",   icon: "🐴", origin: "ケルト神話",     myth: "白馬に乗るケルトの女神。豊穣・旅・守護・魂の案内を司り、ローマ軍にも崇拝された稀有な神。",               power: "豊穣・旅・守護・自由・魂の案内", message: "自由と豊かさは共に生きます。あなたの魂は制約を超えて広がります。",       lucky: "白馬" },
    },
  },
  3: {
    domain: "戦・勝利・守護",
    deities: {
      greek:    { name: "アレス",   title: "戦の神",             icon: "⚔️",  origin: "古代ギリシャ",   myth: "ギリシャの戦争・勇気の神。情熱的で猛烈な戦士の化身であり、真の勇気と戦いの本質を象徴します。",           power: "戦闘・勇気・情熱・強さ・守護",     message: "戦う価値のあるものがあなたを強くします。情熱こそが最大の武器です。", lucky: "赤い盾" },
      norse:    { name: "トール",   title: "雷と守護の神",       icon: "⚡",  origin: "北欧神話",       myth: "ミョルニルという槌を持つ北欧の雷神。人類を守るために巨人たちと戦い続ける最強の守護者。",               power: "雷・嵐・守護・力・豊穣",           message: "強さは守るためにある。あなたの力は大切な人々への守護として輝きます。", lucky: "鉄の槌" },
      egyptian: { name: "セクメト", title: "戦と癒しの女神",     icon: "🦁",  origin: "古代エジプト",   myth: "ライオンの頭を持つ太陽の女神。恐るべき戦いの力を持ちながら、癒しと医術の守護者でもあります。",         power: "戦闘・癒し・太陽の力・変革",       message: "最大の力は破壊と癒しの両方を知ること。あなたには変革の力があります。", lucky: "赤いジャスパー" },
      hindu:    { name: "カーリー", title: "時間と変革と解放の女神", icon: "🌑", origin: "ヒンドゥー神話", myth: "黒い肌と無数の腕を持つ恐ろしくも偉大な女神。悪を滅し、時間を司り、魂を解放する宇宙的な力。",       power: "変革・解放・時間・破壊と創造",     message: "恐れるものを滅することで真の自由が生まれます。あなたには変革の力があります。", lucky: "黒水晶" },
      japanese: { name: "毘沙門天", title: "戦と守護の天王",     icon: "🗡️",  origin: "日本神話",       myth: "七福神の一柱で四天王の一人。財宝と勝利を司り、仏法と人々を守る武神。北方を守護します。",             power: "戦・守護・勝利・財宝・北方",       message: "守るべきものがあるとき、あなたの力は最大になります。",               lucky: "虎" },
      celtic:   { name: "モリガン", title: "戦と運命の女神",     icon: "🐦‍⬛", origin: "ケルト神話",     myth: "カラスの姿で戦場を飛ぶケルトの戦の女神。運命・死・変容・戦いの結末を予言し司ります。",             power: "戦・予言・運命・変容・死と再生",   message: "運命は変えられる。あなたの意志が戦いの行方を決めます。",             lucky: "黒羽根" },
    },
  },
  4: {
    domain: "自然・大地・生命",
    deities: {
      greek:    { name: "デメテル",    title: "大地と農業の女神",       icon: "🌾", origin: "古代ギリシャ",   myth: "穀物・農業・豊穣を司る大地の女神。娘ペルセポネの喪失が季節の移り変わりを生み出したとされます。",     power: "農業・豊穣・大地・季節・母性・生命", message: "あなたには生命を育む深い愛があります。大地のように安定して周囲を支えます。", lucky: "麦の穂" },
      norse:    { name: "フレイ",      title: "豊穣と太陽の神",         icon: "🌞", origin: "北欧神話",       myth: "太陽の光と雨を司り豊穣をもたらす北欧の神。平和と繁栄の時代の象徴で、生命の喜びを体現します。",     power: "豊穣・太陽・雨・生命・平和・繁栄",   message: "生きることの喜びと豊かさがあなたの本質。周囲に実りをもたらします。",     lucky: "黄金の猪" },
      egyptian: { name: "オシリス",    title: "豊穣と死と再生の神",     icon: "🌿", origin: "古代エジプト",   myth: "緑色の肌を持つ死と再生と豊穣の神。殺されて蘇ったその生涯がナイルの洪水と農業の象徴となりました。", power: "豊穣・死と再生・農業・正義",         message: "終わりは始まりです。あなたには再生と成長の力があります。",               lucky: "緑の宝石" },
      hindu:    { name: "インドラ",    title: "雷雨と豊穣の神王",       icon: "🌩️", origin: "ヒンドゥー神話", myth: "雷と嵐と雨を司る神々の王。大地に雨を与え生命を育む豊穣神であり、悪と戦う戦士でもあります。",       power: "雷・嵐・豊穣・リーダーシップ・雨",   message: "あなたのエネルギーが周囲に生命をもたらします。大地を潤してください。",   lucky: "雷の石" },
      japanese: { name: "大国主命",    title: "縁結びと国造りの神",     icon: "🐇", origin: "日本神話",       myth: "出雲大社の主祭神。国土を作り、人々の縁を結び、農業・医療・商業を人間に伝えた偉大な神。",           power: "縁結び・国造り・農業・医療・商業",   message: "縁を大切にすることがあなたの人生を豊かにします。すべてはつながっています。", lucky: "出雲の土" },
      celtic:   { name: "ケルヌンノス", title: "森と動物と豊穣の神",    icon: "🦌", origin: "ケルト神話",     myth: "鹿の角を持つケルトの自然神。野生の動物たちの主であり、森・豊穣・生と死のサイクルを司ります。",     power: "自然・動物・豊穣・生と死・野生の知恵", message: "自然の声があなたに語りかけています。直感と本能を信じてください。",       lucky: "鹿の角" },
    },
  },
  5: {
    domain: "海・水・嵐",
    deities: {
      greek:    { name: "ポセイドン",            title: "海と地震の神",       icon: "🔱", origin: "古代ギリシャ",   myth: "三叉の矛を持つ海の支配者。海・嵐・地震・馬を司り、その怒りは大地を揺るがすほど強大です。",             power: "海・嵐・地震・馬・感情の深み",     message: "深く広い感情があなたの源泉。その力を制御するとき、あなたは最強になります。", lucky: "三叉の矛" },
      norse:    { name: "エーギル",              title: "海の巨人神",         icon: "🌊", origin: "北欧神話",       myth: "北欧神話の海の巨人。神々のために豊かな宴を開き、海の嵐と深淵を支配します。",                         power: "海・嵐・宴・深淵・巨大な力",       message: "深さがあなたの力です。表面の嵐の下に揺るぎない深みがあります。",         lucky: "海の貝" },
      egyptian: { name: "ヌン",                  title: "原初の海の神",       icon: "💧", origin: "古代エジプト",   myth: "創造以前から存在する原始の水の神。すべての命の源であり、太陽神ラーが毎朝その水から生まれます。",       power: "原初の水・創造の源・無限の深み",   message: "あなたはすべての源につながっています。深い静寂の中に究極の力があります。", lucky: "青いカーネリアン" },
      hindu:    { name: "ヴァルナ",              title: "水と正義の神",       icon: "🪬", origin: "ヒンドゥー神話", myth: "宇宙の秩序と水を司る古代インドの神。真実と正義の守護者であり、人々の行為を監視します。",             power: "水・宇宙の秩序・正義・真実",       message: "真実と誠実さがあなたを守ります。深い正義感があなたの核心にあります。",   lucky: "水晶" },
      japanese: { name: "龍神",                  title: "水と海と繁栄の神",   icon: "🐉", origin: "日本神話",       myth: "日本の水の守護神。海・川・雨を司り、竜宮城の主として繁栄と豊かさをもたらします。",                   power: "水・海・雨・繁栄・変容・深い知恵", message: "流れに乗ることがあなたの強さ。水のように柔軟でいながら、岩も砕く力があります。", lucky: "龍の珠" },
      celtic:   { name: "マナナン・マクリル",    title: "海と異界の神",       icon: "🌀", origin: "ケルト神話",     myth: "霧の島を統べるケルトの海神。死者の島への案内者であり、変幻自在の魔法使い。",                         power: "海・霧・異界・魔法・変容",         message: "目に見えない世界があなたには見えます。境界を渡る力があなたにはあります。", lucky: "霧の水晶" },
    },
  },
  6: {
    domain: "太陽・光・創造",
    deities: {
      greek:    { name: "アポロン", title: "太陽と芸術と予言の神", icon: "🏹", origin: "古代ギリシャ",   myth: "太陽・音楽・詩・芸術・予言・医術を司るオリンポスの美しき神。理性・秩序・美の理想を体現します。",       power: "太陽・芸術・音楽・予言・理性・医術", message: "あなたの才能は光のように人々を照らします。創造することがあなたの使命です。",   lucky: "月桂樹" },
      norse:    { name: "バルドル",  title: "光と美と希望の神",    icon: "✨", origin: "北欧神話",       myth: "北欧神話で最も美しく光輝く神。その死は世界に深い悲しみをもたらしたほど、すべての存在に愛されていました。", power: "光・美・純粋さ・愛・希望",           message: "あなたの純粋さと光が世界に希望をもたらします。",                               lucky: "白い花" },
      egyptian: { name: "ラー",      title: "太陽の最高神",        icon: "☀️", origin: "古代エジプト",   myth: "太陽の化身であり、毎日空を渡って光をもたらすエジプト最高神の一柱。創造と生命の源泉。",               power: "太陽・創造・生命・光・最高の力",     message: "あなたには創造の力があります。光のように存在するだけで周囲を生かします。",   lucky: "黄金の円盤" },
      hindu:    { name: "スーリヤ",  title: "太陽の神",            icon: "🌟", origin: "ヒンドゥー神話", myth: "7頭の馬が引く戦車で空を渡る太陽神。生命・健康・真実・知識の源であり、宇宙のエネルギーの体現。",       power: "太陽・生命・健康・真実・宇宙の力",   message: "あなたは周囲に光とエネルギーをもたらす存在です。太陽のように輝いてください。", lucky: "紅いルビー" },
      japanese: { name: "天照大御神", title: "太陽と最高神",       icon: "🌅", origin: "日本神話",       myth: "日本神話の最高神にして太陽の神。その不在が世界を闇に落とすほどの偉大な力を持ちます。",               power: "太陽・光・統治・生命の根源",         message: "あなたの存在そのものが光。いるだけで周囲を照らし、生かす力があります。",     lucky: "八咫鏡" },
      celtic:   { name: "ルー",      title: "光と技芸の万能神",    icon: "🔆", origin: "ケルト神話",     myth: "「長腕のルー」と呼ばれるケルトの太陽神。あらゆる技術に秀でた万能の神であり、光と技芸を体現します。", power: "光・太陽・万能の技術・知恵・魔法",   message: "多才さがあなたの強み。あらゆる分野で光を放つことができます。",               lucky: "太陽の石" },
    },
  },
  7: {
    domain: "月・夜・神秘",
    deities: {
      greek:    { name: "アルテミス",       title: "月と狩りの女神",       icon: "🌙", origin: "古代ギリシャ",   myth: "銀の弓を持つ月の女神。狩り・純潔・野生・出産を守護し、独立と自由の象徴。",                                 power: "月・狩り・自然・純潔・独立",         message: "独立した強さがあなたの本質。自分の道を自分で選ぶ勇気があります。",           lucky: "銀の弓" },
      norse:    { name: "マーニ",           title: "月の神",               icon: "🌕", origin: "北欧神話",       myth: "馬車で夜空を渡る北欧の月の神。時間・潮の満ち引き・夢・夜の旅人を守護します。",                           power: "月・時間・潮・夢・夜の守護",         message: "夜の静寂の中にあなたの真の力が宿っています。",                               lucky: "銀の玉" },
      egyptian: { name: "コンス",           title: "月と時間の神",         icon: "🌛", origin: "古代エジプト",   myth: "鷹の頭と月の円盤を持つエジプトの月神。時間・癒し・旅人の守護を司ります。",                               power: "月・時間・癒し・旅人の守護",         message: "時間と癒しの力があなたに流れています。穏やかな夜のエネルギーを信じてください。", lucky: "月長石" },
      hindu:    { name: "チャンドラ",       title: "月の神",               icon: "🌙", origin: "ヒンドゥー神話", myth: "白い馬車に乗る月の神。精神・感情・植物・時間を司り、人々の心の満ち欠けに影響を与えます。",             power: "月・精神・感情・時間・植物",         message: "感情の波があなたを深くします。月のように変化しながらも本質は変わりません。",   lucky: "白い真珠" },
      japanese: { name: "月読命",           title: "月と夜の神",           icon: "🌕", origin: "日本神話",       myth: "天照大御神の弟神にして月の神。夜の世界を統べ、時間・暦・潮の満ち引きを司ります。",                       power: "月・夜・時間・暦・潮・静かな強さ",   message: "夜にこそ輝く才能があります。静かな中に深い力を宿しています。",               lucky: "白玉" },
      celtic:   { name: "アリアンロッド",   title: "月と星と運命の女神",   icon: "⭐", origin: "ケルト神話",     myth: "銀の車輪を持つ星と月の女神。運命・時間・再生・銀河を司ります。",                                         power: "月・星・銀河・運命・時間・再生",     message: "宇宙のリズムとつながっています。あなたの運命は星に刻まれています。",         lucky: "星型の石" },
    },
  },
  8: {
    domain: "死・再生・変容",
    deities: {
      greek:    { name: "ペルセポネ", title: "冥界と春の女神",     icon: "🌸", origin: "古代ギリシャ",   myth: "冥界の女王にして春の女神。地上と冥界を行き来するその生涯が、季節の循環を生み出しました。",           power: "冥界・春・変容・死と再生・二つの世界", message: "終わりと始まりはひとつ。あなたには変容と再生の力があります。",           lucky: "ざくろ" },
      norse:    { name: "ヘル",       title: "冥界の女神",         icon: "⚫", origin: "北欧神話",       myth: "半分が生者、半分が死者の姿を持つ北欧の冥界の女神。死者の国を治め、魂を公平に裁きます。",           power: "冥界・死・公平な裁き・二つの性質",   message: "見えない世界の力があなたには流れています。深い洞察力で物事の本質を見ます。", lucky: "黒と白の石" },
      egyptian: { name: "アヌビス",   title: "魂の守護者と案内者", icon: "⚖️", origin: "古代エジプト",   myth: "ジャッカルの頭を持つ死者の守護神。魂の重さを測り、死後の世界へ公正に案内します。",                   power: "死の守護・魂の裁き・変容・公正",     message: "変化を恐れないでください。あなたには魂の深さを見極める力があります。",   lucky: "黒いジャスパー" },
      hindu:    { name: "シヴァ",     title: "破壊と再生の最高神", icon: "🕉️", origin: "ヒンドゥー神話", myth: "ヒンドゥー教三主神の一人。宇宙の破壊と再生を司り、ヨガと瞑想の守護者でもあります。",               power: "破壊と創造・瞑想・時間・変容",       message: "古いものを手放すとき、新しい創造が始まります。変容こそがあなたの本質です。", lucky: "三叉戟" },
      japanese: { name: "イザナミ",   title: "創造と死の女神",     icon: "🌑", origin: "日本神話",       myth: "イザナギとともに日本の国土を生んだ創造の女神。火の神を産んだことで黄泉の国の主となります。",       power: "創造・死・変容・黄泉・深い母性",     message: "創造と終わりは一つです。あなたの内には始まりと終わりの両方の力があります。", lucky: "黒曜石" },
      celtic:   { name: "ダグザ",     title: "大地と死と再生の父神", icon: "🪄", origin: "ケルト神話",    myth: "ケルト神話の「良き神」。大きな棍棒で死者を蘇らせ、不思議な大釜で命を与える全能の父神。",           power: "死と再生・豊穣・魔法の大釜・大地",   message: "あなたには再生の力があります。どんな状況からも立ち上がる強さを持っています。", lucky: "大釜" },
    },
  },
  9: {
    domain: "縁・旅・導き",
    deities: {
      greek:    { name: "ヘルメス",        title: "旅人と伝令と縁の神",   icon: "🪶", origin: "古代ギリシャ",   myth: "翼のある帽子と靴を持つ伝令神。神と人間の橋渡しをし、旅人・商人・魂の案内者でもあります。",             power: "旅・伝令・商業・知恵・縁・境界を渡る力", message: "あなたには人と人・世界と世界をつなぐ力があります。境界を越えて動き続けてください。", lucky: "翼のある靴" },
      norse:    { name: "ヘルモーズ",      title: "伝令と勇気の神",       icon: "🏇", origin: "北欧神話",       myth: "オーディンの息子で神々の伝令。バルドルを救うため一人で冥界へ赴く勇気と使命感の神。",                   power: "伝令・勇気・使命・境界を越える力",       message: "どんな困難な使命も諦めない。あなたには勇気と使命への献身があります。",       lucky: "黄金の杖" },
      egyptian: { name: "ウプワウト",      title: "道を開く神",           icon: "🐺", origin: "古代エジプト",   myth: "ジャッカルの姿を持つ「道を開く者」。軍の先頭に立ち、死者の魂を安全に冥界へ導きます。",               power: "道開き・案内・守護・変容への導き",       message: "人を正しい道へ導くことがあなたの使命です。先頭に立って道を開いてください。",   lucky: "青い水晶" },
      hindu:    { name: "ガネーシャ",      title: "縁結びと商売と旅の神", icon: "🐘", origin: "ヒンドゥー神話", myth: "象の頭を持つ知恵と富と新しい始まりの神。障害を取り除き、縁を結び、旅と商業を守護します。",           power: "縁結び・商売繁盛・旅・新しい始まり",     message: "新しい始まりを恐れないでください。あなたの前の障害はガネーシャが取り除いてくれます。", lucky: "象の置物" },
      japanese: { name: "猿田彦命",        title: "道開きと旅の神",       icon: "🌺", origin: "日本神話",       myth: "天孫降臨の際に道を開いた案内の神。すべての道と旅の守護者であり、縁と出会いをもたらします。",         power: "道開き・旅・縁・案内・交差点の守護",     message: "あなたは人々の道を開く存在です。出会いと縁を大切にすることが使命です。",     lucky: "赤い実" },
      celtic:   { name: "クウ・フーリン", title: "英雄と旅の守護者",     icon: "🌤️", origin: "ケルト神話",     myth: "アイルランド最大の英雄神。太陽神ルーの息子として生まれ、旅と戦いと縁を通じて運命を切り拓きます。", power: "旅・英雄の力・縁・運命の開拓",           message: "あなたの旅そのものが伝説になります。出会う縁を大切に、道を切り拓いてください。", lucky: "槍" },
    },
  },
};

const CULTURE_NAMES: Record<Culture, string> = {
  greek: "古代ギリシャ", norse: "北欧", egyptian: "古代エジプト",
  hindu: "ヒンドゥー", japanese: "日本", celtic: "ケルト",
};

// 3問の答えを文化圏スコアに変換
const Q1_MAP: Record<string, Culture> = { a: "greek", b: "norse", c: "egyptian", d: "hindu", e: "japanese", f: "celtic" };
const Q2_MAP: Record<string, Culture> = { a: "greek", b: "norse", c: "egyptian", d: "hindu", e: "japanese", f: "celtic" };
const Q3_MAP: Record<string, Culture> = { a: "greek", b: "norse", c: "egyptian", d: "hindu", e: "japanese", f: "celtic" };

export function getDeityReading(values: Record<string, string>): FortuneResult {
  const [y, m, d] = (values.birthday || "2000-01-01").split("-").map(Number);
  const domainNum = lifeNumber(y || 2000, m || 1, d || 1);

  const scores: Record<Culture, number> = { greek: 0, norse: 0, egyptian: 0, hindu: 0, japanese: 0, celtic: 0 };
  if (Q1_MAP[values.deity_q1]) scores[Q1_MAP[values.deity_q1]] += 3;
  if (Q2_MAP[values.deity_q2]) scores[Q2_MAP[values.deity_q2]] += 2;
  if (Q3_MAP[values.deity_q3]) scores[Q3_MAP[values.deity_q3]] += 1;

  // 最高スコアの文化圏（同点は誕生年で決定）
  const maxScore = Math.max(...Object.values(scores));
  const topCultures = (Object.keys(scores) as Culture[]).filter(c => scores[c] === maxScore);
  const culture = topCultures[y % topCultures.length];

  const domainData = DEITIES[domainNum];
  const deity = domainData.deities[culture];
  const seed = (y * 7 + m * 3 + d) + domainNum * 100 + (culture.charCodeAt(0));
  const r = rng(seed);

  const items = ["天然石", "お香", "キャンドル", "お守り", "聖なる水", "ハーブ"];
  const dirs  = ["東", "南", "西", "北", "東南", "北東"];

  return {
    title: `あなたの守護神：${deity.icon} ${deity.name}`,
    summary: `生年月日の数秘術が示す「${domainData.domain}」の領域と、あなたの価値観が引き寄せた${CULTURE_NAMES[culture]}の神話。その交点に宿る守護神は「${deity.name}（${deity.title}）」です。古今東西の数多の神々の中から、いまのあなたに最も深く寄り添う一柱が選ばれました。`,
    details: [
      { label: `${deity.icon} ${deity.name}（${deity.title}）の神話`, content: `${deity.myth} ${CULTURE_NAMES[culture]}の人々が語り継いできたこの神話に宿る力が、いまも「${domainData.domain}」を求めるあなたの背後に静かに息づいています。物語の中の${deity.name}の姿は、あなた自身がまだ気づいていない可能性を映す鏡でもあります。` },
      { label: "守護神があなたに与える力", content: `${deity.name}があなたに授けるのは「${deity.power}」の力です。これらはあなたが生まれ持った資質と深く重なり、人生の節目で大きな後ろ盾となります。意識して使うほど、その力は輪郭を帯びて鮮明になっていきます。` },
      { label: `あなたの魂の領域：${domainData.domain}`, content: `生年月日から導き出された魂の数「${domainNum}」は「${domainData.domain}」の領域を示しています。これがあなたの人生の根底に流れるテーマであり、${deity.name}が司る領域とも一致します。迷ったときは、この領域に立ち返ることで進むべき道が見えてきます。` },
      { label: "❤️ 恋愛・縁へのメッセージ", content: `「${domainData.domain}」を司る守護神を持つあなたの愛は、深さと一途さを帯びています。${deity.name}の「${deity.power}」の力は、表面的なつながりよりも、魂の奥で響き合える相手との縁を引き寄せます。自分の感性に正直でいることが、何よりの良縁への近道です。` },
      { label: "💼 仕事・使命へのメッセージ", content: `${deity.name}の加護は、あなたが「${domainData.domain}」に関わる場でこそ最も輝くことを示しています。「${deity.power}」を仕事に活かすほど、評価と充実感が後からついてくるでしょう。困難な局面ほど、守護神の力が静かに背中を押してくれます。` },
      { label: "💰 金運・豊かさ", content: `豊かさは、あなたが守護神の領域に沿って生きるとき、自然と巡ってくるものです。焦って追いかけるより、「${domainData.domain}」を大切にする姿勢そのものが、結果として実りを呼び込みます。受け取ったものへの感謝を忘れないことが、循環を太くします。` },
      { label: "💬 守護神からのメッセージ", content: `${deity.name}はあなたにこう語りかけています──「${deity.message}」 この言葉を、これからの人生の道標として心の奥に留めてください。迷いが生じたときほど、この一言があなたを本来の道へと引き戻してくれるはずです。` },
      { label: `${CULTURE_NAMES[culture]}の神話との縁`, content: `あなたの価値観と感性は${CULTURE_NAMES[culture]}の神話世界と深く共鳴しています。${deity.name}はその神話において「${domainData.domain}」を司る存在であり、その物語そのものがあなたの生き方のヒントになります。` },
      { label: "🌟 開運アクション", content: `${deity.name}にゆかりの深い「${deity.lucky}」を、お守りやイメージとして日常にそっと取り入れてみてください。静かな時間に守護神を思い浮かべ、感謝を捧げることで縁はさらに深まります。ラッキーカラーやラッキーアイテムを身近に置くのもおすすめです。` },
    ],
    lucky: { color: pick(["金色", "銀", "白", "青", "紫", "赤"], r), item: pick(items, r), direction: pick(dirs, r) },
    advice: `守護神との縁は、意識を向けるほどに深まっていきます。${deity.name}は、あなたが自分の力を信じて一歩を踏み出すときにこそ、最も強くその加護を発揮します。困難なときも「守られている」という安心を胸に、自分の道を堂々と歩んでください。`,
  };
}
