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
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-serif-jp), 'Noto Serif JP', serif" }}
      >
        {children}
      </body>
    </html>
  );
}
