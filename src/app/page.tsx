import Link from "next/link";
import { LP_CONTENT } from "@/lib/lp-content";

export default function HomePage() {
  const c = LP_CONTENT;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">{c.siteName}</h1>
          <Link
            href="/diagnosis"
            className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {c.headerCta}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 whitespace-pre-line">
            {c.headline}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto whitespace-pre-line">
            {c.subheadline}
          </p>
          <Link
            href="/diagnosis"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors shadow-lg"
          >
            {c.heroCta}
          </Link>
          <p className="mt-4 text-sm text-gray-500">{c.heroNote}</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">{c.painTitle}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {c.pains.map((pain) => (
              <div
                key={pain.text}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{pain.emoji}</div>
                <p className="text-gray-700 text-sm font-medium">{pain.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-4">
            {c.siteName}で解決
          </h3>
          <p className="text-center text-gray-600 mb-12">
            採用せずに、すぐにプロの事務チームを導入できます
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "月額制で柔軟に利用", desc: "必要な分だけ、必要な期間だけ。固定費を抑えながら体制を強化できます。" },
              { title: "オンラインで完結", desc: "チャット・メール・クラウドツールで業務を遂行。オフィスに来る必要はありません。" },
              { title: "専任チームが対応", desc: "経験豊富なスタッフが貴社専任で対応。品質と継続性を担保します。" },
              { title: "すぐに開始可能", desc: "最短1週間で稼働開始。採用活動や研修は不要です。" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">料金プラン</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {c.plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border-2 ${
                  plan.popular
                    ? "border-primary-600 shadow-lg relative"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                    人気
                  </span>
                )}
                <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                <p className="text-3xl font-bold mb-4">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-primary-600 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            ※ 詳細は無料相談でご説明いたします
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">{c.ctaTitle}</h3>
          <p className="mb-8 text-primary-100">{c.ctaDescription}</p>
          <Link
            href="/diagnosis"
            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-50 transition-colors shadow-lg"
          >
            {c.ctaCta}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 {c.siteName}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/legal/tokushoho" className="hover:text-gray-700 transition-colors">
              特定商取引法に基づく表記
            </Link>
            <Link href="/diagnosis" className="hover:text-gray-700 transition-colors">
              無料診断
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
