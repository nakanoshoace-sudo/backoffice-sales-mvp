import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-4">
          お申し込みありがとうございます！
        </h1>
        <p className="text-gray-600 mb-6">
          無料診断の結果は、ご登録いただいたメールアドレスに
          お送りいたします。
        </p>

        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary-800 font-medium mb-2">
            💡 すぐに相談したい方へ
          </p>
          <p className="text-sm text-primary-700">
            30分の無料相談で、貴社に最適な改善プランをご提案します。
          </p>
        </div>

        <Link
          href="/book"
          className="inline-block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-3"
        >
          無料相談を予約する
        </Link>

        <Link
          href="/"
          className="inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
