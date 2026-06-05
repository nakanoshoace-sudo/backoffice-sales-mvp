import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LP_CONTENT } from "@/lib/lp-content";
import { DiagnosisQuiz } from "@/components/lp/DiagnosisQuiz";

const STEPS = [
  { n: "01", title: "業務の棚卸し（無料相談）", desc: "30分のヒアリングで現状の業務を整理。「これは任せられる」が明確になります。" },
  { n: "02", title: "専任スタッフをアサイン", desc: "業務内容に合わせて担当者を選定。専門性の高いスタッフが対応します。" },
  { n: "03", title: "最短1週間で稼働開始", desc: "ツール・ルーティン・引き継ぎは不要。すぐに本業に集中できる環境を作ります。" },
];

const POINTS = [
  {
    label: "POINT 01", side: "right",
    title: "業務まるごと任せる「右腕チーム」",
    desc: "専任担当がコロコロ変わる心配なし。専任スタッフ＋バックアップの体制で安心して任せられます。",
    checks: ["専任管理1名＋サポートチームの後ろ盾", "担当者変更・引継ぎコストゼロ", "Slackでの即時相談対応"],
    visual: "ui",
  },
  {
    label: "POINT 02", side: "left",
    title: "週次レポートで業務が「見える化」",
    desc: "週10分で状況を把握。「何をやってもらっているか分からない」を解消します。",
    checks: ["週次レポートを毎週月曜に提供", "進行タスク・納品済み・今週予定一覧", "コスト削減レポート付き"],
    visual: "person",
  },
  {
    label: "POINT 03", side: "right",
    title: "シンプルな2プランで迷わず始められる",
    desc: "複雑な料金体系は一切なし。業務量に合わせてSTARTERかSTANDARDを選ぶだけ。",
    checks: ["STARTER ¥45,000/月（月12h）", "STANDARD ¥80,000/月（月25h）", "最短1ヶ月から試せる"],
    visual: "plan",
  },
  {
    label: "POINT 04", side: "left",
    title: "安心のセキュリティ・情報管理体制",
    desc: "NDA締結・データ管理を徹底。大切な情報を安全に扱います。",
    checks: ["入社時NDA締結必須", "クラウドツールのアクセス権限管理", "月次セキュリティレポート"],
    visual: "team",
  },
];

const FAQS = [
  { q: "本当に1週間で始められますか？", a: "はい。初回ヒアリング後、業務内容に応じたスタッフをアサインし、最短5営業日で稼働開始します。" },
  { q: "途中で解約できますか？", a: "STARTERは1ヶ月、STANDARDは3ヶ月の最低契約後、月末10営業日前にご連絡で解約可能です。" },
  { q: "どんな業務を依頼できますか？", a: "経理・請求書処理・経費精算・総務対応・秘書業務・スケジュール管理など。詳細は無料診断でご確認ください。" },
  { q: "セキュリティは大丈夫ですか？", a: "全スタッフとNDA締結済み。クラウドツールのアクセス権限管理・月次レポートで情報管理を徹底しています。" },
  { q: "料金以外に費用はかかりますか？", a: "STANDARDプランのみ初期費用¥30,000（通常¥50,000）がかかります。それ以外の追加費用は発生前に必ずお見積もりをご提示します。" },
];

const TRUSTS = [
  { icon: "🔒", text: "NDA・秘密保持契約締結" },
  { icon: "✅", text: "専任担当制（コロコロ変わらない）" },
  { icon: "📊", text: "週次レポートで透明性確保" },
  { icon: "🇯🇵", text: "日本人スタッフのみ対応" },
];

const CALENDLY_URL = "https://calendly.com/nakano-shoace/30min";

function DashboardMock() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-left">
      <div className="bg-[#1A2F5E] px-4 py-3 flex items-center gap-2">
        <span className="text-white text-sm font-bold">📊 バックオフィスダッシュボード</span>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100">
        {[
          { label: "今月の処理件数", value: "47件", color: "text-[#2B9BE4]" },
          { label: "削減時間", value: "32h", color: "text-green-500" },
          { label: "対応ステータス", value: "完了 ✓", color: "text-[#1A2F5E]" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#EBF8FF] rounded-xl p-2 text-center">
            <p className="text-xs text-gray-500 mb-1 leading-tight">{kpi.label}</p>
            <p className={`text-sm font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs font-bold text-gray-500 mb-2">最近のタスク</p>
        {[
          { task: "請求書処理（12件）", status: "完了", color: "text-green-500" },
          { task: "経費精算レポート", status: "提出済み", color: "text-green-500" },
          { task: "来月スケジュール調整", status: "完了", color: "text-green-500" },
        ].map((item) => (
          <div key={item.task} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span className="text-gray-700">{item.task}</span>
            <span className={`font-medium ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanMock() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-5 bg-white">
          <div className="text-xs font-bold text-[#2B9BE4] uppercase tracking-wider mb-2">STARTER</div>
          <div className="text-xl font-bold text-[#1A2F5E] mb-1">¥45,000<span className="text-xs font-normal text-gray-500">/月</span></div>
          <div className="text-xs text-gray-500 mb-3">1ヶ月〜 / 月12時間</div>
          <ul className="space-y-1.5 text-xs text-gray-600">
            {["経理・請求メイン", "専任担当1名", "週次レポート", "チャットサポート"].map((f) => (
              <li key={f} className="flex gap-1.5 items-start"><span className="text-green-500 mt-0.5">✓</span>{f}</li>
            ))}
          </ul>
        </div>
        <div className="p-5 bg-[#1A2F5E] text-white relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B9BE4] text-white text-xs px-4 py-1 rounded-full font-bold whitespace-nowrap">★ 推奨</span>
          <div className="text-xs font-bold text-[#2B9BE4] uppercase tracking-wider mb-2">STANDARD</div>
          <div className="text-xl font-bold text-white mb-1">¥80,000<span className="text-xs font-normal text-gray-400">/月</span></div>
          <div className="text-xs text-gray-400 mb-3">3ヶ月〜 / 月25時間</div>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {["4カテゴリ全対応", "専任＋サポート体制", "月次レポート提供", "Slack即時相談"].map((f) => (
              <li key={f} className="flex gap-1.5 items-start"><span className="text-[#2B9BE4] mt-0.5">✓</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-5 py-2.5 bg-gray-50 text-xs text-center text-gray-500 border-t border-gray-100">
        ※ 詳細は無料相談でご説明いたします
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-[#1A2F5E]">オンラインバックオフィス</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#2B9BE4] transition-colors">特徴</a>
            <a href="#pricing" className="hover:text-[#2B9BE4] transition-colors">料金</a>
            <a href="#faq" className="hover:text-[#2B9BE4] transition-colors">よくある質問</a>
          </nav>
          <Link href="/diagnosis" className="bg-[#2B9BE4] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#1a8fd1] transition-colors">
            無料診断を受ける
          </Link>
        </div>
      </header>

      {/* FV */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-[#EBF8FF] to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-4">ONLINE BACK OFFICE</span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1A2F5E] leading-tight mb-4">
              社長の仕事を、<br />もっと本質的に。
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
              経理・請求・総務・秘書をまるごと代行。<br className="hidden md:block" />
              1人社長・スタートアップに特化したバックオフィス支援。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/diagnosis" className="inline-flex items-center justify-center gap-2 bg-[#1A2F5E] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#2B9BE4] transition-colors text-sm">
                ▶ 60秒で無料診断する
              </Link>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-[#2B9BE4] text-[#2B9BE4] font-bold px-6 py-4 rounded-xl hover:bg-[#EBF8FF] transition-colors text-sm">
                📅 日程を予約する
              </a>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <DashboardMock />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-12 px-4 bg-[#EBF8FF]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "150+", label: "導入企業累計" },
            { value: "月32h", label: "平均削減時間" },
            { value: "98%", label: "継続率" },
          ].map((m) => (
            <div key={m.label}>
              <p className="text-3xl md:text-4xl font-bold text-[#1A2F5E]">{m.value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-[#1A2F5E]" style={{ clipPath: "polygon(0 4%,100% 0,100% 96%,0 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-3">PAIN POINTS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">こんな状況、ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "請求・経費処理に毎月10時間以上かかっている",
              "総務・人事の対応で本業に集中できない",
              "採用コストをかけずに即戦力がほしい",
            ].map((pain) => (
              <div key={pain} className="bg-white/10 rounded-xl p-5 text-left">
                <span className="text-2xl mb-3 block">😓</span>
                <p className="text-white text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-3">SOLUTION</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A2F5E]">最短1週間で、プロのバックオフィスチームが稼動</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center p-6 rounded-2xl bg-[#F7F8FA]">
                <div className="w-12 h-12 rounded-full bg-[#2B9BE4] text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                  {step.n}
                </div>
                <h3 className="font-bold text-[#1A2F5E] mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POINTS */}
      {POINTS.map((pt, idx) => (
        <section key={pt.label} id={idx === 2 ? "pricing" : undefined} className={`py-16 px-4 ${idx % 2 === 0 ? "bg-white" : "bg-[#F7F8FA]"}`}>
          <div className="max-w-5xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-8 items-center ${pt.side === "left" ? "md:flex-row-reverse" : ""}`}>
              <div className={pt.side === "left" ? "md:order-2" : ""}>
                <p className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-2">{pt.label}</p>
                <h2 className="text-xl md:text-2xl font-bold text-[#1A2F5E] mb-4">{pt.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{pt.desc}</p>
                <ul className="space-y-2">
                  {pt.checks.map((c) => (
                    <li key={c} className="flex gap-2 items-start text-sm text-gray-700">
                      <span className="text-[#2B9BE4] mt-0.5 shrink-0">✓</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={pt.side === "left" ? "md:order-1" : ""}>
                {pt.visual === "ui" && <DashboardMock />}
                {pt.visual === "plan" && <PlanMock />}
                {pt.visual === "person" && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                    <Image src="/images/client-report.jpg" alt="週次レポート確認" fill className="object-cover" />
                  </div>
                )}
                {pt.visual === "team" && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                    <Image src="/images/team-security.jpg" alt="チームでの情報管理" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Trust */}
      <section className="py-16 px-4 bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-3">TRUST</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A2F5E]">安心してお任せいただける理由</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {TRUSTS.map((t) => (
              <div key={t.text} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <span className="text-3xl block mb-3">{t.icon}</span>
                <p className="text-xs font-medium text-gray-700 leading-snug">{t.text}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div id="faq">
            <h2 className="text-xl md:text-2xl font-bold text-[#1A2F5E] text-center mb-8">よくある質問</h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="bg-white rounded-xl p-5 shadow-sm group">
                  <summary className="font-medium text-[#1A2F5E] cursor-pointer text-sm list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-[#2B9BE4] ml-2 shrink-0">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Quiz */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
            <DiagnosisQuiz />
          </Suspense>
        </div>
      </section>

      {/* Closing CTA */}
      <section id="cta" className="py-20 px-4" style={{ background: "linear-gradient(135deg, #1A2F5E 0%, #2B9BE4 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            まず60秒、無料診断を受けてみませんか？
          </h2>
          <p className="text-sm text-blue-100 mb-8 leading-relaxed">
            個人情報は不要。あなたのバックオフィスの課題を今すぐ確認できます。
          </p>
          <Link href="/diagnosis" className="inline-flex items-center justify-center gap-2 bg-white text-[#1A2F5E] font-bold px-8 py-4 rounded-xl hover:bg-[#EBF8FF] transition-colors text-sm">
            オンラインで棚卸を依頼する（30分）
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#1A2F5E]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 オンラインバックオフィス代行 | SHOACE</p>
          <div className="flex gap-6 text-xs">
            <Link href="/legal/tokushoho" className="hover:text-white transition-colors">特定商取引法</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            <a href="mailto:nakano.shoace@gmail.com" className="hover:text-white transition-colors">お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
