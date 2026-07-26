import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_Runic } from "next/font/google";
import { FORTUNES } from "@/lib/fortunes";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif-jp",
  display: "swap",
});

// ルーン文字（Elder Futhark）はOSの標準フォントに収録されていないことが多く、
// 文字化け（別のグリフへの代替表示）を起こすため専用フォントを読み込む。
// next/font経由にすることでビルド時に自己ホストされ、外部への追加リクエストが不要になる
const notoSansRunic = Noto_Sans_Runic({
  weight: ["400"],
  subsets: ["runic"],
  variable: "--font-runic",
  display: "swap",
});

export const metadata: Metadata = {
  title: `世界の占い堂 - ${FORTUNES.length}種類の占いで運命を読み解く`,
  description: "タロット、西洋占星術、四柱推命、数秘術、易経、ルーン、おみくじ…世界中の占いが一堂に。完全無料で運命を占います。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansRunic.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-runic), var(--font-serif-jp), 'Noto Serif JP', serif" }}
      >
        {children}
      </body>
    </html>
  );
}
