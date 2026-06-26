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
  | "quiz";

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
  advice: string;
}
