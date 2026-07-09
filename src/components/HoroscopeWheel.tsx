"use client";

import { ChartWheelData } from "@/lib/types";

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
// 火・地・風・水の順で12星座を彩色（元素ごとに背景を変える）
const SIGN_ELEMENT_COLOR = [
  "#7a3b3b", "#3b5c3b", "#3b4a6b", "#5c4a7a", // 牡羊 牡牛 双子 蟹
  "#7a3b3b", "#3b5c3b", "#3b4a6b", "#5c4a7a", // 獅子 乙女 天秤 蠍
  "#7a3b3b", "#3b5c3b", "#3b4a6b", "#5c4a7a", // 射手 山羊 水瓶 魚
];

const CX = 200, CY = 200;
const OUTER_R = 190;
const INNER_R = 152;
const PLANET_TICK_R = 152;
const PLANET_LABEL_R = 118;
const PLANET_LABEL_R2 = 96; // 近接時の退避用の内側リング

function toXY(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// アセンダントを基準（左＝9時方向）に、黄経が増えるほど反時計回りに進む角度を返す
function angleFor(lon: number, anchor: number) {
  return 180 - (lon - anchor);
}

function ringPath(outerR: number, innerR: number, a0: number, a1: number) {
  const steps = 10;
  const outerPts = Array.from({ length: steps + 1 }, (_, s) => toXY(outerR, a0 + ((a1 - a0) * s) / steps));
  const innerPts = Array.from({ length: steps + 1 }, (_, s) => toXY(innerR, a1 - ((a1 - a0) * s) / steps));
  const pts = [...outerPts, ...innerPts];
  return "M" + pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" L") + " Z";
}

export function HoroscopeWheel({ data }: { data: ChartWheelData }) {
  const hasAngles = typeof data.ascendant === "number";
  const anchor = data.ascendant ?? 0;

  // 角度が近い天体は内側リングへ退避させて重なりを避ける
  const sorted = [...data.planets].sort(
    (a, b) => ((a.longitude - anchor + 360) % 360) - ((b.longitude - anchor + 360) % 360)
  );
  let lastRel: number | null = null;
  let toggle = 0;
  const placed = sorted.map((p) => {
    const rel = (p.longitude - anchor + 3600) % 360;
    const close = lastRel !== null && Math.min(Math.abs(rel - lastRel), 360 - Math.abs(rel - lastRel)) < 9;
    toggle = close ? (toggle + 1) % 2 : 0;
    lastRel = rel;
    return { ...p, labelR: toggle === 1 ? PLANET_LABEL_R2 : PLANET_LABEL_R };
  });

  const ascAngle = hasAngles ? angleFor(anchor, anchor) : null; // 常に180°（左）
  const mcAngle = hasAngles && typeof data.mc === "number" ? angleFor(data.mc, anchor) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: "420px" }}>
        {/* 黄道十二宮リング */}
        {SIGN_SYMBOLS.map((sym, i) => {
          const lonStart = i * 30;
          const a0 = angleFor(lonStart, anchor);
          const a1 = angleFor(lonStart + 30, anchor);
          const aMid = (a0 + a1) / 2;
          const mid = toXY((OUTER_R + INNER_R) / 2, aMid);
          return (
            <g key={i}>
              <path d={ringPath(OUTER_R, INNER_R, a0, a1)} fill={SIGN_ELEMENT_COLOR[i]} fillOpacity={0.35} stroke="#c9a24a" strokeOpacity={0.4} strokeWidth={0.75} />
              <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle" fontSize={17} fill="#e8c874">
                {sym}
              </text>
            </g>
          );
        })}

        {/* 内円 */}
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="#c9a24a" strokeOpacity={0.35} strokeWidth={1} />
        <circle cx={CX} cy={CY} r={PLANET_LABEL_R2 - 18} fill="none" stroke="#c9a24a" strokeOpacity={0.2} strokeWidth={1} />

        {/* ASC-DESC / MC-IC の軸線（出生時刻がある場合のみ） */}
        {hasAngles && ascAngle !== null && (
          <>
            <line
              x1={toXY(INNER_R, ascAngle).x} y1={toXY(INNER_R, ascAngle).y}
              x2={toXY(INNER_R, ascAngle + 180).x} y2={toXY(INNER_R, ascAngle + 180).y}
              stroke="#e8c874" strokeOpacity={0.6} strokeWidth={1.5}
            />
            <text x={toXY(INNER_R + 14, ascAngle).x} y={toXY(INNER_R + 14, ascAngle).y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#e8c874">ASC</text>
            <text x={toXY(INNER_R + 14, ascAngle + 180).x} y={toXY(INNER_R + 14, ascAngle + 180).y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#e8c874">DSC</text>
          </>
        )}
        {hasAngles && mcAngle !== null && (
          <>
            <line
              x1={toXY(INNER_R, mcAngle).x} y1={toXY(INNER_R, mcAngle).y}
              x2={toXY(INNER_R, mcAngle + 180).x} y2={toXY(INNER_R, mcAngle + 180).y}
              stroke="#e8c874" strokeOpacity={0.35} strokeWidth={1}
            />
            <text x={toXY(INNER_R + 14, mcAngle).x} y={toXY(INNER_R + 14, mcAngle).y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#e8c874">MC</text>
            <text x={toXY(INNER_R + 14, mcAngle + 180).x} y={toXY(INNER_R + 14, mcAngle + 180).y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#e8c874">IC</text>
          </>
        )}

        {/* 天体 */}
        {placed.map((p) => {
          const angle = angleFor(p.longitude, anchor);
          const tick = toXY(PLANET_TICK_R, angle);
          const label = toXY(p.labelR, angle);
          return (
            <g key={p.key}>
              <line x1={tick.x} y1={tick.y} x2={label.x} y2={label.y} stroke="#e8c874" strokeOpacity={0.35} strokeWidth={0.75} />
              <circle cx={label.x} cy={label.y} r={13} fill="#1a1030" stroke="#e8c874" strokeOpacity={0.7} strokeWidth={1} />
              <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#f5d98a">
                {p.symbol}
              </text>
            </g>
          );
        })}
      </svg>
      {!hasAngles && (
        <p className="text-xs text-gray-500">※出生時間を入力するとアセンダント（ASC）基準の円盤になります</p>
      )}
    </div>
  );
}
