import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mystical-bg min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-yellow-500/60 text-sm hover:text-yellow-500 transition mb-8 inline-block">← 世界の占い堂に戻る</Link>
        <h1 className="text-2xl font-bold gold-text mb-2">プライバシーポリシー</h1>
        <p className="text-gray-500 text-sm mb-8">最終更新：2026年6月27日</p>
        <div className="card-mystical rounded-xl p-8 space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold gold-text mb-3">1. 事業者情報</h2>
            <p>神原亜希（以下「当方」）は、世界の占い堂（以下「本サービス」）を運営するにあたり、利用者の個人情報を適切に管理します。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">2. 取得する情報</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>メールアドレス（登録・ログイン用）</li>
              <li>決済情報（Stripeを通じて処理。当方はカード情報を保持しません）</li>
              <li>サービス利用状況（アクセスログ）</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">3. 利用目的</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>本サービスの提供・運営</li>
              <li>サービスに関するお知らせの送付</li>
              <li>お問い合わせへの対応</li>
              <li>サービスの改善・統計分析</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">4. 第三者への提供</h2>
            <p>当方は、法令に基づく場合を除き、利用者の同意なく第三者に個人情報を提供しません。なお、決済処理のためStripe Inc.に必要な情報を提供します。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">5. 個人情報の管理</h2>
            <p>取得した個人情報はSupabase（PostgreSQL）に暗号化して保存し、不正アクセスの防止に努めます。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">6. Cookie・アクセストークン</h2>
            <p>本サービスはログイン状態の維持のためにCookieを使用します。ブラウザの設定でCookieを無効にした場合、本サービスをご利用いただけません。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">7. 開示・訂正・削除</h2>
            <p>ご自身の個人情報の開示・訂正・削除をご希望の場合は、下記お問い合わせ先までご連絡ください。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">8. お問い合わせ</h2>
            <p>akika.rainbow@gmail.com</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">9. 改定</h2>
            <p>本ポリシーは必要に応じて改定することがあります。重要な変更の場合はサービス上でお知らせします。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
