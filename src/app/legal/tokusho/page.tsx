import Link from "next/link";

const ITEMS = [
  ["販売事業者", "神原亜希"],
  ["所在地", "〒606-8127 京都府京都市左京区一条寺西浦畑町12－2 サニーフィールド202"],
  ["電話番号", "090-7875-1148"],
  ["メールアドレス", "akika.rainbow@gmail.com"],
  ["販売価格", "月額 ¥980（税込）"],
  ["支払い方法", "クレジットカード（Visa・Mastercard・American Express・JCB）"],
  ["支払い時期", "ご契約日から1ヶ月ごとに自動更新・自動請求"],
  ["サービス提供時期", "決済完了後、即時ご利用いただけます"],
  ["解約・返品について", "マイページからいつでも解約できます。解約後は当該契約期間の終了日までご利用いただけます。期間途中の返金・日割り計算はありません。"],
  ["推奨環境", "最新版のGoogle Chrome・Safari・Microsoft Edge（JavaScript有効）"],
];

export default function TokushoPage() {
  return (
    <div className="mystical-bg min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-yellow-500/60 text-sm hover:text-yellow-500 transition mb-8 inline-block">← 世界の占い堂に戻る</Link>
        <h1 className="text-2xl font-bold gold-text mb-8">特定商取引法に基づく表記</h1>
        <div className="card-mystical rounded-xl overflow-hidden">
          {ITEMS.map(([label, value]) => (
            <div key={label} className="flex flex-col sm:flex-row border-b border-white/5 last:border-0">
              <div className="w-full sm:w-44 px-6 py-4 text-gray-400 text-sm shrink-0 bg-white/2">{label}</div>
              <div className="flex-1 px-6 py-4 text-gray-200 text-sm leading-relaxed">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
