export interface Fortune {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  origin: string;
  icon: string;
  category: "cards" | "numbers" | "astrology" | "nature" | "eastern" | "ancient" | "spiritual" | "personality" | "comprehensive";
  inputType: FortuneInputType;
}

export type FortuneInputType =
  | "birthday"
  | "name"
  | "birthday_name"
  | "question"
  | "draw"
  | "birthday_time"
  | "blood_type"
  | "keyword"
  | "quiz"
  | "two_birthday";

export interface GeomancyFigure {
  name: string;
  role: string;
  dots: [number, number, number, number]; // 1=●（1点）, 2=● ●（2点）
  meaning: string;
  description: string;
}

// カード・サイコロ系占いで「実際に引いた」ことを視覚的に見せるための構造化データ
export interface DrawnCard {
  position?: string;  // スプレッド上の位置（例：「過去」「現在」）
  name: string;        // カード名・出目名
  symbol?: string;      // 絵文字・グリフ（ルーン文字、易経の卦、スートマーク等）
  reversed?: boolean;   // 逆位置か
  imageUrl?: string;    // 将来イラスト画像を追加する際に使用（現時点では未使用）
}

export interface FortuneResult {
  title: string;
  summary: string;
  details: {
    label: string;
    content: string;
  }[];
  lucky?: {
    color?: string;
    number?: string;
    item?: string;
    direction?: string;
  };
  geomancyFigures?: GeomancyFigure[];
  drawnCards?: DrawnCard[];
  diceRoll?: number[];
  advice: string;
}
