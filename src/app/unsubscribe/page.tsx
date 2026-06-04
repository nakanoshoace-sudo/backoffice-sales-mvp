"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-xl font-bold mb-4 text-gray-900">配信を停止しました</h1>
          <p className="text-gray-600 mb-6">
            今後、メールの配信は行いません。<br />
            再度の配信をご希望の場合は、お問い合わせください。
          </p>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold mb-4 text-gray-900">配信停止</h1>
        <p className="text-gray-600 mb-6">
          配信停止の処理中にエラーが発生したか、<br />
          リンクが無効です。
        </p>
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">処理中...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
