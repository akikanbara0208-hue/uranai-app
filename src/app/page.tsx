"use client";

import Link from "next/link";
import { FORTUNES, FORTUNE_CATEGORIES } from "@/lib/fortunes";
import { Fortune } from "@/lib/types";

function FortuneCard({ fortune }: { fortune: Fortune }) {
  const cat = FORTUNE_CATEGORIES[fortune.category];
  return (
    <Link href={`/fortune/${fortune.id}`}>
      <div className="card-mystical rounded-xl p-5 h-full flex flex-col gap-3 cursor-pointer">
        <div className="flex items-start justify-between">
          <span className="text-4xl">{fortune.icon}</span>
          <span className={`category-badge category-${cat.color}`}>{cat.label}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold gold-text">{fortune.name}</h3>
          <p className="text-xs text-purple-300 mt-0.5">{fortune.nameEn}</p>
        </div>
        <p className="text-sm text-gray-300 flex-1 leading-relaxed">{fortune.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
          <span className="text-xs text-gray-500">起源：{fortune.origin}</span>
          <span className="text-xs gold-text">占う →</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const categoryKeys = Object.keys(FORTUNE_CATEGORIES) as (keyof typeof FORTUNE_CATEGORIES)[];

  return (
    <div className="mystical-bg">
      <header className="relative text-center py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          {["✦", "✧", "★", "✦", "✧", "☆", "✦", "✧", "★"].map((s, i) => (
            <span
              key={i}
              className="absolute text-yellow-500/20 text-xs"
              style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-yellow-500/60 text-sm tracking-[0.4em] mb-4">WORLD DIVINATION</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gold-gradient">世界の占い堂</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            古代より世界中で受け継がれてきた叡智の数々。
            <br />
            {FORTUNES.length}種類の占いで、あなたの過去・現在・未来を紐解きます。
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
            <span className="text-yellow-500/60 text-xl">☽ ✦ ☾</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {categoryKeys.map((catKey) => {
          const fortunes = FORTUNES.filter((f) => f.category === catKey);
          const cat = FORTUNE_CATEGORIES[catKey];
          return (
            <section key={catKey} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className={`category-badge category-${cat.color} text-sm px-3 py-1`}>
                  {cat.label}
                </span>
                <span className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fortunes.map((fortune) => (
                  <FortuneCard key={fortune.id} fortune={fortune} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-white/5">
        <p>世界の占い堂 — 娯楽・自己探求のためのコンテンツです</p>
      </footer>
    </div>
  );
}
