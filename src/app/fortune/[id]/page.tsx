"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FORTUNES } from "@/lib/fortunes";
import { FortuneResult } from "@/lib/types";
import { getTarotReading } from "@/lib/fortunes/tarot";
import { getAstrologyReading } from "@/lib/fortunes/astrology";
import { getNumerologyReading } from "@/lib/fortunes/numerology";
import { getOmikujiReading } from "@/lib/fortunes/omikuji";
import { getRuneReading } from "@/lib/fortunes/rune";
import { getIChingReading } from "@/lib/fortunes/iching";
import { getBloodTypeReading } from "@/lib/fortunes/blood-type";
import {
  getOracleReading,
  getDreamReading,
  getAngelNumberReading,
  getBirthstoneReading,
  getHandReading,
  getFengShuiReading,
  getKyuseiReading,
  getShichuReading,
} from "@/lib/fortunes/others";
import { detectTheme, getThemeLabel } from "@/lib/questionAnalyzer";

const THEME_DETAIL_KEYWORDS: Record<string, string[]> = {
  love: ["恋愛", "愛", "love", "ラブ", "縁", "パートナー", "結婚"],
  work: ["仕事", "キャリア", "work", "転職", "昇進", "ビジネス"],
  money: ["金運", "財", "お金", "money", "収入"],
  health: ["健康", "体", "health", "ヒーリング"],
  spirit: ["スピリチュアル", "霊", "spirit", "魂", "メッセージ"],
};

function reorderDetails(
  details: FortuneResult["details"],
  question: string,
): FortuneResult["details"] {
  const theme = detectTheme(question);
  if (theme === "general") return details;
  const keywords = THEME_DETAIL_KEYWORDS[theme] ?? [];
  const idx = details.findIndex((d) =>
    keywords.some((kw) => d.label.includes(kw))
  );
  if (idx <= 0) return details;
  const reordered = [...details];
  const [matched] = reordered.splice(idx, 1);
  reordered.unshift(matched);
  return reordered;
}

function ResultDisplay({ result, question }: { result: FortuneResult; question?: string }) {
  const orderedDetails = question ? reorderDetails(result.details, question) : result.details;
  const theme = question ? detectTheme(question) : "general";

  return (
    <div className="result-card rounded-2xl p-6 md:p-8 mt-8 space-y-6">
      {question && (
        <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-4">
          <p className="text-xs text-purple-300/60 tracking-wider mb-1">あなたの質問</p>
          <p className="text-gray-200 text-sm leading-relaxed">「{question}」</p>
          {theme !== "general" && (
            <p className="text-xs text-yellow-500/60 mt-2">
              🔍 テーマ検出：<span className="text-yellow-500/90">{getThemeLabel(theme)}</span> に関する質問として読み解きます
            </p>
          )}
        </div>
      )}

      <div className="text-center">
        <div className="text-xs text-yellow-500/60 tracking-widest mb-2">— 結果 —</div>
        <h2 className="text-2xl md:text-3xl font-bold gold-gradient mb-2">{result.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
      </div>

      <hr className="divider-gold" />

      <div className="space-y-4">
        {orderedDetails.map((detail, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${i === 0 && question && theme !== "general" ? "bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3" : ""}`}
          >
            <span className="text-xs text-yellow-500/70 tracking-wider uppercase">{detail.label}</span>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">{detail.content}</p>
          </div>
        ))}
      </div>

      {result.lucky && (
        <>
          <hr className="divider-gold" />
          <div>
            <p className="text-xs text-yellow-500/70 tracking-wider mb-3">✦ ラッキー情報</p>
            <div className="grid grid-cols-2 gap-3">
              {result.lucky.color && (
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-xs text-gray-500">ラッキーカラー</span>
                  <p className="text-sm font-semibold gold-text">{result.lucky.color}</p>
                </div>
              )}
              {result.lucky.number && (
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-xs text-gray-500">ラッキーナンバー</span>
                  <p className="text-sm font-semibold gold-text">{result.lucky.number}</p>
                </div>
              )}
              {result.lucky.item && (
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-xs text-gray-500">ラッキーアイテム</span>
                  <p className="text-sm font-semibold gold-text">{result.lucky.item}</p>
                </div>
              )}
              {result.lucky.direction && (
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-xs text-gray-500">吉方位</span>
                  <p className="text-sm font-semibold gold-text">{result.lucky.direction}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <hr className="divider-gold" />

      <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
        <p className="text-xs text-purple-300/70 mb-2 tracking-wider">✦ アドバイス</p>
        <p className="text-gray-200 leading-relaxed">{result.advice}</p>
      </div>
    </div>
  );
}

function InputForm({
  inputType,
  fortuneId,
  onSubmit,
}: {
  inputType: string;
  fortuneId: string;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isValid = () => {
    if (inputType === "birthday") return !!values.birthday;
    if (inputType === "birthday_name") return !!values.birthday && !!values.name;
    if (inputType === "birthday_time") return !!values.birthday; // birthTime は任意
    if (inputType === "blood_type") return !!values.blood_type;
    if (inputType === "question") {
      if (fortuneId === "hand-reading") {
        return !!(values.lifeLine || values.heartLine || values.headLine || values.fateLine || values.sunLine);
      }
      return !!values.question?.trim();
    }
    if (inputType === "keyword") {
      if (fortuneId === "dream") return (values.keyword || "").split(",").filter(Boolean).length > 0;
      return !!values.keyword?.trim();
    }
    if (inputType === "name") return !!values.name?.trim();
    if (inputType === "draw") return true;
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(inputType === "birthday" || inputType === "birthday_name" || inputType === "birthday_time") && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">生年月日</label>
          <input
            type="date"
            value={values.birthday || ""}
            onChange={(e) => set("birthday", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min="1900-01-01"
          />
        </div>
      )}

      {inputType === "birthday_time" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            生まれた時間（わかる場合・時刻まで入力するとASC/MCを正確に算出）
          </label>
          <input
            type="time"
            value={values.birthTime || ""}
            onChange={(e) => set("birthTime", e.target.value)}
            style={{
              background: "rgba(18, 18, 42, 0.8)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              padding: "10px 14px",
              width: "100%",
              outline: "none",
            }}
          />
          <p className="text-xs text-gray-500 mt-1">入力しなくてもOK（太陽・月・惑星は算出されます）</p>
        </div>
      )}

      {(inputType === "birthday_name" || inputType === "name") && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">お名前（フルネーム）</label>
          <input
            type="text"
            placeholder="例：山田 花子"
            value={values.name || ""}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
      )}

      {inputType === "question" && fortuneId === "hand-reading" && (
        <div className="space-y-4">
          <p className="text-sm text-yellow-500/70">自分の手のひらを見ながら答えてください（右手・利き手）</p>
          {[
            {
              key: "lifeLine", label: "① 生命線（親指の付け根を囲む弧の線）",
              options: [
                { value: "生命線_長い", label: "長くて深い（手首まで伸びている）" },
                { value: "生命線_短い", label: "短め（手の中ほどで終わる）" },
                { value: "", label: "普通・よくわからない" },
              ],
            },
            {
              key: "heartLine", label: "② 感情線（小指側から人差し指方向へ伸びる一番上の横線）",
              options: [
                { value: "感情線_深い", label: "深くはっきりしている" },
                { value: "感情線_浅い", label: "浅め・薄め" },
                { value: "", label: "普通・よくわからない" },
              ],
            },
            {
              key: "headLine", label: "③ 知能線（手の中央を横切る線）",
              options: [
                { value: "知能線_長い", label: "長い（小指側まで伸びている）" },
                { value: "知能線_短い", label: "短め" },
                { value: "", label: "普通・よくわからない" },
              ],
            },
            {
              key: "fateLine", label: "④ 運命線（手のひら中央を縦に走る線）",
              options: [
                { value: "運命線_ある", label: "はっきりある" },
                { value: "運命線_ない", label: "ない・ほとんど見えない" },
                { value: "", label: "うっすらある程度" },
              ],
            },
            {
              key: "sunLine", label: "⑤ 太陽線（薬指の下の縦線）",
              options: [
                { value: "太陽線_ある", label: "ある" },
                { value: "", label: "ない・わからない" },
              ],
            },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1">{label}</label>
              <select
                value={values[key] || ""}
                onChange={(e) => {
                  const updated = { ...values, [key]: e.target.value };
                  const palmDesc = [
                    updated.lifeLine, updated.heartLine, updated.headLine,
                    updated.fateLine, updated.sunLine,
                  ].filter(Boolean).join(" ");
                  setValues({ ...updated, question: palmDesc || "手相鑑定" });
                }}
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {inputType === "question" && fortuneId !== "hand-reading" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            心に浮かぶ質問や悩みを入力してください
          </label>
          <textarea
            rows={3}
            placeholder="例：仕事の転換期はいつ来るでしょうか"
            value={values.question || ""}
            onChange={(e) => set("question", e.target.value)}
            style={{
              background: "rgba(18, 18, 42, 0.8)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              padding: "10px 14px",
              width: "100%",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>
      )}

      {inputType === "keyword" && fortuneId === "dream" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            どんな夢を見ましたか？（複数選択可）
          </label>
          {[
            { value: "飛ぶ",    label: "空を飛ぶ" },
            { value: "追われる", label: "追いかけられる・逃げる" },
            { value: "落ちる",  label: "高いところから落ちる" },
            { value: "歯",      label: "歯が抜ける" },
            { value: "死",      label: "死ぬ・誰かが死ぬ" },
            { value: "海",      label: "海・大きな水" },
            { value: "水",      label: "川・池・水" },
            { value: "空",      label: "空・雲・青空" },
            { value: "山",      label: "山・登山" },
            { value: "火",      label: "火・炎・火事" },
            { value: "家",      label: "家・部屋" },
            { value: "人",      label: "知人・見知らぬ人が出てくる" },
            { value: "花",      label: "花・植物" },
            { value: "動物",    label: "動物が出てくる" },
            { value: "道",      label: "道・分かれ道" },
            { value: "学校",    label: "学校・試験" },
            { value: "赤ちゃん", label: "赤ちゃん・子供" },
            { value: "トイレ",   label: "トイレに行く・トイレを探す" },
            { value: "蛇",       label: "蛇が出てくる" },
            { value: "結婚",     label: "結婚式・プロポーズ" },
            { value: "お金",     label: "お金を拾う・もらう・失う" },
            { value: "虹",       label: "虹が見える" },
          ].map(({ value, label }) => {
            const selected = (values.keyword || "").split(",").filter(Boolean);
            const checked = selected.includes(value);
            return (
              <label key={value} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", cursor: "pointer", color: checked ? "var(--gold)" : "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((v) => v !== value)
                      : [...selected, value];
                    set("keyword", next.join(","));
                  }}
                  style={{ accentColor: "var(--gold)", width: "16px", height: "16px" }}
                />
                {label}
              </label>
            );
          })}
        </div>
      )}

      {inputType === "keyword" && fortuneId !== "dream" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            数字を入力してください
          </label>
          <input
            type="text"
            placeholder="例：111、222、1111など"
            value={values.keyword || ""}
            onChange={(e) => set("keyword", e.target.value)}
          />
        </div>
      )}

      {inputType === "blood_type" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">血液型</label>
          <select value={values.blood_type || ""} onChange={(e) => set("blood_type", e.target.value)}>
            <option value="">選択してください</option>
            <option value="A">A型</option>
            <option value="B">B型</option>
            <option value="O">O型</option>
            <option value="AB">AB型</option>
          </select>
        </div>
      )}

      {inputType === "draw" && (
        <div className="text-center py-4">
          <div className="text-6xl float-anim mb-4">🎋</div>
          <p className="text-gray-400 text-sm">
            心を静め、深呼吸して<br />ボタンを押してください
          </p>
        </div>
      )}

      <button type="submit" className="btn-gold" disabled={!isValid()}>
        ✦ 占う ✦
      </button>
    </form>
  );
}

function getReading(id: string, values: Record<string, string>): FortuneResult | null {
  switch (id) {
    case "tarot": return getTarotReading(values.question || "今");
    case "astrology": {
      if (!values.birthday) return null;
      let decimalHour: number | undefined;
      if (values.birthTime) {
        const [h, m] = values.birthTime.split(":").map(Number);
        decimalHour = h + m / 60;
      }
      return getAstrologyReading(values.birthday, decimalHour);
    }
    case "numerology": return values.birthday ? getNumerologyReading(values.birthday, values.name || "") : null;
    case "omikuji": return getOmikujiReading();
    case "rune": return getRuneReading(values.question || "今");
    case "iching": return getIChingReading(values.question || "今");
    case "blood-type": return values.blood_type ? getBloodTypeReading(values.blood_type) : null;
    case "oracle": return getOracleReading(values.question || "今");
    case "dream": return getDreamReading(values.keyword || "");
    case "angel-number": return getAngelNumberReading(values.keyword || "111");
    case "birthstone": return values.birthday ? getBirthstoneReading(values.birthday) : null;
    case "hand-reading": return getHandReading(values.question || "今");
    case "feng-shui": return values.birthday ? getFengShuiReading(values.birthday) : null;
    case "kyusei-kigaku": return values.birthday ? getKyuseiReading(values.birthday) : null;
    case "shichu-suimei": {
      if (!values.birthday) return null;
      let shichuHour: number | undefined;
      if (values.birthTime) {
        const [h] = values.birthTime.split(":").map(Number);
        shichuHour = h;
      }
      return getShichuReading(values.birthday, shichuHour);
    }
    default: return null;
  }
}

export default function FortunePage() {
  const params = useParams();
  const id = params.id as string;
  const fortune = FORTUNES.find((f) => f.id === id);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | undefined>(undefined);

  if (!fortune) {
    return (
      <div className="mystical-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">占いが見つかりません</p>
          <Link href="/" className="text-yellow-500 text-sm mt-4 block">
            ← トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (values: Record<string, string>) => {
    const r = getReading(id, values);
    setResult(r);
    setLastQuestion(values.question || values.keyword || undefined);
    if (r) {
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="mystical-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-yellow-500 transition-colors mb-8"
        >
          ← 占い一覧に戻る
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 float-anim">{fortune.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-2">{fortune.name}</h1>
          <p className="text-purple-300 text-sm mb-3">{fortune.nameEn}</p>
          <p className="text-gray-400 leading-relaxed">{fortune.description}</p>
          <p className="text-xs text-gray-600 mt-2">起源：{fortune.origin}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-8" />

        {/* Form */}
        <div className="card-mystical rounded-xl p-6">
          <InputForm inputType={fortune.inputType} fortuneId={fortune.id} onSubmit={handleSubmit} />
        </div>

        {/* Result */}
        <div id="result">
          {result && <ResultDisplay result={result} question={lastQuestion} />}
        </div>

        {result && (
          <div className="mt-8 flex flex-col gap-3">
            <button
              className="w-full py-3 rounded-lg border border-yellow-500/30 text-yellow-500/80 hover:bg-yellow-500/10 transition-colors text-sm"
              onClick={() => {
                setResult(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              もう一度占う
            </button>
            <Link
              href="/"
              className="block text-center py-3 rounded-lg border border-white/10 text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              他の占いを見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
