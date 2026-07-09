"use client";

import { ChartWheelData } from "@/lib/types";

// 調和系（トライン・セクスタイル）は緑、緊張系（スクエア・オポジション）は赤、合はゴールド
const ASPECT_COLOR: Record<string, string> = {
  "☌": "#e8c874",
  "⚹": "#7fbf7f",
  "△": "#7fbf7f",
  "□": "#d16a6a",
  "☍": "#d16a6a",
};

export function AspectGrid({ data }: { data: ChartWheelData }) {
  const planets = data.planets;
  const aspects = data.aspects || [];
  if (aspects.length === 0) return null;

  const findAspect = (aKey: string, bKey: string) =>
    aspects.find((a) => (a.a === aKey && a.b === bKey) || (a.a === bKey && a.b === aKey));

  const colPlanets = planets.slice(0, -1);
  const rowPlanets = planets.slice(1);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", margin: "0 auto", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th></th>
              {colPlanets.map((p) => (
                <th key={p.key} style={{ padding: "4px 6px", color: "#e8c874" }}>
                  <span title={p.label}>{p.symbol}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowPlanets.map((rowPlanet, i) => {
              const rowIdx = i + 1;
              return (
                <tr key={rowPlanet.key}>
                  <th style={{ padding: "4px 6px", color: "#e8c874", textAlign: "right" }}>
                    <span title={rowPlanet.label}>{rowPlanet.symbol}</span>
                  </th>
                  {colPlanets.map((colPlanet, colIdx) => {
                    if (colIdx >= rowIdx) {
                      return <td key={colPlanet.key} style={{ width: "30px", height: "30px" }}></td>;
                    }
                    const asp = findAspect(rowPlanet.key, colPlanet.key);
                    return (
                      <td
                        key={colPlanet.key}
                        title={asp ? `${rowPlanet.label} ${asp.name} ${colPlanet.label}` : undefined}
                        style={{
                          width: "30px",
                          height: "30px",
                          textAlign: "center",
                          border: "1px solid rgba(201,162,74,0.15)",
                          color: asp ? ASPECT_COLOR[asp.symbol] : "rgba(255,255,255,0.12)",
                          fontSize: "1.05rem",
                        }}
                      >
                        {asp ? asp.symbol : "・"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "10px" }} className="text-xs text-gray-400">
        <span><span style={{ color: ASPECT_COLOR["☌"] }}>☌</span> 合（融合）</span>
        <span><span style={{ color: ASPECT_COLOR["⚹"] }}>⚹</span> セクスタイル（好機）</span>
        <span><span style={{ color: ASPECT_COLOR["△"] }}>△</span> トライン（調和）</span>
        <span><span style={{ color: ASPECT_COLOR["□"] }}>□</span> スクエア（葛藤）</span>
        <span><span style={{ color: ASPECT_COLOR["☍"] }}>☍</span> オポジション（綱引き）</span>
      </div>
    </div>
  );
}
