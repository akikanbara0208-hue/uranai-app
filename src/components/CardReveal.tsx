"use client";

import { useEffect, useState } from "react";
import { DrawnCard } from "@/lib/types";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// トランプのハート・ダイヤは伝統的に赤で表示する
const RED_SUITS = ["♥", "♦"];

function SingleCard({ card, index }: { card: DrawnCard; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const isRedSuit = card.symbol ? RED_SUITS.includes(card.symbol) : false;

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 250 + index * 350);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="card-flip-scene card-deal-anim"
      style={{ animationDelay: `${index * 100}ms`, maxWidth: "110px" }}
    >
      <div className={`card-flip-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="card-face card-face-back">
          <span style={{ fontSize: "1.8rem" }}>✦</span>
        </div>
        <div className={`card-face card-face-front ${card.reversed ? "is-reversed" : ""}`}>
          <span className="card-symbol" style={isRedSuit ? { color: "#c0392b" } : undefined}>{card.symbol || "🃏"}</span>
          <span className="card-name" style={isRedSuit ? { color: "#c0392b" } : undefined}>{card.name}</span>
          {card.reversed && <span className="card-reversed-badge">逆位置</span>}
        </div>
      </div>
      {card.position && <div className="card-position-label">{card.position}</div>}
    </div>
  );
}

export function CardRevealRow({ cards }: { cards: DrawnCard[] }) {
  return (
    <div>
      <p className="text-sm text-yellow-500/70 tracking-wider mb-3 text-center">✦ カードをめくっています ✦</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {cards.map((card, i) => (
          <SingleCard key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}

function SingleDie({ value, index }: { value: number; index: number }) {
  const [rolling, setRolling] = useState(true);
  const [display, setDisplay] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(1 + Math.floor(Math.random() * 6));
    }, 80);
    const stop = setTimeout(() => {
      clearInterval(interval);
      setDisplay(value);
      setRolling(false);
    }, 500 + index * 220);
    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [value, index]);

  return (
    <div className={`dice-face ${rolling ? "dice-rolling" : "dice-settled"}`}>
      {DICE_FACES[display - 1]}
    </div>
  );
}

export function DiceRollDisplay({ values }: { values: number[] }) {
  return (
    <div>
      <p className="text-sm text-yellow-500/70 tracking-wider mb-3 text-center">✦ サイコロが転がっています ✦</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
        {values.map((v, i) => (
          <SingleDie key={i} value={v} index={i} />
        ))}
      </div>
    </div>
  );
}
