"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function GateContent() {
  const params = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    if (params.get("canceled")) setError("決済がキャンセルされました。もう一度お試しください。");
    if (params.get("error")) setError("Googleログインに失敗しました。もう一度お試しください。");
    if (params.get("expired")) setError("サブスクリプションが無効です。ログインして再開してください。");
    if (params.get("overdue")) {
      setError("お支払いが確認できず、ご利用を停止しています。お支払い情報を更新してください。");
      setShowBilling(true);
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    const endpoint = mode === "login" ? "/api/login" : "/api/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    if (data.loggedIn) {
      window.location.href = "/";
      return;
    }
    setError(data.error || "うまくいきませんでした。もう一度お試しください。");
  }

  return (
    <div className="mystical-bg min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-yellow-500/60 text-sm tracking-[0.4em] mb-3">WORLD DIVINATION</p>
          <h1 className="text-4xl font-bold gold-gradient mb-3">世界の占い堂</h1>
          <p className="text-gray-400 text-sm">古代の叡智で、あなたの運命を紐解く</p>
        </div>

        <div className="card-mystical rounded-2xl p-8">
          {/* タブ */}
          <div className="flex bg-white/5 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "login" ? "bg-yellow-500/20 text-yellow-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "signup" ? "bg-yellow-500/20 text-yellow-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              新規登録
            </button>
          </div>

          {mode === "signup" && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-2">
                <span className="text-yellow-400 text-sm font-medium">先着30名 永久無料</span>
              </div>
              <p className="text-gray-400 text-sm">31名目以降は月額 <span className="gold-text font-bold">¥980</span></p>
            </div>
          )}

          {showBilling && (
            <a
              href="/api/billing-portal"
              className="block w-full text-center bg-red-500/15 border border-red-500/30 text-red-300 font-medium py-3 rounded-lg hover:bg-red-500/25 transition mb-4"
            >
              お支払い情報を更新する →
            </a>
          )}

          {/* Googleログイン */}
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 transition mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Googleで{mode === "login" ? "ログイン" : "登録"}
          </a>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">または</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* メール＋パスワード */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">パスワード{mode === "signup" && "（8文字以上）"}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-gray-300"
                >
                  {showPw ? "隠す" : "表示"}
                </button>
              </div>
            </div>
            {info && <p className="text-yellow-400 text-sm">{info}</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "処理中..." : mode === "login" ? "ログイン →" : "登録して占いを始める →"}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            {mode === "login" ? (
              <>はじめての方は <button onClick={() => { setMode("signup"); setError(""); }} className="text-yellow-500/80 hover:text-yellow-400">新規登録</button> へ</>
            ) : (
              <>登録済みの方は <button onClick={() => { setMode("login"); setError(""); }} className="text-yellow-500/80 hover:text-yellow-400">ログイン</button> へ</>
            )}
          </p>
        </div>

        <div className="flex justify-center gap-4 text-xs text-gray-600 mt-6">
          <Link href="/legal/tokusho" className="hover:text-gray-400 transition">特商法</Link>
          <span>·</span>
          <Link href="/legal/privacy" className="hover:text-gray-400 transition">プライバシーポリシー</Link>
          <span>·</span>
          <Link href="/legal/terms" className="hover:text-gray-400 transition">利用規約</Link>
        </div>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense>
      <GateContent />
    </Suspense>
  );
}
