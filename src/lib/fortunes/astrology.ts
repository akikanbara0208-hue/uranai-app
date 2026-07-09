import { ChartWheelData, FortuneResult } from "@/lib/types";

// ── 出生地（都道府県庁所在地の緯度・東経）──
export const PREFECTURES: { name: string; lat: number; lon: number }[] = [
  { name: "北海道", lat: 43.06, lon: 141.35 }, { name: "青森県", lat: 40.82, lon: 140.74 },
  { name: "岩手県", lat: 39.70, lon: 141.15 }, { name: "宮城県", lat: 38.27, lon: 140.87 },
  { name: "秋田県", lat: 39.72, lon: 140.10 }, { name: "山形県", lat: 38.24, lon: 140.36 },
  { name: "福島県", lat: 37.75, lon: 140.47 }, { name: "茨城県", lat: 36.34, lon: 140.45 },
  { name: "栃木県", lat: 36.57, lon: 139.88 }, { name: "群馬県", lat: 36.39, lon: 139.06 },
  { name: "埼玉県", lat: 35.86, lon: 139.65 }, { name: "千葉県", lat: 35.61, lon: 140.12 },
  { name: "東京都", lat: 35.69, lon: 139.69 }, { name: "神奈川県", lat: 35.45, lon: 139.64 },
  { name: "新潟県", lat: 37.90, lon: 139.02 }, { name: "富山県", lat: 36.70, lon: 137.21 },
  { name: "石川県", lat: 36.59, lon: 136.63 }, { name: "福井県", lat: 36.07, lon: 136.22 },
  { name: "山梨県", lat: 35.66, lon: 138.57 }, { name: "長野県", lat: 36.65, lon: 138.18 },
  { name: "岐阜県", lat: 35.39, lon: 136.72 }, { name: "静岡県", lat: 34.98, lon: 138.38 },
  { name: "愛知県", lat: 35.18, lon: 136.91 }, { name: "三重県", lat: 34.73, lon: 136.51 },
  { name: "滋賀県", lat: 35.00, lon: 135.87 }, { name: "京都府", lat: 35.02, lon: 135.76 },
  { name: "大阪府", lat: 34.69, lon: 135.52 }, { name: "兵庫県", lat: 34.69, lon: 135.18 },
  { name: "奈良県", lat: 34.69, lon: 135.83 }, { name: "和歌山県", lat: 34.23, lon: 135.17 },
  { name: "鳥取県", lat: 35.50, lon: 134.24 }, { name: "島根県", lat: 35.47, lon: 133.05 },
  { name: "岡山県", lat: 34.66, lon: 133.93 }, { name: "広島県", lat: 34.40, lon: 132.46 },
  { name: "山口県", lat: 34.19, lon: 131.47 }, { name: "徳島県", lat: 34.07, lon: 134.56 },
  { name: "香川県", lat: 34.34, lon: 134.04 }, { name: "愛媛県", lat: 33.84, lon: 132.77 },
  { name: "高知県", lat: 33.56, lon: 133.53 }, { name: "福岡県", lat: 33.61, lon: 130.42 },
  { name: "佐賀県", lat: 33.25, lon: 130.30 }, { name: "長崎県", lat: 32.74, lon: 129.87 },
  { name: "熊本県", lat: 32.79, lon: 130.74 }, { name: "大分県", lat: 33.24, lon: 131.61 },
  { name: "宮崎県", lat: 31.91, lon: 131.42 }, { name: "鹿児島県", lat: 31.56, lon: 130.56 },
  { name: "沖縄県", lat: 26.21, lon: 127.68 },
];
const TOKYO = { lat: 35.69, lon: 139.69 };

// ── 黄道十二宮 ──────────────────────────────────────────
const SIGNS = [
  {
    name: "牡羊座", nameEn: "Aries", symbol: "♈", element: "火", quality: "活動",
    ruling: "火星", keyword: "始まり・勇気・先駆",
    personality: "積極的で情熱的、先駆者の精神を持つ",
    sun: "自信に満ち、挑戦を恐れない性格。目の前の壁より一歩先の可能性を見て、迷わず飛び込む行動力と直感の鋭さを併せ持つ",
    moon: "感情が爆発的で正直、怒りは速いが引きずらない。刺激と新しさを常に求め、退屈な状況が続くと感情が不安定になりやすい",
    rising: "初対面から活発でエネルギッシュな第一印象を与える。話し方も動きもスピーディーで、自然とリーダー役を任されやすい",
    mercury: "思ったことをそのまま言葉にする直截的な話し方。頭の回転が速くアイデアは次々浮かぶが、計画より先に体が動いてしまう",
    venus: "恋愛には積極的かつ情熱的に向き合い、追いかける過程そのものにときめきを感じる。手に入った瞬間に興味が薄れることもある",
    mars: "牡羊座本来の支配星である火星の力が最大限に発揮される配置。競争心が強く、一番であることに強いエネルギーを注ぐ",
    jupiter: "新しい挑戦に飛び込むほど幸運が開ける星回り。スポーツ・起業・スタートアップなど、スピード感のある分野に強い追い風が吹く",
    saturn: "衝動のままに動く癖を抑え、計画性と忍耐を身につけることが人生の課題。焦らず積み上げる力を養うほど土星の試練が実りに変わる",
    mc: "自らが先陣を切って道を切り開くキャリアで社会的評価を得る。開拓者・起業家・スポーツなど、スピードと勇気が武器になる立場が天職",
  },
  {
    name: "牡牛座", nameEn: "Taurus", symbol: "♉", element: "地", quality: "不動",
    ruling: "金星", keyword: "安定・豊かさ・感覚",
    personality: "安定を好み、感覚的な喜びを大切にする",
    sun: "忍耐強く信頼できる人柄で、美と快楽を愛し物質的な豊かさを着実に築いていく。焦らず一歩ずつ積み上げる姿勢が周囲からの厚い信頼につながる",
    moon: "安心と安定を感情の拠り所にし、変化を嫌う。食や自然に触れることで深く癒され、五感を満たす時間が心の安定剤になる",
    rising: "穏やかで落ち着いた印象を与え、初対面でも安心感を抱かせる。美的センスが際立ち、身なりや所作の丁寧さが自然と目を引く",
    mercury: "じっくり考えてから発言する実践的な思考の持ち主。一度決めたことは簡単に曲げず、地に足のついた現実的な判断を好む",
    venus: "本来の支配星である金星の恵みを受け、愛情豊かで官能的な魅力を放つ。一過性の恋より長く続く安定した愛を望む",
    mars: "粘り強く行動するが、動き出すまでに時間がかかるタイプ。一度スイッチが入ると簡単には止まらず、着実に目標へ近づいていく",
    jupiter: "財運と美的センスに関することで幸運が開花する。芸術・食・不動産など、価値あるものを見極める力が実りにつながる",
    saturn: "頑固さを手放し、変化に柔軟に適応することが人生の課題。慣れ親しんだやり方への執着を緩めるほど土星の試練が軽くなっていく",
    mc: "着実に積み上げた実績と美的センスで社会的信用を築く。金融・美容・食・不動産など、価値あるものを扱う堅実な立場で評価される",
  },
  {
    name: "双子座", nameEn: "Gemini", symbol: "♊", element: "風", quality: "柔軟",
    ruling: "水星", keyword: "知性・コミュニケーション・変化",
    personality: "知的好奇心旺盛で会話上手、適応力が高い",
    sun: "多才で機知に富み、情報の収集と発信を得意とする。好奇心の赴くまま様々な分野に手を伸ばすが、一つに絞り込むのは苦手な面も",
    moon: "感情を言葉にして処理するタイプで、気分が変わりやすい。頭で感情を分析しようとするあまり、素直な気持ちを見失うこともある",
    rising: "軽やかで話しやすい雰囲気を持ち、年齢より若々しい印象を与える。機知に富んだ会話で初対面の空気をすぐに和ませる",
    mercury: "本来の支配星である水星の力を得た、言葉の魔術師。会話・文章・交渉のいずれでも天賦の才を発揮する",
    venus: "会話の刺激と知的なやり取りを通して恋に落ちるタイプ。変化と自由を大切にし、束縛される関係には息苦しさを感じる",
    mars: "アイデア次第で動き出す行動力を持つが、エネルギーが分散しがち。複数のことを同時並行で進める器用さが強みになる",
    jupiter: "学習・旅行・執筆・メディアに関わることで幸運が開ける。新しい知識や情報との出会いがそのままチャンスに変わっていく",
    saturn: "一つのことを深め、継続する力を養うことが人生の課題。次々と興味が移る癖を抑え、一つの分野を極めるほど土星の実りが増す",
    mc: "情報と言葉を操る仕事で社会的な役割を果たす。メディア・教育・営業など、伝える力と多才さが評価されるキャリアが向く",
  },
  {
    name: "蟹座", nameEn: "Cancer", symbol: "♋", element: "水", quality: "活動",
    ruling: "月", keyword: "感情・家族・記憶",
    personality: "感受性豊かで保護本能が強い、家族思い",
    sun: "深い共感力と直感力の持ち主で、家族や故郷とのつながりを何より大切にする。身近な人を守り育てることに強い使命感を抱く",
    moon: "本来の支配星である月の影響を強く受け、感情が豊かで敏感。気分が月の満ち欠けのように波打ち、周囲の空気を敏感に察知する",
    rising: "柔らかく温かい第一印象を与え、自然と人の世話を焼いてしまう。親しみやすさから初対面でも心を開いてもらいやすい",
    mercury: "感情的な記憶力に優れ、感覚と直感で物事を捉える思考スタイル。論理よりも「感じたこと」を軸に判断する傾向がある",
    venus: "愛情深く献身的で、家庭的な幸せを恋愛の中に求める。相手を包み込むような愛し方をするが、依存にも注意が必要",
    mars: "感情そのものが行動のエンジンとなり、守るべき対象がある時に強いエネルギーを発揮する。傷つくことを恐れ慎重になる面もある",
    jupiter: "家族・不動産・食に関することで幸運が巡ってくる。故郷や母国とのつながりを大切にするほど運気が安定して開けていく",
    saturn: "過去への執着を手放し、感情的な自立を果たすことが人生の課題。守られる側から守る側へ成長する過程に土星の試練が現れる",
    mc: "人を守り育てる働きで社会的な信頼を得る。教育・福祉・飲食・不動産など、家庭的な安心感を提供する立場が天職",
  },
  {
    name: "獅子座", nameEn: "Leo", symbol: "♌", element: "火", quality: "不動",
    ruling: "太陽", keyword: "自己表現・創造・誇り",
    personality: "カリスマ的で寛大、自己表現を愛する",
    sun: "本来の支配星である太陽の力を受け、輝くことそのものが使命。創造性とリーダーシップに満ち、堂々と自分を表現する力を持つ",
    moon: "承認を求め、感情表現がドラマチックになりやすい。称賛されると喜びが倍増する一方、無視されることには人一倍傷つきやすい",
    rising: "堂々として華やかな雰囲気を持ち、部屋に入るだけで存在感を放つ。自信に満ちた振る舞いが自然と人の視線を集める",
    mercury: "情熱的で説得力のある話し方をし、物語を語ることに長けている。聞き手を惹き込む力があり、プレゼンや演説でも本領を発揮する",
    venus: "ロマンティックで情熱的な愛し方をし、特別扱いされることを大切にする。愛する相手には惜しみなく尽くす太っ腹な一面もある",
    mars: "大きな目標に向かって燃え上がるタイプで、競争の場でこそ本領を発揮する。注目される状況ほど力がみなぎってくる",
    jupiter: "創造的な表現・芸能・子どもに関することで幸運が開ける。自分らしさを堂々と表に出すほどチャンスと注目が集まってくる",
    saturn: "傲慢さを手放し、心から人を認めることが人生の課題。自分だけでなく他者の輝きも称える謙虚さが土星の試練を和らげる",
    mc: "表舞台で自分を表現することで社会的地位を築く。経営者・芸能・クリエイティブなど、輝きと存在感が評価されるキャリアが向く",
  },
  {
    name: "乙女座", nameEn: "Virgo", symbol: "♍", element: "地", quality: "柔軟",
    ruling: "水星", keyword: "分析・奉仕・完璧",
    personality: "分析的で勤勉、細部への配慮が際立つ",
    sun: "几帳面で誠実な性格で、実用的な知性と奉仕の精神を兼ね備える。細部への配慮を怠らず、地道な努力を惜しまない",
    moon: "不安を整理・分析することで対処しようとする。秩序立った環境が心の安定をもたらし、混沌とした状況には強いストレスを感じる",
    rising: "清潔感があり知的な印象を与え、礼儀正しく控えめながらも実は有能。細やかな気配りがじわじわと信頼を積み重ねていく",
    mercury: "本来の支配星である水星の力を強く受け継ぐ、分析的・批判的思考の達人。物事の欠点や改善点を見抜く目が鋭い",
    venus: "丁寧に愛情を表現するタイプで、相手への細かい気配りこそが愛の証。派手さはないが実務的なサポートで愛を示す",
    mars: "完璧な準備をしてから行動に移す慎重派で、細かい作業への集中力が高い。準備不足の状態で動くことに強い抵抗を感じる",
    jupiter: "医療・健康・分析・農業に関することで幸運が開ける。地道な改善を積み重ねるほど目に見える成果として実っていく",
    saturn: "自己批判を手放し、不完全な自分を受け入れることが人生の課題。完璧を求めすぎる癖を緩めるほど土星の重さが軽くなっていく",
    mc: "緻密な分析と奉仕の姿勢で社会的信頼を積み上げる。医療・品質管理・秘書・研究など、正確さと誠実さが評価される立場が天職",
  },
  {
    name: "天秤座", nameEn: "Libra", symbol: "♎", element: "風", quality: "活動",
    ruling: "金星", keyword: "調和・公正・美",
    personality: "調和を愛し、美的センスと外交力に優れる",
    sun: "公平で外交的な性格を持ち、美と調和を人生の中心に据える。誰に対してもバランスよく接するが、決断には時間がかかりがち",
    moon: "感情のバランスを常に保とうとし、不調和な状況が最大のストレスになる。争いを避け、周囲との調和を優先しすぎる傾向がある",
    rising: "魅力的で洗練された印象を与え、誰とでも上手く付き合える社交的な雰囲気を持つ。初対面から自然な心地よさを感じさせる",
    mercury: "バランスの取れた判断力を持ち、物事の両面を見て考える。公平であろうとするあまり決断そのものに時間がかかることも",
    venus: "本来の支配星である金星の力を受け、美しいものと調和ある関係を心から愛する。争いのない穏やかな恋愛関係を望む",
    mars: "穏やかに行動するタイプだが、不公正な扱いには毅然と立ち向かう。争いは好まないが正義のためなら粘り強く動く",
    jupiter: "対人関係・法律・芸術・パートナーシップに関することで幸運が開ける。良縁との出会いがそのまま運気の追い風になる",
    saturn: "他者に依存せず、自分自身の意見を持つことが人生の課題。相手に合わせすぎる癖を手放すほど土星の試練が実りに変わる",
    mc: "調和とバランス感覚を活かして社会的地位を築く。法律・外交・デザイン・接客など、公正さと美意識が評価されるキャリアが向く",
  },
  {
    name: "蠍座", nameEn: "Scorpio", symbol: "♏", element: "水", quality: "不動",
    ruling: "冥王星", keyword: "変容・深み・力",
    personality: "深い洞察力と強い意志、変容を司る",
    sun: "強烈な集中力と直感を持ち、物事の本質を見抜く力に長ける。秘密を守り、深く愛し、時に人生そのものを作り変える力を秘める",
    moon: "感情が深く強烈で、一度心を許した相手には一途に向き合う。傷つくことへの恐れから、本音を隠す秘密主義になりやすい",
    rising: "神秘的で強い眼差しを持ち、近寄りがたくも人を引きつける存在感がある。多くを語らずとも佇まいだけで印象に残る",
    mercury: "鋭い洞察力と心理的な直感を併せ持ち、相手の隠された本音を見抜く能力に長ける。表面的な会話には満足できない性質",
    venus: "深い一体感を求める愛し方をし、嫉妬心も人一倍強い。一度愛すると決めた相手には揺るがない一途さで向き合う",
    mars: "蠍座の伝統的な支配星である火星の力を受け継ぐ、情熱的で持続力のあるエネルギー。一度狙いを定めた目標への執念が強い",
    jupiter: "変容・心理・遺産・秘密事に関することで幸運が開ける。表面的な変化ではなく本質から生まれ変わる経験が運気を押し上げる",
    saturn: "コントロールしたいという欲求を手放し、他者を信頼することが人生の課題。手放す勇気を持つほど土星の重さが和らいでいく",
    mc: "深い集中力と洞察力で社会的な信頼と影響力を築く。研究・心理・投資・医療など、本質を見抜く力が評価される立場が天職",
  },
  {
    name: "射手座", nameEn: "Sagittarius", symbol: "♐", element: "火", quality: "柔軟",
    ruling: "木星", keyword: "自由・冒険・哲学",
    personality: "自由と冒険を愛し、楽観的な哲学者",
    sun: "大らかで楽観的な性格を持ち、真理を求めて旅をする哲学者気質。知恵を広め、人生をより広い視野で捉えようとする使命を持つ",
    moon: "感情を前向きに捉える楽観的な傾向があるが、自由を制限されると途端に情緒が不安定になる。広い場所と自由な時間が心の栄養になる",
    rising: "率直で明るく、冒険好きな第一印象を与える。異文化や新しい価値観への開放性があり、話していて視野が広がる感覚を与える",
    mercury: "全体像を掴む大局的な思考の持ち主で、細部よりも本質を語ることを好む。哲学的で示唆に富んだ言葉選びが特徴的",
    venus: "自由を共有できる旅仲間のような関係を愛する。束縛される恋愛は苦手で、互いの自立を尊重できる相手にこそ強く惹かれる",
    mars: "理想と信念のために戦う情熱を持ち、長距離を走り続けるような持久力のあるエネルギーを発揮する。目先の壁より遠くの目標を見る",
    jupiter: "本来の支配星である木星の力を最大限に受け、旅・教育・宗教・海外に関することで幸運が最大化される。視野を広げるほど運気が開く",
    saturn: "一つの場所や関係に根を張ることが人生の課題。自由を求めすぎる心を少し落ち着け、地に足をつけるほど土星の試練が和らぐ",
    mc: "広い視野と学びへの情熱で社会的な地位を築く。教育・出版・海外事業・旅行など、自由と拡大が評価されるキャリアが向く",
  },
  {
    name: "山羊座", nameEn: "Capricorn", symbol: "♑", element: "地", quality: "活動",
    ruling: "土星", keyword: "野心・規律・達成",
    personality: "責任感が強く、野心的で現実的な達成者",
    sun: "忍耐と野心を武器に、着実に山を登り続ける努力家。社会的地位と実績を一段ずつ積み上げ、長い時間をかけて頂点を目指す",
    moon: "感情を抑制し、実用的に対処しようとする傾向がある。弱みを見せることに強い抵抗を感じ、一人で抱え込みやすい性質を持つ",
    rising: "落ち着いて信頼できる雰囲気を持ち、若い頃は大人びて見えるが歳を重ねるほど若々しさが増していく。責任感の強さが滲み出る印象",
    mercury: "論理的で実用的な思考の持ち主で、長期的な計画と戦略立案を得意とする。感情論より現実的な数字と根拠を重視する",
    venus: "安定した関係を好み、愛情表現は地味だが誠実で長く続く。派手なアプローチより時間をかけて信頼を積み上げる恋愛を望む",
    mars: "粘り強く着実に行動するタイプで、ゆっくりでも確実に目標へたどり着く。派手さはないが途中で投げ出さない持久力がある",
    jupiter: "キャリア・社会的地位・組織・伝統に関することで幸運が開ける。地道な頑張りが周囲に認められ、責任ある立場を任されやすい",
    saturn: "本来の支配星である土星の力を受け継ぐ、完璧を追い求めすぎず休むことが人生の課題。頑張りすぎる癖を緩めるほど実りが増していく",
    mc: "本来の支配星座。責任と忍耐で長期的な社会的地位を築き上げる、組織のトップやマネジメントに最適な、キャリア形成そのものを象徴する配置",
  },
  {
    name: "水瓶座", nameEn: "Aquarius", symbol: "♒", element: "風", quality: "不動",
    ruling: "天王星", keyword: "革新・人道・独自性",
    personality: "独創的で人道的、未来を見据える革新者",
    sun: "前衛的で独自の視点を持ち、集団や社会全体の自由のために力を尽くす。常識にとらわれず未来を見据えた発想で道を切り開く",
    moon: "感情を客観的に分析しようとする傾向があり、人類全体への愛と個人への親密さの間で葛藤を抱えやすい。距離感を大切にする性質",
    rising: "ユニークで親しみやすい第一印象を与え、友人が自然と多く集まる。グループの中心的な存在になりやすい社交性を持つ",
    mercury: "革新的な思考の持ち主で、常識を疑い未来志向の発想をする。既存の枠組みにとらわれない自由な発想力が武器になる",
    venus: "まず友人関係から始まる恋愛を好み、精神的なつながりを何より重視する。束縛のない対等な関係性を築ける相手に惹かれる",
    mars: "集団のため、あるいは理想のために行動するタイプで、反骨心が原動力になる。不公正な体制への抵抗が強いエネルギーを生む",
    jupiter: "友人・グループ・テクノロジー・社会変革に関することで幸運が開ける。新しいコミュニティとの出会いが運気を大きく広げる",
    saturn: "感情的なつながりを深め、孤立を避けることが人生の課題。頭で割り切りすぎず心でも人とつながる努力が土星の試練を和らげる",
    mc: "独自の発想と革新性で社会的な役割を果たす。IT・社会運動・研究・グループ活動など、未来志向のビジョンが評価されるキャリアが向く",
  },
  {
    name: "魚座", nameEn: "Pisces", symbol: "♓", element: "水", quality: "柔軟",
    ruling: "海王星", keyword: "直感・慈悲・夢",
    personality: "感受性豊かで霊的、慈悲と共感の塊",
    sun: "境界が溶けるような深い共感力を持ち、芸術・夢・スピリチュアルな世界と強く繋がる。他者の痛みを自分のことのように感じ取る",
    moon: "感情が海のように広大で、他人の痛みや喜びを自分のことのように感じてしまう。繊細すぎるがゆえに時に感情に飲み込まれやすい",
    rising: "柔らかく夢見がちな印象を与え、神秘的で詩的な雰囲気を漂わせる。初対面でもどこか懐かしいような親しみを感じさせる",
    mercury: "直感と象徴で思考するタイプで、論理よりも詩や比喩を使った表現を好む。言葉にしにくい感覚をイメージで伝えるのが得意",
    venus: "理想の愛を夢見るロマンチストで、魂レベルの繋がりを恋愛に求める。現実離れした理想を追い求めすぎる面には注意が必要",
    mars: "霊感と直感で行動するタイプで、明確な目標よりも感じるままに動くことを好む。理屈より心が動いた方向に自然と進んでいく",
    jupiter: "芸術・音楽・スピリチュアル・慈善活動に関することで幸運が開ける。感性を素直に表現するほど思いがけない幸運に恵まれる",
    saturn: "現実的な境界線を持ち、自分自身を守ることが人生の課題。他人の感情に飲み込まれすぎない距離感を身につけるほど土星の試練が軽くなる",
    mc: "共感力と創造性を活かして社会的な信頼を築く。芸術・医療・スピリチュアル・福祉など、慈悲深さと感性が評価される立場が天職",
  },
];

// ── 天体計算 ──────────────────────────────────────────────
export function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 太陽の真黄経（Jean Meeus式）— 楕円軌道補正込みで誤差±0.01°
export function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T;
  const M  = (357.52911 + 35999.05029 * T) * Math.PI / 180;
  const C  = (1.9146 - 0.004817 * T) * Math.sin(M)
           + 0.019993 * Math.sin(2 * M)
           + 0.00029  * Math.sin(3 * M);
  return ((L0 + C) % 360 + 360) % 360;
}

// 月の黄経（主要摂動項込み）— 誤差±0.3°
export function getMoonLongitude(jd: number): number {
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

// ── 惑星の地心黄経（JPL近似ケプラー軌道要素・西暦1800〜2050で誤差1°未満）──
// [a, ȧ, e, ė, I, İ, L, L̇, ϖ(近日点黄経), ϖ̇, Ω(昇交点黄経), Ω̇]　角度は度、時間はユリウス世紀
const JPL: Record<string, number[]> = {
  mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
  venus:   [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
  earth:   [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0],
  mars:    [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
  jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
  saturn:  [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794],
  uranus:  [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589],
  neptune: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
  pluto:   [39.48211675, -0.00031596, 0.24882730, 0.00005170, 17.14001206, 0.00004818, 238.92903833, 145.20780515, 224.06891629, -0.04062942, 110.30393684, -0.01183482],
};

const D2R = Math.PI / 180;

// ある軌道要素セットの日心黄道直交座標（au）を返す
function heliocentric(el: number[], T: number): { x: number; y: number } {
  const a = el[0] + el[1] * T;
  const e = el[2] + el[3] * T;
  const I = (el[4] + el[5] * T) * D2R;
  const L = el[6] + el[7] * T;
  const peri = el[8] + el[9] * T;
  const node = el[10] + el[11] * T;
  const omega = (peri - node) * D2R; // 近点引数
  const Omega = node * D2R;
  let M = (((L - peri) % 360) + 540) % 360 - 180; // 平均近点角 -180..180
  M *= D2R;
  // ケプラー方程式を反復で解く
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-9) break;
  }
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cO = Math.cos(Omega), sO = Math.sin(Omega);
  const cw = Math.cos(omega), sw = Math.sin(omega);
  const cI = Math.cos(I), sI = Math.sin(I);
  return {
    x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
  };
}

// 惑星の地心黄経（度・0〜360）
export function getPlanetLongitude(jd: number, planet: string): number {
  const T = (jd - 2451545.0) / 36525;
  const p = heliocentric(JPL[planet], T);
  const earth = heliocentric(JPL.earth, T);
  const lon = Math.atan2(p.y - earth.y, p.x - earth.x) / D2R;
  return ((lon % 360) + 360) % 360;
}

function getSignIndex(jd: number, planet: string): number {
  if (planet === "sun")  return Math.floor(getSunLongitude(jd) / 30);
  if (planet === "moon") return Math.floor(getMoonLongitude(jd) / 30);
  return Math.floor(getPlanetLongitude(jd, planet) / 30);
}

// 地方恒星時（RAMC・度）。julianDayは正午基準JDNなので0.5引いて出生時刻を加える
// lon: 東経(度)。日本標準時(JST=UT+9)で入力された時刻を、出生地の実経度で恒星時に変換する
function localSiderealDeg(jd: number, birthHourJST: number, lon: number = TOKYO.lon): number {
  const utcHour = birthHourJST - 9;
  const jdBirth = jd - 0.5 + utcHour / 24;
  const dB = jdBirth - 2451545.0;
  const gmst = ((280.46061837 + 360.98564736629 * dB) % 360 + 360) % 360;
  return ((gmst + lon) % 360 + 360) % 360;
}

// 上昇点（アセンダント）の黄経（度）。lat: 北緯, lon: 東経, birthHourJST: 出生時間(JST)
export function getAscendantLongitude(jd: number, birthHourJST: number, lat: number = TOKYO.lat, lon: number = TOKYO.lon): number {
  const eps = 23.4393 * D2R;
  const latRad = lat * D2R;
  const ramcRad = localSiderealDeg(jd, birthHourJST, lon) * D2R;
  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  // atan2の式は下降点(DSC)を与えるため+180°して上昇点(ASC)にする
  let asc = Math.atan2(y, x) / D2R + 180;
  return ((asc % 360) + 360) % 360;
}

// 上昇星座（アセンダント）。lat: 北緯, lon: 東経, birthHourJST: 出生時間(JST)
function getAscendantIndex(jd: number, birthHourJST: number, lat: number = TOKYO.lat, lon: number = TOKYO.lon): number {
  return Math.floor(getAscendantLongitude(jd, birthHourJST, lat, lon) / 30);
}

// MC（中天）の黄経（度）。RAMCを黄経に変換して算出
export function getMCLongitude(jd: number, birthHourJST: number, lon: number = TOKYO.lon): number {
  const eps = 23.4393 * D2R;
  const ramcRad = localSiderealDeg(jd, birthHourJST, lon) * D2R;
  let mc = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) / D2R;
  if (mc < 0) mc += 360;
  return mc;
}

function getMCIndex(jd: number, birthHourJST: number, lon: number = TOKYO.lon): number {
  return Math.floor(getMCLongitude(jd, birthHourJST, lon) / 30);
}

// 今日の通過天体（簡易トランジット）
function getTransitSign(planet: string): number {
  const now = new Date();
  const jdNow = julianDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return getSignIndex(jdNow, planet);
}

// 今年の星座別テーマ（木星トランジットで決まる大まかな流れ）
const YEARLY_THEMES: Record<string, string> = {
  牡羊座: "木星が牡羊座を巡るこの一年は、自己改革と新しいスタートに恵まれる時期です。今のあなた自身の在り方や行動パターンに焦点が当たり、思い切った挑戦がそのまま追い風になります。新しい自分を試すなら今が好機です。",
  牡牛座: "木星が牡牛座を巡るこの一年は、財運と価値観を見つめ直す時期です。お金の使い方や持ち物との向き合い方を通じて、自分にとって本当に大切なものへの気づきが深まります。地に足のついた豊かさが育まれる一年です。",
  双子座: "木星が双子座を巡るこの一年は、コミュニケーションと学びの運気が大きく開花する時期です。新しい知識や人脈との出会いが増え、発信したことが思わぬ形で広がっていきます。好奇心の赴くまま動くほど幸運が広がります。",
  蟹座: "木星が蟹座を巡るこの一年は、家族や住まい、心の拠り所となる感情的なルーツと深く向き合う時期です。身近な人との絆を見つめ直すことで、安心できる居場所づくりの運気が大きく高まっていきます。",
  獅子座: "木星が獅子座を巡るこの一年は、創造性と恋愛、そして自己表現に強い光が当たる時期です。自分らしさを堂々と表に出すほど注目とチャンスが集まり、趣味や子どもに関わることからも幸運の芽が育っていきます。",
  乙女座: "木星が乙女座を巡るこの一年は、健康管理や日々のルーティン、仕事の質を高めることに意識が向く時期です。地道な改善の積み重ねが目に見える成果として現れやすく、丁寧に整えるほど運気が安定していきます。",
  天秤座: "木星が天秤座を巡るこの一年は、パートナーシップと対人関係が大きく広がる時期です。結婚や契約などの縁が動きやすく、公正なバランス感覚を大切にするほど、人間関係を通じた幸運が舞い込んできます。",
  蠍座: "木星が蠍座を巡るこの一年は、変容と深い繋がりを通じて大きく成長する時期です。遺産や共有財産、心理的な結びつきに関わるテーマが動きやすく、表面的な変化ではなく本質からの生まれ変わりが期待できます。",
  射手座: "木星が本来の支配星座である射手座を巡るこの一年は、旅・学習・哲学・海外との縁が大きく広がる、最も幸運の強まる時期です。視野を広げる挑戦をするほど、人生を変えるような出会いや発見に恵まれます。",
  山羊座: "木星が山羊座を巡るこの一年は、キャリアと社会的地位が着実に上昇する時期です。これまで積み重ねてきた努力が周囲に認められ、責任ある立場を任されるなど、地道な頑張りが確かな形で実っていきます。",
  水瓶座: "木星が水瓶座を巡るこの一年は、友人やグループ活動、未来へのビジョンが大きく拡大する時期です。新しいコミュニティとの出会いや独自のアイデアを発信する場が広がり、仲間との協力が幸運を呼び込みます。",
  魚座: "木星が魚座を巡るこの一年は、スピリチュアルな深化と内省が進む癒しの時期です。目に見える成果よりも、心の奥にある感受性や直感を大切にすることで、静かながらも深い幸福感に満たされていきます。",
};

// ── メイン関数 ──────────────────────────────────────────
// ── 2区分・3区分・4元素の説明 ──
const ELEMENT_DESC: Record<string, string> = {
  "火": "火（牡羊・獅子・射手）── 情熱・直感・行動の元素。エネルギッシュで自発的、思い立ったら動くタイプ",
  "地": "地（牡牛・乙女・山羊）── 現実・安定・五感の元素。着実で実用的、目に見える成果を大切にするタイプ",
  "風": "風（双子・天秤・水瓶）── 知性・伝達・社交の元素。思考と人とのつながりで動く、軽やかで客観的なタイプ",
  "水": "水（蟹・蠍・魚）── 感情・共感・直感の元素。情緒が豊かで、深いつながりと心の機微を大切にするタイプ",
};
const QUALITY_DESC: Record<string, string> = {
  "活動": "活動宮（牡羊・蟹・天秤・山羊）── 物事を始める力。開拓者・リーダー型で、自分から動いて状況を作る",
  "不動": "不動宮（牡牛・獅子・蠍・水瓶）── 続ける・守る力。粘り強く一貫していて、決めたことを最後までやり抜く",
  "柔軟": "柔軟宮（双子・乙女・射手・魚）── 適応・変化の力。柔軟で多才、状況に合わせて自在に形を変える",
};
function polarityOf(element: string): string {
  return element === "火" || element === "風" ? "陽（能動）" : "陰（受容）";
}
const POLARITY_DESC: Record<string, string> = {
  "陽（能動）": "陽（火・風）── 外向き・発信型。自分から働きかけ、表に出ていくことでエネルギーが湧く",
  "陰（受容）": "陰（地・水）── 内向き・受容型。じっくり受け止め、内側で育てることで力を発揮する",
};
// 総合タイプ合成用の短い特徴
const ELEMENT_TYPE: Record<string, string> = { "火": "情熱と行動で道を切り開き", "地": "現実的に着実に積み上げ", "風": "知性と人付き合いで軽やかに動き", "水": "感情と直感で深くつながり" };
const QUALITY_TYPE: Record<string, string> = { "活動": "自分から動いて状況を起こし", "不動": "粘り強く一つのことをやり抜き", "柔軟": "状況に合わせて柔軟に立ち回り" };
const POLARITY_TYPE: Record<string, string> = { "陽（能動）": "外へ発信していく能動型", "陰（受容）": "内で受け止めて育てる受容型" };

// ── ハウス（イコール・ハウス方式：アセンダントから30°ずつ12分割）──
const HOUSE_THEME = [
  "自己・第一印象", "金銭・所有・価値観", "コミュニケーション・近い人間関係", "家庭・ルーツ",
  "恋愛・創造・子ども", "仕事・健康・日常", "パートナーシップ・結婚", "変容・共有財産",
  "哲学・海外・学び", "キャリア・社会的地位", "友人・グループ・理想", "潜在意識・スピリチュアル",
];
const HOUSE_DESC = [
  "第1ハウス（自己・第一印象）── その人自身の存在感や第一印象、人生に踏み出す姿勢を象徴する領域",
  "第2ハウス（金銭・所有・価値観）── お金の稼ぎ方や物への執着、自分にとっての価値基準を表す領域",
  "第3ハウス（コミュニケーション・近い人間関係）── 日常の会話や情報のやり取り、兄弟姉妹との関係を象徴する領域",
  "第4ハウス（家庭・ルーツ）── 生まれ育った環境や家族との関係、心の拠り所を表す領域",
  "第5ハウス（恋愛・創造・子ども）── 自己表現や恋愛、趣味や子どもとの関わりを象徴する領域",
  "第6ハウス（仕事・健康・日常）── 日々のルーティンや心身の健康管理、奉仕的な労働を表す領域",
  "第7ハウス（パートナーシップ・結婚）── 結婚や契約などの一対一の関係、公私のパートナーを象徴する領域",
  "第8ハウス（変容・共有財産）── 遺産や他者と共有するお金、深い心理的な変容を表す領域",
  "第9ハウス（哲学・海外・学び）── 海外や高等教育、人生観を広げる旅や学びを象徴する領域",
  "第10ハウス（キャリア・社会的地位）── 仕事上の評価や社会的な立場、人生の到達点を表す領域",
  "第11ハウス（友人・グループ・理想）── コミュニティや仲間との繋がり、将来の夢や希望を象徴する領域",
  "第12ハウス（潜在意識・スピリチュアル）── 見えない領域や内省、これまでの人生の集大成を表す領域",
];
// イコール・ハウス方式でのハウス番号（1〜12）。アセンダントの黄経が分かっている場合のみ算出できる
function houseNumberOf(lon: number, ascLon: number): number {
  return Math.floor((((lon - ascLon) % 360) + 360) % 360 / 30) + 1;
}

export function getAstrologyReading(birthday: string, birthHour?: number, lat: number = TOKYO.lat, lon: number = TOKYO.lon): FortuneResult {
  const [yearStr, monthStr, dayStr] = birthday.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const jd = julianDay(year, month, day);

  // 出生天体（黄経）
  const sunLon = getSunLongitude(jd);
  const moonLon = getMoonLongitude(jd);
  const mercuryLon = getPlanetLongitude(jd, "mercury");
  const venusLon = getPlanetLongitude(jd, "venus");
  const marsLon = getPlanetLongitude(jd, "mars");
  const jupiterLon = getPlanetLongitude(jd, "jupiter");
  const saturnLon = getPlanetLongitude(jd, "saturn");
  const uranusLon = getPlanetLongitude(jd, "uranus");
  const neptuneLon = getPlanetLongitude(jd, "neptune");
  const plutoLon = getPlanetLongitude(jd, "pluto");

  const sunIdx = Math.floor(sunLon / 30);
  const moonIdx = Math.floor(moonLon / 30);
  const mercuryIdx = Math.floor(mercuryLon / 30);
  const venusIdx = Math.floor(venusLon / 30);
  const marsIdx = Math.floor(marsLon / 30);
  const jupiterIdx = Math.floor(jupiterLon / 30);
  const saturnIdx = Math.floor(saturnLon / 30);
  const uranusIdx = Math.floor(uranusLon / 30);
  const neptuneIdx = Math.floor(neptuneLon / 30);
  const plutoIdx = Math.floor(plutoLon / 30);

  const sunSign = SIGNS[sunIdx];
  const moonSign = SIGNS[moonIdx];
  const mercurySign = SIGNS[mercuryIdx];
  const venusSign = SIGNS[venusIdx];
  const marsSign = SIGNS[marsIdx];
  const jupiterSign = SIGNS[jupiterIdx];
  const saturnSign = SIGNS[saturnIdx];
  const uranusSign = SIGNS[uranusIdx];
  const neptuneSign = SIGNS[neptuneIdx];
  const plutoSign = SIGNS[plutoIdx];

  // 現在のトランジット
  const transitJupiterSign = SIGNS[getTransitSign("jupiter")];
  const yearlyTheme = YEARLY_THEMES[transitJupiterSign.name] || "";

  const hasTime = typeof birthHour === "number";
  const ascLonExact = hasTime ? getAscendantLongitude(jd, birthHour!, lat, lon) : null;
  const ascIdx = ascLonExact !== null ? Math.floor(ascLonExact / 30) : null;
  const mcIdx = hasTime ? getMCIndex(jd, birthHour!, lon) : null;
  const ascSign = ascIdx !== null ? SIGNS[ascIdx] : null;
  const mcSign = mcIdx !== null ? SIGNS[mcIdx] : null;

  // イコール・ハウス方式のハウス番号（アセンダントが分かる場合のみ）
  const houseOf = (lon: number): number | null => (ascLonExact !== null ? houseNumberOf(lon, ascLonExact) : null);
  const sunHouse = houseOf(sunLon);
  const moonHouse = houseOf(moonLon);
  const mercuryHouse = houseOf(mercuryLon);
  const venusHouse = houseOf(venusLon);
  const marsHouse = houseOf(marsLon);
  const jupiterHouse = houseOf(jupiterLon);
  const saturnHouse = houseOf(saturnLon);
  const uranusHouse = houseOf(uranusLon);
  const neptuneHouse = houseOf(neptuneLon);
  const plutoHouse = houseOf(plutoLon);
  const houseTag = (h: number | null) => (h !== null ? `（第${h}ハウス：${HOUSE_THEME[h - 1]}）` : "");

  // ── 全天体から総合分類（太陽・月・水星・金星・火星・木星・土星＋上昇）──
  const chartBodies = [sunSign, moonSign, mercurySign, venusSign, marsSign, jupiterSign, saturnSign, ...(ascSign ? [ascSign] : [])];
  const tally = (key: "element" | "quality", order: string[]) => {
    const c: Record<string, number> = {};
    order.forEach((k) => (c[k] = 0));
    chartBodies.forEach((s) => { c[(s as Record<string, string>)[key]]++; });
    return c;
  };
  const elemOrder = ["火", "地", "風", "水"];
  const qualOrder = ["活動", "不動", "柔軟"];
  const elemCount = tally("element", elemOrder);
  const qualCount = tally("quality", qualOrder);
  const polCount: Record<string, number> = { "陽（能動）": 0, "陰（受容）": 0 };
  chartBodies.forEach((s) => { polCount[polarityOf(s.element)]++; });

  const top = (count: Record<string, number>, order: string[]) => {
    const mx = Math.max(...order.map((k) => count[k]));
    return order.filter((k) => count[k] === mx);
  };
  const domElem = top(elemCount, elemOrder)[0];
  const domQual = top(qualCount, qualOrder)[0];
  const domPol = top(polCount, ["陽（能動）", "陰（受容）"])[0];
  const missing = elemOrder.filter((e) => elemCount[e] === 0);

  const elemLine = elemOrder.map((e) => `${e}${elemCount[e]}`).join("　");
  const qualLine = qualOrder.map((q) => `${q}${qualCount[q]}`).join("　");
  const polLine = `陽${polCount["陽（能動）"]}　陰${polCount["陰（受容）"]}`;

  const overallType =
    `${chartBodies.length}天体（太陽・月・水星・金星・火星・木星・土星${ascSign ? "・上昇" : ""}）の傾向：\n` +
    `元素　${elemLine}\n3区分　${qualLine}\n2区分　${polLine}\n\n` +
    `► あなたは【${domElem}優位 × ${domQual}宮寄り × ${domPol === "陽（能動）" ? "陽・能動" : "陰・受容"}】タイプ。\n` +
    `${ELEMENT_TYPE[domElem]}、${QUALITY_TYPE[domQual]}、${POLARITY_TYPE[domPol]}——そんな人です。` +
    (missing.length ? `\n\n※「${missing.join("・")}」の天体は無し。その質は意識して補うと吉。` : "");

  const details = [
    {
      label: "☀️ 太陽星座（アイデンティティ・使命）",
      content: `${sunSign.symbol} ${sunSign.name}${houseTag(sunHouse)} ── ${sunSign.sun}`,
    },
    {
      label: "🌙 月星座（感情・本能・内なる自己）",
      content: `${moonSign.symbol} ${moonSign.name}${houseTag(moonHouse)} ── ${moonSign.moon}`,
    },
    ...(ascSign
      ? [{ label: "⬆️ 上昇星座・アセンダント（第一印象・外的人格）", content: `${ascSign.symbol} ${ascSign.name} ── ${ascSign.rising}` }]
      : [{ label: "⬆️ 上昇星座", content: "生まれた時間を入力するとアセンダントを算出できます" }]),
    ...(mcSign
      ? [{ label: "🏆 MC・中天（社会的使命・キャリア）", content: `${mcSign.symbol} ${mcSign.name} ── ${mcSign.mc}` }]
      : []),
    {
      label: "☿ 水星星座（思考・コミュニケーション）",
      content: `${mercurySign.symbol} ${mercurySign.name}${houseTag(mercuryHouse)} ── ${mercurySign.mercury}`,
    },
    {
      label: "♀ 金星星座（愛・美・価値観）",
      content: `${venusSign.symbol} ${venusSign.name}${houseTag(venusHouse)} ── ${venusSign.venus}`,
    },
    {
      label: "♂ 火星星座（行動力・情熱・欲求）",
      content: `${marsSign.symbol} ${marsSign.name}${houseTag(marsHouse)} ── ${marsSign.mars}`,
    },
    {
      label: "♃ 木星星座（拡大・幸運・哲学）",
      content: `${jupiterSign.symbol} ${jupiterSign.name}${houseTag(jupiterHouse)} ── ${jupiterSign.jupiter}`,
    },
    {
      label: "♄ 土星星座（課題・カルマ・成長）",
      content: `${saturnSign.symbol} ${saturnSign.name}${houseTag(saturnHouse)} ── ${saturnSign.saturn}`,
    },
    {
      label: "♅ 天王星星座（変革・個性・世代）",
      content: `${uranusSign.symbol} ${uranusSign.name}${houseTag(uranusHouse)} ── 「${uranusSign.keyword}」の革新を、同世代と共有するテーマとして持つ`,
    },
    {
      label: "♆ 海王星星座（夢・感性・世代）",
      content: `${neptuneSign.symbol} ${neptuneSign.name}${houseTag(neptuneHouse)} ── 「${neptuneSign.keyword}」に理想や夢を重ねる感性を、世代として帯びる`,
    },
    {
      label: "♇ 冥王星星座（変容・深層・世代）",
      content: `${plutoSign.symbol} ${plutoSign.name}${houseTag(plutoHouse)} ── 「${plutoSign.keyword}」の領域で深い変容と再生を促す、世代的な力`,
    },
    {
      label: "🔮 総合タイプ（全天体から見たあなた）",
      content: overallType,
    },
    {
      label: "📖 各分類の意味",
      content: `${ELEMENT_DESC[domElem]}\n${QUALITY_DESC[domQual]}\n${POLARITY_DESC[domPol]}`,
    },
    ...(ascLonExact !== null
      ? [{ label: "🏠 ハウスの意味（人生の12の領域）", content: HOUSE_DESC.join("\n") }]
      : [{ label: "🏠 ハウスの意味", content: "生まれた時間を入力すると、各天体がどの人生の領域（ハウス）で働くかも算出できます" }]),
    {
      label: "📅 今年の木星テーマ",
      content: yearlyTheme,
    },
  ];

  const threeSign = ascSign
    ? `太陽：${sunSign.name} / 月：${moonSign.name} / 上昇：${ascSign.name}`
    : `太陽：${sunSign.name} / 月：${moonSign.name}`;

  const chartWheel: ChartWheelData = {
    planets: [
      { key: "sun", label: "太陽", symbol: "☉", longitude: sunLon },
      { key: "moon", label: "月", symbol: "☽", longitude: moonLon },
      { key: "mercury", label: "水星", symbol: "☿", longitude: mercuryLon },
      { key: "venus", label: "金星", symbol: "♀", longitude: venusLon },
      { key: "mars", label: "火星", symbol: "♂", longitude: marsLon },
      { key: "jupiter", label: "木星", symbol: "♃", longitude: jupiterLon },
      { key: "saturn", label: "土星", symbol: "♄", longitude: saturnLon },
      { key: "uranus", label: "天王星", symbol: "♅", longitude: uranusLon },
      { key: "neptune", label: "海王星", symbol: "♆", longitude: neptuneLon },
      { key: "pluto", label: "冥王星", symbol: "♇", longitude: plutoLon },
    ],
    ascendant: ascLonExact !== null ? ascLonExact : undefined,
    mc: hasTime ? getMCLongitude(jd, birthHour!, lon) : undefined,
  };

  return {
    title: `${sunSign.symbol} ${sunSign.name}のホロスコープ`,
    summary: threeSign,
    details,
    lucky: {
      color: sunSign.name === "牡羊座" ? "赤" : sunSign.name === "牡牛座" ? "緑" : sunSign.name === "双子座" ? "黄" : sunSign.name === "蟹座" ? "白" : sunSign.name === "獅子座" ? "金" : sunSign.name === "乙女座" ? "茶" : sunSign.name === "天秤座" ? "ピンク" : sunSign.name === "蠍座" ? "深紅" : sunSign.name === "射手座" ? "紫" : sunSign.name === "山羊座" ? "黒" : sunSign.name === "水瓶座" ? "水色" : "海の青",
      item: `${sunSign.ruling}のお守り`,
    },
    chartWheel,
    advice: `太陽が${sunSign.name}、月が${moonSign.name}のあなた。${sunSign.keyword}を軸に、${moonSign.moon.split("。")[0]}という感情パターンを持つ複雑で豊かな内面があります。${saturnSign.saturn}`,
  };
}
