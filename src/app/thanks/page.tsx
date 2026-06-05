"use client";
import { useEffect } from "react";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/nakano-shoace/30min";

export default function ThanksPage() {
  useEffect(() => {
    // 送信完了後、3秒後にCalendlyへ自動遷移
    const timer = setTimeout(() => {
      window.location.href = CALENDLY_URL;
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ありがとうございます！
        </h1>
        <p className="text-gray-600 mb-2 text-sm">
          内容を受け付けました。確認メールをお送りします。
        </p>
        <p className="text-[#2B9BE4] font-medium text-sm mb-8">
          3秒後に日程調整ページへ移動します...
        </p>

        <a
          href={CALENDLY_URL}
          className="block w-full bg-[#1A2F5E] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#2B9BE4] transition-colors mb-4 text-sm"
        >
          📅 今すぐ日程を調整する（30分）
        </a>

        <Link
          href="/"
          className="inline-block text-xs text-gray-400 hover:text-gray-600"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
