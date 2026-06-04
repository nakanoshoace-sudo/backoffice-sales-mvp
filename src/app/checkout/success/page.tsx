import Link from "next/link";
export const metadata = { title: "お申し込み完了 | オンラインバックオフィス代行" };
export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
        <h1 className="text-2xl font-bold text-[#1A2F5E] mb-3">お申し込みありがとうございます</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          ご登録のメールアドレスに確認メールをお送りしました。<br />
          24時間以内に担当者よりご連絡いたします。
        </p>
        <div className="bg-[#EBF8FF] rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-bold text-[#2B9BE4] mb-2">次のステップ</p>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex gap-2"><span className="text-[#2B9BE4]">1.</span>確認メールをご確認ください</li>
            <li className="flex gap-2"><span className="text-[#2B9BE4]">2.</span>担当者より業務棚卸しの日程調整をご連絡します</li>
            <li className="flex gap-2"><span className="text-[#2B9BE4]">3.</span>最短1週間で稼働開始します</li>
          </ul>
        </div>
        <Link href="/" className="text-sm text-[#2B9BE4] hover:underline">トップページに戻る</Link>
      </div>
    </div>
  );
}