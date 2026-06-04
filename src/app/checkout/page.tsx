"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { PLANS, type PlanKey } from "@/lib/stripe";

function CheckoutForm() {
  const params = useSearchParams();
  const planKey = (params.get("plan") ?? "STARTER") as PlanKey;
  const plan = PLANS[planKey] ?? PLANS.STARTER;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("メールアドレスを入力してください"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, email }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "エラーが発生しました");
        setLoading(false);
      }
    } catch {
      setError("通信エラーが発生しました。しばらく後に再度お試しください。");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Link href="/pricing" className="text-xs text-[#2B9BE4] hover:underline mb-6 inline-block">← プラン選択に戻る</Link>
          <h1 className="text-2xl font-bold text-[#1A2F5E] mb-2">お申し込み</h1>
          <div className="bg-[#EBF8FF] rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-[#2B9BE4] mb-1">{plan.name}</p>
            <p className="text-2xl font-bold text-[#1A2F5E]">
              ¥{plan.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/月（税込）</span>
            </p>
            {"initialFee" in plan && (plan as typeof PLANS.STANDARD).initialFee > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                + 初期費用 ¥{(plan as typeof PLANS.STANDARD).initialFee.toLocaleString()}（初回のみ）
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">最低利用期間：{plan.minTermMonths}ヶ月〜</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B9BE4] focus:ring-1 focus:ring-[#2B9BE4]"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#1A2F5E] text-white font-bold py-4 rounded-xl hover:bg-[#2B9BE4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? "Stripeへ移動中..." : "クレジットカードで申し込む →"}
            </button>
          </form>
          <div className="mt-6 space-y-2 text-xs text-gray-500">
            <p className="flex gap-2"><span>🔒</span>決済はStripeの安全な環境で処理されます</p>
            <p className="flex gap-2"><span>✓</span>カード情報は当サービスに保存されません</p>
            <p className="flex gap-2"><span>✓</span>適格請求書（インボイス）を自動発行</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">読み込み中...</p></div>}>
      <CheckoutForm />
    </Suspense>
  );
}