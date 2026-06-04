import Link from "next/link";
import { PLANS } from "@/lib/stripe";

export const metadata = { title: "料金プラン | オンラインバックオフィス代行" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-3">PRICING</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2F5E]">選べる2つのプラン</h1>
          <p className="text-gray-500 text-sm mt-3">すべて税込 / 隠れコストなし</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
            const isStandard = key === "STANDARD";
            return (
              <div key={key}
                className={`rounded-2xl p-8 relative ${isStandard ? "bg-[#1A2F5E] text-white border-2 border-[#2B9BE4]" : "bg-white border border-gray-200"}`}>
                {isStandard && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B9BE4] text-white text-xs px-4 py-1 rounded-full font-bold">
                    ★ 推奨プラン
                  </span>
                )}
                {"initialFee" in plan && plan.initialFee > 0 && (
                  <p className="text-xs text-[#2B9BE4] mb-2">初期費用 ¥{plan.initialFee.toLocaleString()}（通常¥50,000→割引適用）</p>
                )}
                <p className={`text-xs font-bold tracking-wider mb-1 ${isStandard ? "text-[#2B9BE4]" : "text-[#2B9BE4]"}`}>{plan.name}</p>
                <p className={`text-xs mb-3 ${isStandard ? "text-gray-400" : "text-gray-500"}`}>{plan.nameJp}</p>
                <p className="text-3xl font-bold mb-1">
                  ¥{plan.price.toLocaleString()}
                  <span className={`text-sm font-normal ${isStandard ? "text-gray-400" : "text-gray-500"}`}>/月（税込）</span>
                </p>
                <div className={`mt-4 mb-4 pt-4 border-t ${isStandard ? "border-gray-700" : "border-gray-200"} grid grid-cols-2 gap-2 text-xs`}>
                  {[
                    ["稼働時間", `月${plan.hours}時間`],
                    ["最低期間", `${plan.minTermMonths}ヶ月〜`],
                    ["提供枠",   `月${plan.slots}社限定`],
                    ["時間単価", `¥${plan.unitPrice.toLocaleString()}/h`],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <span className={isStandard ? "text-gray-500" : "text-gray-400"}>{k}：</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`text-xs flex gap-2 ${isStandard ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="text-[#2B9BE4]">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <CheckoutButton planKey={key} isHighlight={isStandard} />
              </div>
            );
          })}
        </div>

        {/* 収益シミュレーション（事業者向け参考情報として非表示） */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-4">まずは無料相談からお気軽にどうぞ</p>
          <Link href="/diagnosis"
            className="inline-flex items-center gap-2 bg-[#1A2F5E] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2B9BE4] transition-colors text-sm">
            ▶ 無料診断を受ける（60秒）
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckoutButton({ planKey, isHighlight }: { planKey: string; isHighlight: boolean }) {
  return (
    <Link href={`/checkout?plan=${planKey}`}
      className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors ${
        isHighlight
          ? "bg-[#2B9BE4] text-white hover:bg-[#1a8fd1]"
          : "border border-gray-300 text-gray-700 hover:border-[#2B9BE4] hover:text-[#2B9BE4]"
      }`}>
      このプランで申し込む
    </Link>
  );
}