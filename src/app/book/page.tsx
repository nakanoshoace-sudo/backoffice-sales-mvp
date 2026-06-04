"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BookPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <BookPage />
    </Suspense>
  );
}

function BookPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead_id") || "";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  const [formData, setFormData] = useState({
    meeting_at: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Calendly URL が設定されている場合は外部リンク
  if (calendlyUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">無料相談の予約</h1>
          <p className="text-gray-600 mb-6">
            下記のリンクから、ご都合の良い日時をお選びください。
            30分のオンライン面談です。
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            予約ページを開く（Calendly）
          </a>
          <Link
            href="/"
            className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  // Calendly 未設定時は簡易フォーム
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.meeting_at) {
      setError("希望日時を選択してください");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId || undefined,
          booking_source: "form",
          meeting_at: formData.meeting_at,
          note: formData.note,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "予約に失敗しました");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("通信エラーが発生しました");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4">予約が完了しました！</h1>
          <p className="text-gray-600 mb-6">
            ご予約ありがとうございます。確認メールをお送りいたします。
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-primary-600 hover:text-primary-700"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">無料相談の予約</h1>
        <p className="text-gray-600 mb-6 text-center text-sm">
          30分のオンライン面談で、貴社に最適な改善プランをご提案します。
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              希望日時 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.meeting_at}
              onChange={(e) => setFormData({ ...formData, meeting_at: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              事前に伝えたいこと（任意）
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="特に相談したいことがあればご記入ください"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            予約する
          </button>
        </form>

        <Link
          href="/"
          className="block mt-4 text-center text-sm text-gray-500 hover:text-gray-700"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
