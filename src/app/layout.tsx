import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "世界の占い堂 - 15種類の占いで運命を読み解く",
  description: "タロット、星座、四柱推命、数秘術、易経、ルーン、おみくじ…世界中の占いが一堂に。完全無料で運命を占います。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} h-full`}>
      <head>
        {/* ルーン文字（Elder Futhark）はOSの標準フォントに収録されていないことが多く、
            文字化け（別のグリフへの代替表示）を起こすため、専用フォントを読み込む */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Noto Sans Runic', var(--font-serif-jp), 'Noto Serif JP', serif" }}
      >
        {children}
      </body>
    </html>
  );
}
