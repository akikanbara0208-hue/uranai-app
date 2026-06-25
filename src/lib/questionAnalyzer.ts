export type QuestionTheme = "love" | "work" | "money" | "health" | "family" | "study" | "travel" | "general";

const THEME_KEYWORDS: { theme: QuestionTheme; words: string[] }[] = [
  {
    theme: "love",
    words: ["恋", "愛", "好き", "彼氏", "彼女", "パートナー", "結婚", "告白", "片思い", "両思い",
            "出会い", "婚活", "デート", "関係", "気持ち", "好かれ", "モテ", "縁", "運命の人",
            "ソウルメイト", "別れ", "復縁", "浮気", "不倫", "sex", "セックス"],
  },
  {
    theme: "work",
    words: ["仕事", "職場", "転職", "就職", "キャリア", "昇進", "起業", "副業", "会社", "上司",
            "部下", "同僚", "プロジェクト", "残業", "給料", "評価", "ビジネス", "フリーランス",
            "独立", "退職", "クビ", "職種", "業種", "転勤", "採用", "面接"],
  },
  {
    theme: "money",
    words: ["お金", "金銭", "財布", "収入", "貯金", "投資", "株", "節約", "借金", "ローン",
            "資産", "財産", "副収入", "稼ぎ", "金運", "宝くじ", "ギャンブル", "負債", "経済",
            "豊か", "貧乏"],
  },
  {
    theme: "health",
    words: ["健康", "体調", "病気", "怪我", "ダイエット", "痩せ", "太り", "メンタル", "うつ",
            "不眠", "疲れ", "疲労", "ストレス", "心身", "治療", "手術", "入院", "医者", "薬",
            "運動", "食事", "アレルギー"],
  },
  {
    theme: "family",
    words: ["家族", "親", "母", "父", "兄", "姉", "弟", "妹", "子供", "子ども", "育児",
            "親子", "夫", "妻", "旦那", "嫁", "義父", "義母", "介護", "実家", "離婚", "家庭"],
  },
  {
    theme: "study",
    words: ["勉強", "学校", "受験", "試験", "資格", "大学", "高校", "合格", "不合格", "成績",
            "学習", "留学", "語学", "研究", "論文", "卒業", "進学"],
  },
  {
    theme: "travel",
    words: ["旅行", "旅", "引っ越し", "移住", "海外", "国内", "出張", "転勤", "方角", "場所",
            "住む", "住まい"],
  },
];

export function detectTheme(question: string): QuestionTheme {
  for (const { theme, words } of THEME_KEYWORDS) {
    if (words.some((w) => question.includes(w))) return theme;
  }
  return "general";
}

const THEME_LABELS: Record<QuestionTheme, string> = {
  love: "恋愛・人間関係",
  work: "仕事・キャリア",
  money: "金運・お金",
  health: "健康・体",
  family: "家族・家庭",
  study: "学び・試験",
  travel: "旅・場所",
  general: "全体運",
};

export function getThemeLabel(theme: QuestionTheme): string {
  return THEME_LABELS[theme];
}

// カードデータのどのフィールドがそのテーマに対応するか
export function getThemeField(theme: QuestionTheme): keyof { love: string; love_rev?: string; work: string; work_rev?: string; money?: string; health?: string; spirit?: string; advice: string } {
  if (theme === "love" || theme === "family") return "love";
  if (theme === "work" || theme === "study") return "work";
  if (theme === "money") return "money";
  if (theme === "health") return "health";
  return "spirit";
}

// 質問への直接回答を先頭に追加するヘルパー
export function buildQuestionAnswer(
  question: string,
  themeContent: string,
  theme: QuestionTheme,
): { label: string; content: string } {
  const label = `🔮 「${question.slice(0, 30)}${question.length > 30 ? "…" : ""}」への答え`;
  const prefix: Record<QuestionTheme, string> = {
    love: "恋愛・人間関係について──",
    work: "仕事・キャリアについて──",
    money: "金運・お金について──",
    health: "健康・体について──",
    family: "家族・家庭について──",
    study: "学び・試験について──",
    travel: "旅・場所の変化について──",
    general: "あなたの問いかけに対して──",
  };
  return { label, content: `${prefix[theme]}${themeContent}` };
}
