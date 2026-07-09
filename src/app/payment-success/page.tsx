"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    async function pollForToken() {
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const res = await fetch(`/api/payment-confirm?session_id=${sessionId}`);
        const data = await res.json();
        if (data.loggedIn) {
          // Cookieはサーバー側で既にセット済み
          setStatus("ok");
          setTimeout(() => { window.location.href = "/"; }, 2000);
          return;
        }
      }
      setStatus("error");
    }
    pollForToken();
  }, [sessionId, router]);

  return (
    <div className="mystical-bg min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {status === "loading" && (
        <div>
          <div className="text-5xl mb-6 animate-pulse">🔮</div>
          <p className="gold-text text-xl font-bold mb-2">決済を確認中...</p>
          <p className="text-gray-400 text-sm">しばらくお待ちください</p>
        </div>
      )}
      {status === "ok" && (
        <div>
          <div className="text-5xl mb-6">✨</div>
          <p className="gold-text text-2xl font-bold mb-2">ご登録ありがとうございます！</p>
          <p className="text-gray-400 text-sm">世界の占い堂へようこそ</p>
          <p className="text-gray-500 text-xs mt-4">自動的にトップページへ移動します...</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <div className="text-5xl mb-6">⚠️</div>
          <p className="text-red-400 text-xl font-bold mb-2">確認に時間がかかっています</p>
          <p className="text-gray-400 text-sm mb-4">登録メールアドレスでログインをお試しください</p>
          <button
            onClick={() => router.push("/gate")}
            className="bg-yellow-500/20 text-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500/30 transition"
          >
            ログインページへ
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
