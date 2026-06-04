import Link from "next/link";
import { LP_CONTENT } from "@/lib/lp-content";
import { DiagnosisQuiz } from "@/components/lp/DiagnosisQuiz";

const PAINS = [
  { e:"😩", t:"事務作業に追われて本業に集中できない" },
  { e:"📊", t:"請求書・経理処理に毎月数時間とられる" },
  { e:"👤", t:"担当者が辞めたら業務が回らなくなる" },
  { e:"💸", t:"正社員を雇うほどの業務量ではない" },
  { e:"⏰", t:"社長が全部やっている状態をなんとかしたい" },
  { e:"😰", t:"バックオフィスが属人化・ブラックボックス化している" },
];
const SOLUTIONS = [
  { icon: "💼", title: "月額制で柔軟に利用",   desc: "必要な分だけ・必要な期間だけ。固定費を抑えながら体制を強化。" },
  { icon: "🌐", title: "オンラインで完結",      desc: "チャット・メール・クラウドツールで業務遂行。来社不要。" },
  { icon: "👥", title: "専任チームが対応",      desc: "経験豊富なスタッフが貴社専任で対応。品質と継続性を担保。" },
  { icon: "⚡", title: "最短1週間で稼働開始",   desc: "採用・研修不要。すぐにプロのバックオフィス体制を構築。" },
];

const FAQS = [
  { q: "何を任せればいいかわかりません", a: "初回に業務棚卸しをご一緒します。まずはご相談ください。" },
  { q: "情報漏洩・セキュリティが心配", a: "NDA締結・クラウドセキュリティ対応済み。安心してお任せください。" },
  { q: "すぐに解約できますか？", a: "STARTERは1ヶ月〜、STANDARDは3ヶ月〜。合わなければ解約できます。" },
  { q: "品質が安定するか不安", a: "専任担当制＋週次レポートで品質を可視化。担当者変更にも対応します。" },
];
export default function HomePage() {
  const c = LP_CONTENT;
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">{c.siteName}</span>
          <Link href="/diagnosis"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors">
            {c.headerCta}
          </Link>
        </div>
      </header>

      {/* S1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] pt-14"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-[.3em] text-yellow-500 mb-8">{c.heroEyebrow}</p>
          <h1 className="font-bold leading-tight mb-8">
            <span className="block text-2xl md:text-4xl text-white">{c.heroHeadline1}</span>
            <span className="block text-6xl md:text-9xl text-yellow-500 my-2">{c.heroHeadline2}</span>
            <span className="block text-2xl md:text-4xl text-white">{c.heroHeadline3}</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-10 whitespace-pre-line leading-relaxed">{c.heroSub}</p>
          <Link href="#diagnosis"
            className="inline-block border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-lg font-bold text-sm hover:bg-yellow-500 hover:text-black transition-all">
            {c.heroCta}
          </Link>
          <p className="mt-4 text-xs text-gray-600">{c.heroCtaNote}</p>
        </div>
      </section>
      {/* S2: Pain Points */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">PAIN POINTS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            あなたも、こんな状況ではないですか？
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PAINS.map((pain) => (
              <div key={pain.t} className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">{pain.e}</div>
                <p className="text-gray-700 text-xs md:text-sm font-medium leading-snug">{pain.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Diagnosis */}
      <section id="diagnosis" className="py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-500 text-center mb-3">FREE DIAGNOSIS</p>
          <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-3">{c.diagnosisTitle}</h2>
          <p className="text-gray-400 text-sm text-center mb-10">{c.diagnosisSub}</p>
          <DiagnosisQuiz />
        </div>
      </section>

      {/* S4: Solution */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">WHY CHOOSE US</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">選ばれる理由 — 4つの強み</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {SOLUTIONS.map((s) => (
              <div key={s.title} className="flex gap-4 bg-gray-50 rounded-xl p-6">
                <div className="text-3xl flex-shrink-0">{s.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* S5: Case Studies */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">CASE STUDIES</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">導入事例</h2>
          <div className="space-y-8">
            {c.cases.map((cs) => (
              <div key={cs.name} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
                  <span className="text-white text-sm font-bold">{cs.name}</span>
                  <span className="text-gray-400 text-xs">{cs.revenue}</span>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div className="p-6">
                    <p className="text-xs font-bold text-red-500 mb-3">BEFORE</p>
                    <ul className="space-y-2">
                      {cs.before.map((b) => <li key={b} className="text-gray-600 text-sm flex gap-2"><span className="text-red-400">✗</span>{b}</li>)}
                    </ul>
                  </div>
                  <div className="p-6 bg-green-50">
                    <p className="text-xs font-bold text-green-600 mb-3">AFTER（導入2ヶ月後）</p>
                    <ul className="space-y-2">
                      {cs.after.map((a) => <li key={a} className="text-gray-700 text-sm flex gap-2"><span className="text-green-500">✓</span>{a}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-gray-600 text-sm italic">&ldquo;{cs.quote}&rdquo;</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                    <span className="text-xs text-gray-400">導入プラン：{cs.plan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* S6: Cost Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">COST COMPARISON</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">なぜ月8万円が「安い」のか？</h2>
          <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-xl overflow-hidden text-sm">
            {[
              { name: "正社員採用", items: ["基本給：25万円", "社保料：4万円", "採用費：6万円"], total: "月35万円", highlight: false },
              { name: "単発外注",   items: ["都度見積もり",   "品質にバラつき",  "継続性なし"],    total: "不安定・高額", highlight: false },
              { name: "★当サービス", items: ["月額：8万円",   "品質保証あり",   "専属チーム対応"], total: "月8万円",    highlight: true },
            ].map((col) => (
              <div key={col.name} className={`${col.highlight ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}>
                <div className={`px-4 py-3 text-center font-bold border-b ${col.highlight ? "border-gray-700 text-yellow-400" : "border-gray-200 text-gray-900"}`}>
                  {col.name}
                </div>
                <div className="px-4 py-4 space-y-2">
                  {col.items.map((item) => <p key={item} className={`text-xs ${col.highlight ? "text-gray-300" : "text-gray-600"}`}>{item}</p>)}
                </div>
                <div className={`px-4 py-3 text-center font-bold border-t text-sm ${col.highlight ? "border-gray-700 text-yellow-400" : "border-gray-200 text-gray-900"}`}>
                  {col.total}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-gray-700">
            <p className="font-bold mb-2">📊 ROI シミュレーション（時給5,000円換算）</p>
            <p>時間価値創出：50時間削減 × 5,000円 = <strong>250,000円/月</strong></p>
            <p>純利益：250,000円 − 80,000円 = <strong className="text-green-700">170,000円/月</strong></p>
            <p className="mt-2 text-xs text-gray-500">年間換算：約 <strong>2,040,000円</strong> の価値創出</p>
          </div>
        </div>
      </section>
      {/* S7: Plans */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">PRICING</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">選べる2つのプラン</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {c.plans.map((plan) => (
              <div key={plan.name}
                className={`rounded-xl p-6 relative ${plan.popular ? "bg-gray-900 border-2 border-yellow-500 text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs px-4 py-1 rounded-full font-bold">
                    ★ 推奨
                  </span>
                )}
                {plan.initFee && (
                  <p className="text-xs text-yellow-400 mb-2">{plan.initFee}</p>
                )}
                <p className="text-xs font-bold tracking-wider mb-1 text-yellow-500">{plan.name}</p>
                <p className={`text-xs mb-3 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.nameJp}</p>
                <p className="text-3xl font-bold mb-1">
                  {plan.price}<span className={`text-sm font-normal ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>
                </p>
                <div className={`mt-4 mb-4 pt-4 border-t ${plan.popular ? "border-gray-700" : "border-gray-200"} grid grid-cols-2 gap-2 text-xs`}>
                  {[["稼働時間", plan.hours], ["最低期間", plan.minTerm], ["提供枠", plan.slots], ["時間単価", plan.unitPrice]].map(([k, v]) => (
                    <div key={k}>
                      <span className={plan.popular ? "text-gray-500" : "text-gray-400"}>{k}：</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-xs flex gap-2 ${plan.popular ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="text-yellow-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/diagnosis"
                  className={`block w-full text-center py-3 rounded-lg font-bold text-sm transition-colors ${plan.popular ? "bg-yellow-500 text-black hover:bg-yellow-400" : "border border-gray-300 text-gray-700 hover:border-gray-500"}`}>
                  無料相談を申し込む
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-xs text-gray-400">※ 詳細は無料相談でご説明いたします</p>
        </div>
      </section>
      {/* S8: FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-yellow-600 text-center mb-3">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">よくある不安と回答</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <p className="font-bold text-gray-900 text-sm mb-2">Q. {faq.q}</p>
                <p className="text-gray-600 text-sm">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8b: Scarcity */}
      <section className="py-10 px-4 bg-yellow-500">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-black font-bold text-sm md:text-base">
            ⚠ 現在の受付状況：STANDARD プラン 残り <strong>2枠</strong> ／ STARTER プラン 残り <strong>1枠</strong>
          </p>
          <p className="text-black/70 text-xs mt-1">※ 枠が埋まり次第、翌月以降のご案内となります</p>
        </div>
      </section>
      {/* S9: Final CTA */}
      <section className="py-24 px-4 bg-[#0A0A0A]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
            {c.finalCtaTitle1}<br />{c.finalCtaTitle2}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{c.finalCtaNote}</p>
          <ul className="space-y-2 mb-10 inline-block text-left">
            {c.finalCtaPoints.map((pt) => (
              <li key={pt} className="text-gray-300 text-sm flex gap-2">
                <span className="text-yellow-500 font-bold">✓</span>{pt}
              </li>
            ))}
          </ul>
          <div>
            <Link href="/diagnosis"
              className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-lg font-bold text-base hover:bg-yellow-400 transition-colors shadow-lg">
              {c.finalCta}
            </Link>
          </div>
          <div className="mt-8 text-xs text-gray-600 space-y-1">
            <p>※ 24時間以内にご連絡いたします</p>
            <p>※ しつこい営業・勧誘は一切ありません</p>
            <p>Contact: <a href={`mailto:${c.contactEmail}`} className="text-gray-400 hover:text-gray-300">{c.contactEmail}</a></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2024 {c.siteName}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">プライバシーポリシー</Link>
            <Link href="/legal/tokushoho" className="hover:text-gray-400 transition-colors">特定商取引法に基づく表記</Link>
            <Link href="/diagnosis" className="hover:text-gray-400 transition-colors">無料診断</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}