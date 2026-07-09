import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mystical-bg min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-yellow-500/60 text-sm hover:text-yellow-500 transition mb-8 inline-block">← 世界の占い堂に戻る</Link>
        <h1 className="text-2xl font-bold gold-text mb-2">利用規約</h1>
        <p className="text-gray-500 text-sm mb-8">最終更新：2026年6月27日</p>
        <div className="card-mystical rounded-xl p-8 space-y-8 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第1条（適用）</h2>
            <p>本規約は、神原亜希（以下「当方」）が提供する「世界の占い堂」（以下「本サービス」）の利用に関して、ユーザーと当方の間に適用されます。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第2条（会員登録）</h2>
            <p>メールアドレスを登録することで会員となります。先着30名は永久無料プランが適用されます。31名目以降は月額¥980（税込）の有料プランへの加入が必要です。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第3条（料金・決済）</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>有料プランの料金は月額¥980（税込）です。</li>
              <li>ご契約日から1ヶ月ごとに自動更新されます。</li>
              <li>決済はStripe Inc.を通じて処理されます。</li>
              <li>解約後は当該契約期間の終了日までご利用いただけます。</li>
              <li>期間途中の返金・日割り計算は行いません。</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第4条（禁止事項）</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>本サービスのコンテンツの無断複製・転載・販売</li>
              <li>アカウントの第三者への譲渡・貸与</li>
              <li>本サービスの運営を妨げる行為</li>
              <li>法令または公序良俗に反する行為</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第5条（免責事項）</h2>
            <p>本サービスは娯楽・自己探求を目的としたコンテンツです。占い結果に基づく行動・判断に関して、当方は一切の責任を負いません。本サービスで提供する情報は占いであり、医療・法律・金融等の専門的助言ではありません。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第6条（サービスの変更・停止）</h2>
            <p>当方は予告なく本サービスの内容を変更・停止することがあります。これにより生じた損害について当方は責任を負いません。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第7条（知的財産権）</h2>
            <p>本サービスのコンテンツ（テキスト・デザイン・プログラム）の著作権は当方に帰属します。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第8条（準拠法・管轄）</h2>
            <p>本規約は日本法を準拠法とし、訴訟は京都地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>
          <section>
            <h2 className="text-base font-bold gold-text mb-3">第9条（お問い合わせ）</h2>
            <p>akika.rainbow@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
