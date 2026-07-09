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

// ホロスコープ円盤（天体配置図）を描画するための構造化データ
export interface ChartWheelPlanet {
  key: string;       // "sun" | "moon" | "mercury" 等
  label: string;      // 表示名（太陽・月 等）
  symbol: string;      // 天体記号（☉ ☽ ☿ 等）
  longitude: number;   // 黄経（度・0〜360）
}
// 天体同士のアスペクト（相互作用）。アスペクト表（グリッド）の描画にも使う
export interface ChartAspect {
  a: string;      // 天体キー（例："sun"）
  b: string;      // 天体キー（例："moon"）
  symbol: string;  // ☌ ⚹ □ △ ☍
  name: string;    // アスペクト名（例："トライン（120度）"）
}
export interface ChartWheelData {
  planets: ChartWheelPlanet[];
  ascendant?: number; // アセンダントの黄経（出生時刻がある場合のみ）
  mc?: number;        // MC（中天）の黄経（出生時刻がある場合のみ）
  aspects?: ChartAspect[];
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
  chartWheel?: ChartWheelData;
  advice: string;
}
