"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FORTUNES } from "@/lib/fortunes";
import { FortuneResult } from "@/lib/types";

// ── 既存占い ──
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
  getFengShuiReading,
  getKyuseiReading,
  getShichuReading,
} from "@/lib/fortunes/others";

// ── 東洋 ──
import {
  getSeimeiReading,
  getEtoReading,
  getRokuyoReading,
  getSanmeigakuReading,
  getShibiReading,
} from "@/lib/fortunes/world-eastern";

// ── 古代 ──
import {
  getVedicReading,
  getMayaReading,
  getEgyptReading,
  getBabylonReading,
  getCelticReading,
  getGeomancyReading,
} from "@/lib/fortunes/world-ancient";

// ── カード ──
import { getLenormandReading, getGypsyReading } from "@/lib/fortunes/world-cards";

// ── スピリチュアル ──
import {
  getPastLifeReading,
  getAuraReading,
  getChakraReading,
  getAkashicReading,
  getSpiritAnimalReading,
} from "@/lib/fortunes/world-spiritual";

// ── 自然・数 ──
import {
  getBirthFlowerReading,
  getMoonReading,
  getKabbalahReading,
  getBirthDayReading,
  getDiceReading,
  getBiorhythmReading,
} from "@/lib/fortunes/world-nature";

// ── 性格診断 ──
import {
  getMBTIReading,
  getHSPReading,
  getEnneagramReading,
  getBigFiveReading,
  getTemperamentReading,
  getFourElementsReading,
  getAuraColorReading,
  getJungArchetypeReading,
  getColorPersonalityReading,
  getFaceReading,
} from "@/lib/fortunes/world-personality";

// ── 守護神 ──
import { getDeityReading } from "@/lib/fortunes/world-deity";

// ── 総合鑑定 ──
import { getComprehensiveReading } from "@/lib/fortunes/world-comprehensive";

import { GeomancyFigure } from "@/lib/types";
import { detectTheme, getThemeLabel } from "@/lib/questionAnalyzer";

// ──────────────────────────────────────────────────────────────
const THEME_DETAIL_KEYWORDS: Record<string, string[]> = {
  love:   ["恋愛", "愛", "love", "ラブ", "縁", "パートナー", "結婚"],
  work:   ["仕事", "キャリア", "work", "転職", "昇進", "ビジネス"],
  money:  ["金運", "財", "お金", "money", "収入"],
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
  const idx = details.findIndex((d) => keywords.some((kw) => d.label.includes(kw)));
  if (idx <= 0) return details;
  const reordered = [...details];
  const [matched] = reordered.splice(idx, 1);
  reordered.unshift(matched);
  return reordered;
}

// ──────────────────────────────────────────────────────────────
function GeomancyFigureCard({ fig }: { fig: GeomancyFigure }) {
  const ROW_LABELS = ["火", "風", "水", "地"];
  return (
    <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4">
      <p className="text-xs text-yellow-500/50 tracking-wider mb-1">{fig.role}</p>
      <h3 className="text-base font-bold gold-text mb-4">{fig.name}</h3>
      <div className="flex justify-center mb-4">
        <div className="space-y-2">
          {fig.dots.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-4 text-right">{ROW_LABELS[i]}</span>
              <div className="flex items-center justify-center w-14 gap-1.5">
                {d === 2 ? (
                  <>
                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                  </>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-90" />
                )}
              </div>
              <span className="text-xs text-gray-600">{d === 2 ? "2点（偶）" : "1点（奇）"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 pt-3 space-y-1">
        <p className="text-xs text-purple-300/70">意味：{fig.meaning}</p>
        <p className="text-sm text-gray-300 leading-relaxed">{fig.description}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
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

      {result.geomancyFigures && result.geomancyFigures.length > 0 && (
        <>
          <hr className="divider-gold" />
          <div>
            <p className="text-xs text-yellow-500/70 tracking-wider mb-3">✦ 図形（上から 火・風・水・地）</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.geomancyFigures.map((fig, i) => (
                <GeomancyFigureCard key={i} fig={fig} />
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="divider-gold" />

      <div className="space-y-4">
        {orderedDetails.map((detail, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${i === 0 && question && theme !== "general" ? "bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3" : ""}`}
          >
            <span className="text-xs text-yellow-500/70 tracking-wider uppercase">{detail.label}</span>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base whitespace-pre-line">{detail.content}</p>
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

      <hr className="divider-gold" />

      <div className="text-center">
        <p className="text-xs text-gray-500 mb-3">結果をシェアする</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => {
              const text = `🔮 世界の占い堂で占ってみた！\n\n✨ ${result.title}\n\n${result.summary.slice(0, 80)}${result.summary.length > 80 ? "…" : ""}\n\n#世界の占い堂 #占い`;
              const url = "https://uranai-app-beta-ten.vercel.app";
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                "_blank", "noopener,noreferrer"
              );
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: "#000", color: "#fff", border: "1px solid #333" }}
          >
            𝕏 でシェア
          </button>
          <button
            onClick={() => {
              const text = `🔮 世界の占い堂で占ってみた！\n✨ ${result.title}\n${result.summary.slice(0, 60)}${result.summary.length > 60 ? "…" : ""}`;
              const url = "https://uranai-app-beta-ten.vercel.app";
              window.open(
                `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                "_blank", "noopener,noreferrer"
              );
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: "#06C755", color: "#fff" }}
          >
            LINE でシェア
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
const SLIDER_STYLE: React.CSSProperties = {
  width: "100%",
  accentColor: "var(--gold)",
  cursor: "pointer",
};

const SELECT_STYLE: React.CSSProperties = {
  background: "rgba(18, 18, 42, 0.8)",
  border: "1px solid rgba(201, 162, 39, 0.3)",
  color: "var(--text-primary)",
  borderRadius: "8px",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
};

function InputForm({
  inputType,
  fortuneId,
  onSubmit,
}: {
  inputType: string;
  fortuneId: string;
  onSubmit: (values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({
    // HSP デフォルト（中間値5）
    hsp_0: "5", hsp_1: "5", hsp_2: "5", hsp_3: "5", hsp_4: "5", hsp_5: "5", hsp_6: "5",
    // BigFive デフォルト（中間値50）
    big5_O: "50", big5_C: "50", big5_E: "50", big5_A: "50", big5_N: "50",
  });

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // HSP: combine scores into hsp_answers for the reading function
    if (fortuneId === "hsp") {
      const answers = [0,1,2,3,4,5,6].map(i => values[`hsp_${i}`] || "5").join(",");
      onSubmit({ ...values, hsp_answers: answers });
      return;
    }
    onSubmit(values);
  };

  const isValid = (): boolean => {
    if (inputType === "birthday") return !!values.birthday;
    if (inputType === "birthday_name") return !!values.birthday;
    if (inputType === "birthday_time") return !!values.birthday;
    if (inputType === "blood_type") return !!values.blood_type;
    if (inputType === "question") return !!values.question?.trim();
    if (inputType === "name") return !!values.name?.trim();
    if (inputType === "draw") return true;
    if (inputType === "keyword") {
      if (fortuneId === "dream") return (values.keyword || "").split(",").filter(Boolean).length > 0;
      return !!values.keyword?.trim();
    }
    if (inputType === "quiz") {
      if (fortuneId === "mbti") return !!values.mbti_ei && !!values.mbti_sn && !!values.mbti_tf && !!values.mbti_jp;
      if (fortuneId === "enneagram") return !!values.enneagram_type;
      if (fortuneId === "aura-color") return values.aura_color !== undefined && values.aura_color !== "";
      if (fortuneId === "jung-archetype") return values.archetype !== undefined && values.archetype !== "";
      if (fortuneId === "color-personality") return values.fav_color !== undefined && values.fav_color !== "";
      if (fortuneId === "deity") return !!values.birthday && !!values.deity_q1 && !!values.deity_q2 && !!values.deity_q3;
      if (fortuneId === "face-reading") return !!values.face_shape && !!values.face_eye && !!values.face_nose && !!values.face_mouth && !!values.face_brow;
      return true; // hsp, big-five, temperament, four-elements have defaults
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── 生年月日 ── */}
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

      {/* ── 生まれた時間 ── */}
      {inputType === "birthday_time" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            生まれた時間（わかる場合・任意）
          </label>
          <input
            type="time"
            value={values.birthTime || ""}
            onChange={(e) => set("birthTime", e.target.value)}
            style={SELECT_STYLE}
          />
          <p className="text-xs text-gray-500 mt-1">入力しなくてもOK（太陽・月・惑星は算出されます）</p>
        </div>
      )}

      {/* ── お名前 ── */}
      {(inputType === "birthday_name" || inputType === "name") && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            お名前{inputType === "birthday_name" ? "（任意）" : "（フルネーム）"}
          </label>
          <input
            type="text"
            placeholder={inputType === "birthday_name" ? "例：山田花子（なくてもOK）" : "例：山田 花子"}
            value={values.name || ""}
            onChange={(e) => set("name", e.target.value)}
          />
          {inputType === "name" && fortuneId === "kabbalah" && (
            <p className="text-xs text-gray-500 mt-1">ローマ字・英語名・カタカナいずれも可</p>
          )}
        </div>
      )}

      {/* ── 質問テキスト ── */}
      {inputType === "question" && (
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

      {/* ── 夢占い キーワード ── */}
      {inputType === "keyword" && fortuneId === "dream" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">
            どんな夢を見ましたか？（複数選択可）
          </label>
          {[
            { value: "飛ぶ", label: "空を飛ぶ" },
            { value: "追われる", label: "追いかけられる・逃げる" },
            { value: "落ちる", label: "高いところから落ちる" },
            { value: "歯", label: "歯が抜ける" },
            { value: "死", label: "死ぬ・誰かが死ぬ" },
            { value: "海", label: "海・大きな水" },
            { value: "水", label: "川・池・水" },
            { value: "空", label: "空・雲・青空" },
            { value: "山", label: "山・登山" },
            { value: "火", label: "火・炎・火事" },
            { value: "家", label: "家・部屋" },
            { value: "人", label: "知人・見知らぬ人が出てくる" },
            { value: "花", label: "花・植物" },
            { value: "動物", label: "動物が出てくる" },
            { value: "道", label: "道・分かれ道" },
            { value: "学校", label: "学校・試験" },
            { value: "赤ちゃん", label: "赤ちゃん・子供" },
            { value: "トイレ", label: "トイレに行く・探す" },
            { value: "蛇", label: "蛇が出てくる" },
            { value: "結婚", label: "結婚式・プロポーズ" },
            { value: "お金", label: "お金を拾う・もらう・失う" },
            { value: "虹", label: "虹が見える" },
          ].map(({ value, label }) => {
            const selected = (values.keyword || "").split(",").filter(Boolean);
            const checked = selected.includes(value);
            return (
              <label key={value} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", cursor: "pointer", color: checked ? "var(--gold)" : "var(--text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? selected.filter((v) => v !== value) : [...selected, value];
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

      {/* ── エンジェルナンバー キーワード ── */}
      {inputType === "keyword" && fortuneId !== "dream" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">数字を入力してください</label>
          <input
            type="text"
            placeholder="例：111、222、1111など"
            value={values.keyword || ""}
            onChange={(e) => set("keyword", e.target.value)}
          />
        </div>
      )}

      {/* ── 血液型 ── */}
      {inputType === "blood_type" && (
        <div>
          <label className="block text-sm text-yellow-500/70 mb-2">血液型</label>
          <select value={values.blood_type || ""} onChange={(e) => set("blood_type", e.target.value)} style={SELECT_STYLE}>
            <option value="">選択してください</option>
            <option value="A">A型</option>
            <option value="B">B型</option>
            <option value="O">O型</option>
            <option value="AB">AB型</option>
          </select>
        </div>
      )}

      {/* ── おみくじ・六曜・サイコロ（抽選型） ── */}
      {inputType === "draw" && (
        <div className="text-center py-4">
          <div className="text-6xl float-anim mb-4">
            {fortuneId === "dice" ? "🎲" : fortuneId === "rokuyo" ? "📅" : "🎋"}
          </div>
          <p className="text-gray-400 text-sm">
            心を静め、深呼吸して<br />ボタンを押してください
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          QUIZ 型フォーム
         ══════════════════════════════════════════════ */}

      {/* ── MBTI ── */}
      {inputType === "quiz" && fortuneId === "mbti" && (
        <div className="space-y-6">
          <p className="text-sm text-yellow-500/70">それぞれ当てはまる方を選んでください（全4問）</p>
          {[
            {
              key: "mbti_ei",
              question: "エネルギーの源泉はどちらに近い？",
              options: [
                { value: "E", label: "E（外向型）", desc: "人と関わることでエネルギーが充電される" },
                { value: "I", label: "I（内向型）", desc: "一人の時間でエネルギーが充電される" },
              ],
            },
            {
              key: "mbti_sn",
              question: "日常の中で自然に重視するのは？",
              options: [
                { value: "S", label: "S（感覚型）", desc: "具体的な事実・現実・細部を重視する" },
                { value: "N", label: "N（直観型）", desc: "可能性・ひらめき・大きな全体像を重視する" },
              ],
            },
            {
              key: "mbti_tf",
              question: "決断するとき優先するのは？",
              options: [
                { value: "T", label: "T（思考型）", desc: "論理・分析・客観的な基準で判断する" },
                { value: "F", label: "F（感情型）", desc: "感情・価値観・人への影響で判断する" },
              ],
            },
            {
              key: "mbti_jp",
              question: "生活スタイルはどちらに近い？",
              options: [
                { value: "J", label: "J（判断型）", desc: "計画的で整理された生活を好む" },
                { value: "P", label: "P（知覚型）", desc: "柔軟で自発的な生活を好む" },
              ],
            },
          ].map(({ key, question, options }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-3">{question}</p>
              <div className="space-y-2">
                {options.map((o) => (
                  <label key={o.value} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "8px", borderRadius: "6px", background: values[key] === o.value ? "rgba(201,162,39,0.15)" : "transparent", border: values[key] === o.value ? "1px solid rgba(201,162,39,0.4)" : "1px solid transparent" }}>
                    <input
                      type="radio"
                      name={key}
                      value={o.value}
                      checked={values[key] === o.value}
                      onChange={() => set(key, o.value)}
                      style={{ accentColor: "var(--gold)", marginTop: "2px" }}
                    />
                    <span>
                      <span style={{ color: "var(--gold)", fontWeight: 600 }}>{o.label}</span>
                      <span className="text-gray-400 text-sm ml-2">{o.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HSP ── */}
      {inputType === "quiz" && fortuneId === "hsp" && (
        <div className="space-y-5">
          <p className="text-sm text-yellow-500/70">各質問を0〜10で評価してください（0＝まったく当てはまらない　10＝非常に当てはまる）</p>
          {[
            "騒音・強い光・混雑などの外的刺激が気になりやすい",
            "他人の気持ちや感情の変化に敏感に気づく",
            "一度に多くのことを要求されると圧倒される",
            "暴力的な映像やニュースがしばらく心に残る",
            "繊細な音・味・匂い・感触の違いに気づきやすい",
            "豊かな内面世界・空想・想像の世界がある",
            "何かを決める前に深く考え込む傾向がある",
          ].map((q, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">{i + 1}. {q}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-6">0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={values[`hsp_${i}`] || "5"}
                  onChange={(e) => set(`hsp_${i}`, e.target.value)}
                  style={{ ...SLIDER_STYLE }}
                />
                <span className="text-xs text-gray-500 w-6 text-right">10</span>
                <span className="text-sm font-semibold gold-text w-6 text-right">{values[`hsp_${i}`] || "5"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── エニアグラム ── */}
      {inputType === "quiz" && fortuneId === "enneagram" && (
        <div className="space-y-4">
          <p className="text-sm text-yellow-500/70">最も当てはまるタイプを選んでください</p>
          <p className="text-xs text-gray-500">直感で「これが一番しっくりくる」と思う動機を選ぶのがポイントです</p>
          <select
            value={values.enneagram_type || ""}
            onChange={(e) => set("enneagram_type", e.target.value)}
            style={{ ...SELECT_STYLE }}
          >
            <option value="">タイプを選択してください</option>
            {[
              [1, "改革者",     "正しくありたい・完璧でありたい"],
              [2, "助力者",     "愛されたい・必要とされたい"],
              [3, "達成者",     "価値があると見られたい・成功したい"],
              [4, "個人主義者", "本物の自分でありたい・独自でありたい"],
              [5, "観察者",     "知識を持ちたい・理解したい"],
              [6, "忠実者",     "安全でいたい・確かな支えが欲しい"],
              [7, "熱狂者",     "楽しく満足していたい・痛みを避けたい"],
              [8, "挑戦者",     "力強くいたい・コントロールを持ちたい"],
              [9, "平和主義者", "平和でいたい・対立を避けたい"],
            ].map(([num, name, motive]) => (
              <option key={num} value={String(num)}>
                タイプ{num}：{name}（{motive}）
              </option>
            ))}
          </select>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">ヒント：「何が自分の一番根本的な動機か」に着目してください。行動の結果ではなく、なぜそうしたいのかという動機で選ぶと正確です。</p>
          </div>
        </div>
      )}

      {/* ── ビッグファイブ ── */}
      {inputType === "quiz" && fortuneId === "big-five" && (
        <div className="space-y-5">
          <p className="text-sm text-yellow-500/70">各特性について自分がどの程度当てはまるかを0〜100で評価してください</p>
          {[
            { key: "big5_O", label: "開放性（O）", desc: "好奇心・創造性・新体験への開放度" },
            { key: "big5_C", label: "誠実性（C）", desc: "計画性・責任感・自制心の高さ" },
            { key: "big5_E", label: "外向性（E）", desc: "社交性・活発さ・外向的エネルギー" },
            { key: "big5_A", label: "協調性（A）", desc: "思いやり・信頼性・協力的な姿勢" },
            { key: "big5_N", label: "神経症傾向（N）", desc: "感情の波・ストレス反応・不安傾向" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-200 font-semibold mb-1">{label}</p>
              <p className="text-xs text-gray-500 mb-2">{desc}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-6">低</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={values[key] || "50"}
                  onChange={(e) => set(key, e.target.value)}
                  style={{ ...SLIDER_STYLE }}
                />
                <span className="text-xs text-gray-500 w-6 text-right">高</span>
                <span className="text-sm font-semibold gold-text w-8 text-right">{values[key] || "50"}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* ── 四元素タイプ ── */}
      {inputType === "quiz" && fortuneId === "four-elements" && (
        <div className="space-y-4">
          <p className="text-sm text-yellow-500/70">各元素が自分にどの程度当てはまるか評価してください</p>
          {[
            { key: "elem_fire",  label: "🔥 火（Fire）",  desc: "情熱的・行動力がある・変化を起こしたい・リーダー気質" },
            { key: "elem_water", label: "💧 水（Water）", desc: "感受性が高い・直感を信じる・共感力がある・流れに乗る" },
            { key: "elem_earth", label: "🌍 地（Earth）", desc: "堅実・忍耐強い・安定を好む・現実的・誠実" },
            { key: "elem_air",   label: "💨 風（Air）",   desc: "知的・自由を愛する・コミュニケーション好き・好奇心旺盛" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-200 font-semibold mb-1">{label}</p>
              <p className="text-xs text-gray-500 mb-2">{desc}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">当てはまらない</span>
                <input type="range" min={0} max={10} value={values[key] || "5"} onChange={(e) => set(key, e.target.value)} style={{ ...SLIDER_STYLE }} />
                <span className="text-xs text-gray-500 w-16 text-right">よく当てはまる</span>
                <span className="text-sm font-semibold gold-text w-6 text-right">{values[key] || "5"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── オーラカラー診断 ── */}
      {inputType === "quiz" && fortuneId === "aura-color" && (
        <div className="space-y-3">
          <p className="text-sm text-yellow-500/70">今あなたが最も惹かれる色を選んでください</p>
          {[
            [0, "🔴 赤",   "エネルギー・情熱・生命力"],
            [1, "🟠 橙",   "創造性・喜び・社交性"],
            [2, "🟡 黄",   "知性・楽観・明るさ"],
            [3, "🟢 緑",   "癒し・調和・成長"],
            [4, "🔵 青",   "誠実・平和・表現力"],
            [5, "🟣 藍",   "直感・洞察・内省"],
            [6, "🔮 紫",   "霊性・神秘・知恵"],
            [7, "✨ 白・金", "純粋・保護・高次意識"],
          ].map(([idx, label, desc]) => (
            <label key={idx} style={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "pointer", padding: "10px", borderRadius: "8px", background: values.aura_color === String(idx) ? "rgba(201,162,39,0.15)" : "rgba(255,255,255,0.03)", border: values.aura_color === String(idx) ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="radio" name="aura_color" value={String(idx)} checked={values.aura_color === String(idx)} onChange={() => set("aura_color", String(idx))} style={{ accentColor: "var(--gold)" }} />
                <span style={{ color: values.aura_color === String(idx) ? "var(--gold)" : "var(--text-primary)", fontWeight: 600 }}>{label as string}</span>
              </span>
              <span className="text-xs text-gray-500 pl-6">{desc as string}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── ユング元型診断 ── */}
      {inputType === "quiz" && fortuneId === "jung-archetype" && (
        <div className="space-y-3">
          <p className="text-sm text-yellow-500/70">最も共鳴する元型を選んでください</p>
          <select value={values.archetype || ""} onChange={(e) => set("archetype", e.target.value)} style={{ ...SELECT_STYLE }}>
            <option value="">選択してください</option>
            {[
              [0,  "⚔️ 英雄（The Hero）",        "困難に挑み、限界を超えることに生きがいを感じる"],
              [1,  "📚 賢者（The Sage）",          "真実と知恵を探求し、学び続けることに喜びを感じる"],
              [2,  "🔮 魔術師（The Magician）",    "物事を変容させる力と深い洞察を持つ"],
              [3,  "🧭 探求者（The Explorer）",    "自由と冒険を愛し、新しい可能性を探し続ける"],
              [4,  "⚡ 反乱者（The Rebel）",       "現状を打ち破り、変革と革新を起こしたい"],
              [5,  "❤️ 恋人（The Lover）",         "深い愛と美を求め、つながりに生きがいを感じる"],
              [6,  "🃏 道化師（The Jester）",      "喜びとユーモアで世界を明るくすることが使命"],
              [7,  "🤝 普通人（The Everyman）",    "人々とつながり、共に歩む誠実さを持つ"],
              [8,  "👑 支配者（The Ruler）",       "秩序を守り、責任を持って組織を導く"],
              [9,  "🎨 創造者（The Creator）",     "新しいものを生み出し、独自のビジョンを形にする"],
              [10, "🌿 介護者（The Caregiver）",   "他者のために尽くし、支えることに喜びを感じる"],
              [11, "🌟 無邪気者（The Innocent）",  "純粋な心と楽観的な信念で世界の善を信じる"],
            ].map(([idx, label, desc]) => (
              <option key={idx} value={String(idx)}>{label as string} — {desc as string}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── 色彩性格診断 ── */}
      {inputType === "quiz" && fortuneId === "color-personality" && (
        <div className="space-y-3">
          <p className="text-sm text-yellow-500/70">今あなたが最も好きな色・惹かれる色を選んでください</p>
          {[
            ["red",    "🔴 赤",     "情熱・行動力・強さ"],
            ["orange", "🟠 橙",     "創造性・社交・喜び"],
            ["yellow", "🟡 黄",     "知性・楽観・明るさ"],
            ["green",  "🟢 緑",     "調和・癒し・成長"],
            ["blue",   "🔵 青",     "誠実・知性・平和"],
            ["purple", "🟣 紫",     "神秘・直感・創造性"],
            ["pink",   "🩷 ピンク", "愛・優しさ・思いやり"],
            ["white",  "⬜ 白",     "純粋・完璧・清潔感"],
            ["black",  "⬛ 黒",     "力・洗練・神秘"],
            ["brown",  "🟫 茶",     "安定・誠実・堅実"],
          ].map(([key, label, desc]) => (
            <label key={key} style={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "pointer", padding: "10px", borderRadius: "8px", background: values.fav_color === key ? "rgba(201,162,39,0.15)" : "rgba(255,255,255,0.03)", border: values.fav_color === key ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="radio" name="fav_color" value={key} checked={values.fav_color === key} onChange={() => set("fav_color", key)} style={{ accentColor: "var(--gold)" }} />
                <span style={{ color: values.fav_color === key ? "var(--gold)" : "var(--text-primary)", fontWeight: 600 }}>{label}</span>
              </span>
              <span className="text-xs text-gray-500 pl-6">{desc}</span>
            </label>
          ))}
        </div>
      )}

      {/* ── 四気質診断 ── */}
      {inputType === "quiz" && fortuneId === "temperament" && (
        <div className="space-y-4">
          <p className="text-sm text-yellow-500/70">各気質の説明を読み、自分にどの程度当てはまるかを0〜10で選んでください</p>
          {[
            { key: "temp_a", label: "多血質（風）", desc: "社交的・明るい・行動が早い・飽きっぽい・楽観的" },
            { key: "temp_b", label: "胆汁質（火）", desc: "意志が強い・情熱的・リーダー気質・怒りやすい・決断が速い" },
            { key: "temp_c", label: "粘液質（水）", desc: "穏やか・忍耐強い・共感力が高い・変化が苦手・安定志向" },
            { key: "temp_d", label: "黒胆汁質（地）", desc: "深く考える・完璧主義・芸術的感性・心配性・分析が得意" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-200 font-semibold mb-1">{label}</p>
              <p className="text-xs text-gray-500 mb-2">{desc}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">当てはまらない</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={values[key] || "5"}
                  onChange={(e) => set(key, e.target.value)}
                  style={{ ...SLIDER_STYLE }}
                />
                <span className="text-xs text-gray-500 w-16 text-right">よく当てはまる</span>
                <span className="text-sm font-semibold gold-text w-6 text-right">{values[key] || "5"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 人相学 ── */}
      {inputType === "quiz" && fortuneId === "face-reading" && (
        <div className="space-y-5">
          <p className="text-sm text-yellow-500/70">5つのパーツを選んでください（直感でOK）</p>
          {[
            {
              key: "face_shape", label: "🔲 顔の形",
              opts: [
                { v: "round",   l: "丸顔",             d: "全体的に丸みがある" },
                { v: "oval",    l: "卵形・楕円形",     d: "縦長でなめらかな輪郭" },
                { v: "square",  l: "四角・角ばった顔", d: "あごや頬骨に角がある" },
                { v: "heart",   l: "逆三角形・ハート型", d: "額が広く、あごが細い" },
                { v: "diamond", l: "ひし形・面長",     d: "縦に長く、頬骨が張っている" },
              ],
            },
            {
              key: "face_eye", label: "👁️ 目の形",
              opts: [
                { v: "round",  l: "丸い大きな目",     d: "パッチリとした目" },
                { v: "narrow", l: "細長い切れ長の目", d: "スッとした切れ長" },
                { v: "almond", l: "アーモンド型",     d: "適度な大きさで整った形" },
                { v: "mono",   l: "一重・奥二重",     d: "まぶたのラインが内側にある" },
              ],
            },
            {
              key: "face_nose", label: "👃 鼻の形",
              opts: [
                { v: "high",   l: "高く通った鼻",  d: "鼻筋が通っている" },
                { v: "button", l: "丸いボタン鼻",  d: "鼻先が丸くかわいらしい" },
                { v: "wide",   l: "広い鼻",        d: "小鼻が広がっている" },
                { v: "narrow", l: "細く尖った鼻",  d: "細くシャープな鼻" },
              ],
            },
            {
              key: "face_mouth", label: "👄 口の形",
              opts: [
                { v: "large", l: "大きな口・厚い唇",   d: "存在感のある唇" },
                { v: "small", l: "小さな口・薄い唇",   d: "小ぶりで上品な口元" },
                { v: "full",  l: "ふっくらとした唇",   d: "ぽってりとした唇" },
                { v: "firm",  l: "引き締まった口",     d: "きりっとした口元" },
              ],
            },
            {
              key: "face_brow", label: "✏️ 眉の形",
              opts: [
                { v: "thick",    l: "濃くはっきりした眉", d: "存在感のある太い眉" },
                { v: "thin",     l: "薄くアーチ型の眉",  d: "細く優雅なカーブ" },
                { v: "straight", l: "真っ直ぐな眉",      d: "水平に近いフラット眉" },
                { v: "angular",  l: "角のある眉",        d: "途中で角度が折れている" },
              ],
            },
          ].map(({ key, label, opts }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-yellow-500/70 mb-3">{label}</p>
              <div className="space-y-2">
                {opts.map((o) => (
                  <label key={o.v} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "8px", borderRadius: "6px", background: values[key] === o.v ? "rgba(201,162,39,0.15)" : "transparent", border: values[key] === o.v ? "1px solid rgba(201,162,39,0.4)" : "1px solid transparent" }}>
                    <input type="radio" name={key} value={o.v} checked={values[key] === o.v} onChange={() => set(key, o.v)} style={{ accentColor: "var(--gold)", marginTop: "2px" }} />
                    <span>
                      <span style={{ color: values[key] === o.v ? "var(--gold)" : "var(--text-primary)", fontWeight: 600 }}>{o.l}</span>
                      <span className="text-gray-500 text-xs ml-2">{o.d}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 守護神占い ── */}
      {inputType === "quiz" && fortuneId === "deity" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-yellow-500/70 mb-2">生年月日</label>
            <input
              type="date"
              value={values.birthday || ""}
              onChange={(e) => set("birthday", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min="1900-01-01"
            />
            <p className="text-xs text-gray-500 mt-1">数秘術で「魂の領域（9タイプ）」を算出します</p>
          </div>
          <p className="text-sm text-yellow-500/70">次に、あなたの価値観から神話世界との縁を探ります（全3問）</p>
          {[
            {
              key: "deity_q1",
              q: "困難に直面したとき、あなたは？",
              opts: [
                { v: "a", label: "冷静に考え、知恵と戦略で解決策を探す" },
                { v: "b", label: "力強く正面突破する" },
                { v: "c", label: "過去の経験と知識を整理してから動く" },
                { v: "d", label: "内なる声を聞き、宇宙の流れを感じる" },
                { v: "e", label: "周囲との絆を大切にしながら和で進む" },
                { v: "f", label: "自然の流れに委ね、直感に従う" },
              ],
            },
            {
              key: "deity_q2",
              q: "最も大切にしているのは？",
              opts: [
                { v: "a", label: "美・秩序・理性・論理" },
                { v: "b", label: "誠実さ・強さ・仲間との誓い" },
                { v: "c", label: "知識の蓄積と記録・永続する秩序" },
                { v: "d", label: "魂の成長・すべては一つという感覚" },
                { v: "e", label: "縁・感謝・和の精神・謙虚さ" },
                { v: "f", label: "大地・自然のリズム・土地とのつながり" },
              ],
            },
            {
              key: "deity_q3",
              q: "心が惹かれる自然の姿は？",
              opts: [
                { v: "a", label: "澄み渡る青空と完璧な幾何学的な美しさ" },
                { v: "b", label: "激しい嵐と雷・広大な北の海と大地" },
                { v: "c", label: "果てしない砂漠・ナイルの流れ・永遠の太陽" },
                { v: "d", label: "熱帯の多様な生命・香り立つ山岳の森" },
                { v: "e", label: "日本の四季・桜・紅葉・苔の庭・澄んだ水" },
                { v: "f", label: "霧の深い森・古代の丘・川と草原の静けさ" },
              ],
            },
          ].map(({ key, q, opts }) => (
            <div key={key} className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-3">{q}</p>
              <div className="space-y-2">
                {opts.map((o) => (
                  <label key={o.v} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "8px", borderRadius: "6px", background: values[key] === o.v ? "rgba(201,162,39,0.15)" : "transparent", border: values[key] === o.v ? "1px solid rgba(201,162,39,0.4)" : "1px solid transparent" }}>
                    <input
                      type="radio"
                      name={key}
                      value={o.v}
                      checked={values[key] === o.v}
                      onChange={() => set(key, o.v)}
                      style={{ accentColor: "var(--gold)", marginTop: "2px" }}
                    />
                    <span style={{ color: values[key] === o.v ? "var(--gold)" : "var(--text-secondary)", fontSize: "14px" }}>{o.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="btn-gold" disabled={!isValid()}>
        ✦ 占う ✦
      </button>
    </form>
  );
}

// ──────────────────────────────────────────────────────────────
function getReading(id: string, values: Record<string, string>): FortuneResult | null {
  const bd = values.birthday;
  const q  = values.question || "今";
  const nm = values.name || "";

  // カード・霊的占いは押すたびに違う結果にする
  const rq = q + "|" + Date.now();

  switch (id) {
    // ── 既存 ──
    case "tarot":       return getTarotReading(rq);
    case "astrology": {
      if (!bd) return null;
      let h: number | undefined;
      if (values.birthTime) { const [hh, mm] = values.birthTime.split(":").map(Number); h = hh + mm / 60; }
      return getAstrologyReading(bd, h);
    }
    case "numerology":  return bd ? getNumerologyReading(bd, nm) : null;
    case "omikuji":     return getOmikujiReading();
    case "rune":        return getRuneReading(rq);
    case "iching":      return getIChingReading(rq);
    case "blood-type":  return values.blood_type ? getBloodTypeReading(values.blood_type) : null;
    case "oracle":      return getOracleReading(rq);
    case "dream":       return getDreamReading(values.keyword || "");
    case "angel-number":return getAngelNumberReading(values.keyword || "111");
    case "birthstone":  return bd ? getBirthstoneReading(bd) : null;
    case "feng-shui":   return bd ? getFengShuiReading(bd) : null;
    case "kyusei-kigaku":return bd ? getKyuseiReading(bd) : null;
    case "shichu-suimei": {
      if (!bd) return null;
      let shH: number | undefined;
      if (values.birthTime) { const [hh] = values.birthTime.split(":").map(Number); shH = hh; }
      return getShichuReading(bd, shH);
    }
    // ── 東洋 ──
    case "seimei-handan": return nm ? getSeimeiReading(nm) : null;
    case "eto":         return bd ? getEtoReading(bd) : null;
    case "rokuyo":      return getRokuyoReading();
    case "sanmeigaku":  return bd ? getSanmeigakuReading(bd) : null;
    case "shibi": {
      if (!bd) return null;
      let sH: number | undefined;
      if (values.birthTime) { const [hh] = values.birthTime.split(":").map(Number); sH = hh; }
      return getShibiReading(bd, sH);
    }
    // ── 古代 ──
    case "vedic":       return bd ? getVedicReading(bd) : null;
    case "maya":        return bd ? getMayaReading(bd) : null;
    case "egypt":       return bd ? getEgyptReading(bd) : null;
    case "babylon":     return bd ? getBabylonReading(bd) : null;
    case "celtic-tree": return bd ? getCelticReading(bd) : null;
    case "geomancy":    return getGeomancyReading(rq);
    // ── カード ──
    case "lenormand":   return getLenormandReading(rq);
    case "gypsy-cards": return getGypsyReading(rq);
    // ── スピリチュアル ──
    case "past-life":   return bd ? getPastLifeReading(bd) : null;
    case "aura":        return bd ? getAuraReading(bd) : null;
    case "chakra":      return getChakraReading(rq);
    case "akashic":     return getAkashicReading(rq);
    case "spirit-animal":return getSpiritAnimalReading(rq);
    // ── 自然・数 ──
    case "birth-flower":return bd ? getBirthFlowerReading(bd) : null;
    case "moon-phase":  return bd ? getMoonReading(bd) : null;
    case "kabbalah":    return nm ? getKabbalahReading(nm) : null;
    case "birth-day":   return bd ? getBirthDayReading(bd) : null;
    case "dice":        return getDiceReading();
    case "biorhythm":   return bd ? getBiorhythmReading(bd) : null;
    case "face-reading":return getFaceReading(values);
    // ── 性格診断 ──
    case "mbti":        return getMBTIReading(values);
    case "hsp":         return getHSPReading(values);
    case "enneagram":   return getEnneagramReading(values);
    case "big-five":    return getBigFiveReading(values);
    case "temperament":      return getTemperamentReading(values);
    case "four-elements":    return getFourElementsReading(values);
    case "aura-color":       return getAuraColorReading(values);
    case "jung-archetype":   return getJungArchetypeReading(values);
    case "color-personality":return getColorPersonalityReading(values);
    // ── 守護神 ──
    case "deity":        return values.birthday ? getDeityReading(values) : null;
    // ── 総合鑑定 ──
    case "comprehensive":return bd ? getComprehensiveReading(bd, nm) : null;

    default: return null;
  }
}

// ──────────────────────────────────────────────────────────────
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
          <Link href="/" className="text-yellow-500 text-sm mt-4 block">← トップに戻る</Link>
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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-yellow-500 transition-colors mb-8"
        >
          ← 占い一覧に戻る
        </Link>

        <div className="text-center mb-10">
          <div className="text-6xl mb-4 float-anim">{fortune.icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold gold-gradient mb-2">{fortune.name}</h1>
          <p className="text-purple-300 text-sm mb-3">{fortune.nameEn}</p>
          <p className="text-gray-400 leading-relaxed">{fortune.description}</p>
          <p className="text-xs text-gray-600 mt-2">起源：{fortune.origin}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mb-8" />

        <div className="card-mystical rounded-xl p-6">
          <InputForm inputType={fortune.inputType} fortuneId={fortune.id} onSubmit={handleSubmit} />
        </div>

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
