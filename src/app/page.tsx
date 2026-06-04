import Link from "next/link";
import { LP_CONTENT } from "@/lib/lp-content";
import { DiagnosisQuiz } from "@/components/lp/DiagnosisQuiz";

/* ── static data ─────────────────────────────── */
const STEPS = [
  { n: "01", title: "業務棚卸し（完全無料）",   desc: "30分のヒアリングで現在の業務を整理。「何を任せればいいか」が明確になります。" },
  { n: "02", title: "専任スタッフをアサイン",   desc: "業務内容に合わせた専任担当者が決定。窓口が一本化されるので管理コストもゼロ。" },
  { n: "03", title: "最短1週間で稼働開始",       desc: "採用・研修・ツール導入は不要。すぐに本業集中できる環境が整います。" },
];

const POINTS = [
  {
    label: "POINT 01", side: "right",
    title: "業務をまるごと引き受ける「専任チーム制」",
    desc:  "担当者がコロコロ変わる心配なし。専任スタッフ＋バックアップ体制で安定した品質を継続的に提供します。",
    checks: ["専任担当者1名＋サポートチーム体制", "担当者変更・引き継ぎコストゼロ", "Slackでの即時相談対応"],
    visual: "ui",
  },
  {
    label: "POINT 02", side: "left",
    title: "週次レポートで業務をまるごと可視化",
    desc:  "「何をやってもらっているか分からない」をゼロに。毎月10日に届く週次レポートで状況を完全把握。",
    checks: ["週次レポートを毎週定期送付", "完了タスク・進行中・翌週予定を一覧化", "月次コスト削減レポートも提供"],
    visual: "person",
  },
  {
    label: "POINT 03", side: "right",
    title: "シンプルな2プランで迷わず始められる",
    desc:  "複雑な料金体系は一切なし。業務量に合わせてSTARTERかSTANDARDを選ぶだけ。",
    checks: ["STARTER：月45,000円〜（月12時間・1ヶ月〜）", "STANDARD：月80,000円〜（月25時間・3ヶ月〜）", "隠れコストなし・追加費用なし"],
    visual: "plan",
  },
  {
    label: "POINT 04", side: "left",
    title: "セキュリティ・NDA対応で安心して任せられる",
    desc:  "業務開始前にNDAと業務委託契約を必ず締結。クラウドのアクセス権限管理も徹底します。",
    checks: ["NDA・業務委託契約を必ず締結", "クラウドツールのアクセス権限を適切に管理", "解約後はデータ完全削除・返却対応"],
    visual: "team",
  },
];

const FAQS = [
  { q: "何を任せればいいかわかりません",   a: "初回に業務棚卸しをご一緒します（完全無料）。まずはご相談ください。どんな小さな業務でも整理してご提案できます。" },
  { q: "情報漏洩・セキュリティが心配です", a: "NDA締結・クラウドセキュリティ対応・アクセス権限管理を徹底しています。解約後のデータ削除・返却にも対応しています。" },
  { q: "すぐに解約できますか？",           a: "STARTERプランは1ヶ月〜、STANDARDプランは3ヶ月〜です。合わなければ最短でご解約いただけます。" },
  { q: "品質が安定するか不安です",         a: "専任担当制＋週次レポートで品質を可視化。担当者変更時も引き継ぎ期間を設けてスムーズに対応します。" },
];

const TRUSTS = [
  { icon: "🛡️", title: "NDA・契約で情報を完全保護",     desc: "業務開始前に必ずNDAと業務委託契約を締結。解約後はデータを完全削除・返却します。" },
  { icon: "👤", title: "専任担当制で品質を継続保証",     desc: "専任スタッフがあなたの業務を深く理解し長期的に伴走。バックアップ体制で品質を維持します。" },
  { icon: "📊", title: "週次レポートで業務を完全可視化", desc: "毎週の完了タスク・進行状況・翌週予定をレポートで共有。いつでも状況を把握できます。" },
  { icon: "💬", title: "初回業務棚卸しは完全無料",       desc: "「何を任せればいいかわからない」方でも大丈夫。30分のヒアリングで最適な対応範囲をご提案します。" },
];
/* ── sub-components ─────────────────────────── */
function DashboardMock() {
  return (
    <div className="bg-gray-800 rounded-2xl p-3 shadow-2xl">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="bg-white rounded-xl p-4 text-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-[#1A2F5E] text-sm">業務ダッシュボード</span>
          <span className="text-gray-400">2024年6月</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { v: "47", l: "完了タスク", bg: "bg-[#EBF8FF]", c: "text-[#2B9BE4]" },
            { v: "12h", l: "削減時間",  bg: "bg-green-50",  c: "text-green-600" },
            { v: "100%",l: "対応率",    bg: "bg-pink-50",   c: "text-pink-600"  },
          ].map(r => (
            <div key={r.l} className={`${r.bg} rounded-lg p-2 text-center`}>
              <div className={`text-lg font-bold ${r.c}`}>{r.v}</div>
              <div className="text-gray-500 text-xs">{r.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { icon: "✓", label: "6月請求書 発行完了",  bg: "bg-gray-50",       ic: "text-green-500" },
            { icon: "✓", label: "経費精算 仕分け完了",  bg: "bg-gray-50",       ic: "text-green-500" },
            { icon: "⟳", label: "週次レポート 作成中…", bg: "bg-[#EBF8FF]",     ic: "text-[#2B9BE4]" },
          ].map(r => (
            <div key={r.label} className={`flex items-center gap-2 p-2 ${r.bg} rounded-lg`}>
              <span className={r.ic}>{r.icon}</span>
              <span className="text-gray-700">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanMock() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-6 bg-white">
          <div className="text-xs font-bold text-[#2B9BE4] uppercase tracking-wider mb-3">STARTER</div>
          <div className="text-2xl font-bold text-[#1A2F5E] mb-1">¥45,000<span className="text-xs font-normal text-gray-500">/月</span></div>
          <div className="text-xs text-gray-500 mb-4">1ヶ月〜 / 月12時間</div>
          <ul className="space-y-2 text-xs text-gray-600">
            {["経理・請求メイン","専任担当1名","週次レポート","チャットサポート"].map(f=>(
              <li key={f} className="flex gap-2"><span className="text-green-500">✓</span>{f}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-[#1A2F5E] text-white relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B9BE4] text-white text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap">★ 推奨</span>
          <div className="text-xs font-bold text-[#2B9BE4] uppercase tracking-wider mb-3">STANDARD</div>
          <div className="text-2xl font-bold text-white mb-1">¥80,000<span className="text-xs font-normal text-gray-400">/月</span></div>
          <div className="text-xs text-gray-400 mb-4">3ヶ月〜 / 月25時間</div>
          <ul className="space-y-2 text-xs text-gray-300">
            {["4カテゴリ全対応","専任＋サポート体制","月次レポート提供","Slack即時相談"].map(f=>(
              <li key={f} className="flex gap-2"><span className="text-[#2B9BE4]">✓</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-6 py-3 bg-gray-50 text-xs text-center text-gray-500 border-t border-gray-100">
        ※ 詳細は無料相談でご説明いたします
      </div>
    </div>
  );
}
/* ── main page ──────────────────────────────── */
export default function HomePage() {
  const c = LP_CONTENT;
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B9BE4] flex items-center justify-center text-white text-xs font-bold">BO</div>
            <span className="text-sm font-bold text-[#1A2F5E]">{c.siteName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="#contact" className="hidden md:inline text-sm text-[#2B9BE4] border border-[#2B9BE4] px-4 py-2 rounded-xl hover:bg-[#EBF8FF] transition-colors">
              まずは無料相談
            </Link>
            <Link href="/diagnosis" className="bg-[#1A2F5E] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#2B9BE4] transition-colors shadow">
              ▶ 無料診断を受ける
            </Link>
          </div>
        </div>
      </header>

      {/* ── SEC 1: FIRST VIEW ── */}
      <section className="relative pt-20 min-h-screen flex items-center"
        style={{ background: "linear-gradient(135deg,#ffffff 0%,#EBF8FF 60%,#dbeeff 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#2B9BE4] uppercase mb-6 bg-[#EBF8FF] px-3 py-1 rounded-full">
              FOR SOLO CEO &amp; SMALL TEAM
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A2F5E] leading-tight mb-6">
              バックオフィスを、<br />
              もう自分で<br />
              <span className="text-[#2B9BE4]">やらなくていい。</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              月額45,000円〜、最短1週間で稼働。<br />
              経理・総務・秘書業務をまるごと代行します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/diagnosis"
                className="flex items-center justify-center gap-2 bg-[#1A2F5E] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2B9BE4] transition-all shadow-lg text-sm min-h-[52px]">
                ▶ 無料診断を受ける（60秒）
              </Link>
              <Link href="#contact"
                className="flex items-center justify-center gap-2 border-2 border-[#2B9BE4] text-[#2B9BE4] font-bold px-8 py-4 rounded-xl hover:bg-[#EBF8FF] transition-all text-sm min-h-[52px]">
                まずは無料相談する
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {["初回業務棚卸し無料","1ヶ月〜解約可","採用コストゼロ"].map(b=>(
                <span key={b} className="flex items-center gap-1.5">
                  <span className="text-green-500 font-bold">✓</span>{b}
                </span>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <DashboardMock />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">✓</div>
              <div>
                <div className="text-xs font-bold text-gray-800">今週の業務完了</div>
                <div className="text-xs text-gray-500">47件すべて対応済み</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── SEC 2: METRICS ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n:"¥45,000〜", unit:"/月", label:"月額費用", sub:"経理・総務・秘書まで\nまとめて対応" },
            { n:"最短1週間", unit:"",    label:"稼働開始まで", sub:"業務棚卸しから\nスタート支援まで無料" },
            { n:"¥0",        unit:"",    label:"採用・研修コスト", sub:"雇用リスクなし\n即戦力のプロが対応" },
          ].map(m=>(
            <div key={m.label} className="text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-[#1A2F5E] mb-1">
                {m.n}<span className="text-base font-normal text-gray-500">{m.unit}</span>
              </div>
              <div className="text-sm text-[#2B9BE4] font-bold mb-2">{m.label}</div>
              <div className="text-xs text-gray-500 whitespace-pre-line">{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEC 3: PAIN POINTS ── */}
      <section className="py-24 px-4 bg-gray-50" style={{ clipPath:"polygon(0 4%,100% 0,100% 96%,0 100%)", marginTop:"-2%", paddingTop:"6rem", paddingBottom:"6rem" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">PAIN POINTS</span>
            <h2 className="text-3xl font-bold text-[#1A2F5E] mt-3">こんな状況、<br className="md:hidden" />心当たりはありませんか？</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
            {[
              "請求書・経理処理に毎月10時間以上とられている",
              "「あの人しかわからない」業務が増えて属人化している",
              "採用するほどではないが手が全然回らない",
              "社長が事務を全部抱えて本業に集中できない",
              "外注したことがあるが品質がバラバラで管理が大変だった",
            ].map((pain,i)=>(
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <span className="text-[#2B9BE4] text-lg mt-0.5 flex-shrink-0">☑</span>
                <span className="text-gray-700 text-sm">{pain}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-500 text-sm">
            それ、すべて<strong className="text-[#1A2F5E]">私たちが解決します。</strong>
          </p>
        </div>
      </section>
      {/* ── SEC 4: SOLUTION ── */}
      <section className="py-24 px-4" style={{ background:"linear-gradient(160deg,#EBF8FF 0%,#ffffff 60%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">SOLUTION</span>
            <h2 className="text-3xl font-bold text-[#1A2F5E] mt-3">最短1週間で、<br className="md:hidden" />プロのバックオフィスチームが稼働</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2B9BE4]/10 to-[#EBF8FF] shadow-lg flex items-center justify-center">
                <div className="text-center text-gray-400 p-8">
                  <div className="text-6xl mb-4">👩‍💼</div>
                  <p className="text-xs text-gray-400">日本人スタッフ・PC作業<br />明るいオフィス（AI生成画像）</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-5 py-4 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">累計削減時間</div>
                <div className="text-2xl font-bold text-[#1A2F5E]">12,000<span className="text-sm font-normal">h+</span></div>
              </div>
            </div>
            <div className="space-y-8">
              {STEPS.map((s,i)=>(
                <div key={s.n} className="flex gap-5 items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white ${i===2?"bg-[#2B9BE4]":"bg-[#1A2F5E]"}`}>{s.n}</div>
                  <div>
                    <h3 className="font-bold text-[#1A2F5E] text-lg mb-1">{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
              <Link href="/diagnosis"
                className="inline-flex items-center gap-2 bg-[#1A2F5E] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2B9BE4] transition-all shadow-lg text-sm">
                ▶ 無料診断で業務棚卸しを始める
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ── SEC 5: POINTS 01-04 ── */}
      {POINTS.map((pt,i)=>{
        const isLeft = pt.side === "right"; // テキストが左 = 画像が右
        const bg = i%2===0 ? "bg-white" : "bg-gray-50";
        const Visual = ()=>{
          if(pt.visual==="ui")   return <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"><div className="w-full h-full bg-white p-4 border border-gray-100 rounded-2xl"><div className="text-xs font-bold text-[#1A2F5E] mb-3">📋 今週の担当タスク</div><div className="space-y-2">{[{l:"請求書発行 × 8件",s:"完了",bc:"bg-green-50",tc:"text-green-600"},{l:"経費精算 仕分け",s:"完了",bc:"bg-green-50",tc:"text-green-600"},{l:"月次レポート作成",s:"対応中",bc:"bg-[#EBF8FF]",tc:"text-[#2B9BE4]"},{l:"契約書ファイリング",s:"予定",bc:"bg-gray-50",tc:"text-gray-400"}].map(r=><div key={r.l} className={`flex items-center justify-between ${r.bc} rounded-lg px-3 py-2`}><span className="text-xs text-gray-700">{r.l}</span><span className={`text-xs font-bold ${r.tc}`}>{r.s}</span></div>)}</div><div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">担当：田中（専任）＋ バックアップ2名</div></div></div>;
          if(pt.visual==="person") return <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2B9BE4]/10 to-pink-50 shadow-lg flex items-center justify-center"><div className="text-center text-gray-400 p-8"><div className="text-6xl mb-4">👨‍💼</div><p className="text-xs">日本人男性・スマホでレポート確認<br />安心した表情（AI生成画像）</p></div></div>;
          if(pt.visual==="plan")   return <PlanMock />;
          return <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2B9BE4]/10 to-[#EBF8FF] shadow-lg flex items-center justify-center"><div className="text-center text-gray-400 p-8"><div className="text-6xl mb-4">👥</div><p className="text-xs">日本人チーム・オフィス作業<br />信頼感（AI生成画像）</p></div></div>;
        };
        return (
          <section key={pt.label} className={`py-24 px-4 ${bg}`}>
            <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center ${!isLeft?"md:flex md:flex-row-reverse":""}`}>
              <div>
                <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">{pt.label}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A2F5E] mt-2 mb-4">{pt.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">{pt.desc}</p>
                <ul className="space-y-3">
                  {pt.checks.map(ch=>(
                    <li key={ch} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="text-green-500 font-bold flex-shrink-0">✓</span>{ch}
                    </li>
                  ))}
                </ul>
              </div>
              <Visual />
            </div>
          </section>
        );
      })}
      {/* ── SEC 6: BENEFIT ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">BENEFIT</span>
            <h2 className="text-3xl font-bold text-[#1A2F5E] mt-3">導入後、こう変わります</h2>
            <p className="text-gray-500 text-sm mt-3">実際の導入事例をもとにした Before / After</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-8">
              <div className="inline-block text-xs font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full mb-6 uppercase tracking-wider">Before</div>
              <ul className="space-y-4">
                {[
                  {t:"月58時間を事務作業に消費",     s:"請求書・経費精算・メール対応で午前が消える"},
                  {t:"収支が把握できていない",         s:"月次収支が月末まで不明・資金繰りに不安"},
                  {t:"担当者が辞めたら業務が止まる",   s:"属人化・ブラックボックス化が深刻"},
                  {t:"本業に集中できない",             s:"社長が事務処理をしている時間は売上ゼロ"},
                ].map(b=>(
                  <li key={b.t} className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5 flex-shrink-0 text-lg">✗</span>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{b.t}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{b.s}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-8">
              <div className="inline-block text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full mb-6 uppercase tracking-wider">After（導入2ヶ月後）</div>
              <ul className="space-y-4">
                {[
                  {t:"月12時間まで削減（▲46時間）",    s:"取り戻した時間を提案・営業活動に全振り"},
                  {t:"毎月10日に月次レポートが届く",     s:"収支・タスク完了数・翌月予定を一覧で把握"},
                  {t:"専任チームで引き継ぎコストゼロ",   s:"担当変更があっても業務継続性を完全保証"},
                  {t:"売上が3ヶ月で1.3倍に",           s:"本業集中により新規受注が加速"},
                ].map(a=>(
                  <li key={a.t} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{a.t}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{a.s}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 bg-[#1A2F5E] rounded-2xl p-8 text-white text-center">
            <div className="text-xs text-[#2B9BE4] mb-2 font-bold uppercase tracking-widest">ROI SIMULATION</div>
            <div className="text-2xl md:text-3xl font-bold mb-2">
              月8万円の投資 → <span className="text-[#2B9BE4]">月25万円の価値創出</span>
            </div>
            <div className="text-gray-400 text-sm">50時間削減 × 時給5,000円換算 ＝ 250,000円 ／ 純利益：170,000円/月</div>
          </div>
        </div>
      </section>

      {/* ── 中間CTA帯 ── */}
      <section className="py-16 px-4" style={{ background:"linear-gradient(135deg,#1A2F5E 0%,#2B9BE4 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/80 text-sm mb-3">今月残り <strong className="text-white">2枠</strong> ／ 受付中</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">まず60秒、無料診断だけでも<br className="md:hidden" />やってみませんか？</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis" className="bg-white text-[#1A2F5E] font-bold px-8 py-4 rounded-xl hover:bg-[#EBF8FF] transition-all shadow-lg text-sm min-h-[52px] flex items-center justify-center">
              ▶ 無料診断を受ける（60秒）
            </Link>
            <Link href="#contact" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-sm min-h-[52px] flex items-center justify-center">
              まずは無料相談する
            </Link>
          </div>
          <p className="text-white/50 text-xs mt-5">しつこい営業・勧誘は一切ありません</p>
        </div>
      </section>
      {/* ── SEC 7: TRUST ── */}
      <section className="py-24 px-4 bg-[#EBF8FF]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">TRUST &amp; SAFETY</span>
            <h2 className="text-3xl font-bold text-[#1A2F5E] mt-3">安心して任せられる<br />4つの理由</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {TRUSTS.map(tr=>(
              <div key={tr.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#2B9BE4]/10 flex items-center justify-center text-2xl mb-5">{tr.icon}</div>
                <h3 className="font-bold text-[#1A2F5E] text-lg mb-2">{tr.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tr.desc}</p>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-bold text-[#1A2F5E] text-center mb-8">よくある質問</h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQS.map(faq=>(
              <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="font-bold text-[#1A2F5E] text-sm mb-2">Q. {faq.q}</div>
                <div className="text-gray-600 text-sm leading-relaxed">A. {faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEC 8: CLOSING CTA ── */}
      <section id="contact" className="py-24 px-4 bg-[#1A2F5E]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest text-[#2B9BE4] uppercase">GET STARTED</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4 leading-tight">
            {c.finalCtaTitle1}<br />{c.finalCtaTitle2}
          </h2>
          <p className="text-gray-400 text-sm mb-4">{c.finalCtaNote}</p>
          <ul className="inline-block text-left space-y-2 mb-10">
            {c.finalCtaPoints.map(pt=>(
              <li key={pt} className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-[#2B9BE4] font-bold flex-shrink-0">✓</span>{pt}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/diagnosis"
              className="flex items-center justify-center gap-2 bg-[#2B9BE4] text-white font-bold px-10 py-5 rounded-xl hover:bg-[#1a8fd1] transition-all shadow-xl text-base min-h-[56px]">
              ▶ 無料診断を受ける（60秒）
            </Link>
            <a href={`mailto:${c.contactEmail}`}
              className="flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-10 py-5 rounded-xl hover:border-white hover:bg-white/10 transition-all text-base min-h-[56px]">
              まずは無料相談する
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            {["完全無料・費用なし","しつこい営業・勧誘なし","24時間以内にご返信","今月残り2枠"].map(b=>(
              <span key={b} className="flex items-center gap-1.5">
                <span className="text-[#2B9BE4]">✓</span>{b}
              </span>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 text-xs text-gray-600">
            <p>Contact: <a href={`mailto:${c.contactEmail}`} className="text-gray-400 hover:text-gray-300 transition-colors">{c.contactEmail}</a></p>
            <p className="mt-1">※ 24時間以内にご連絡いたします</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 bg-black border-t border-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B9BE4] flex items-center justify-center text-white text-xs font-bold">BO</div>
            <span className="text-sm font-bold text-gray-300">{c.siteName}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">プライバシーポリシー</Link>
            <Link href="/legal/tokushoho" className="hover:text-gray-400 transition-colors">特定商取引法に基づく表記</Link>
            <Link href="/diagnosis" className="hover:text-gray-400 transition-colors">無料診断</Link>
            <a href={`mailto:${c.contactEmail}`} className="hover:text-gray-400 transition-colors">お問い合わせ</a>
          </nav>
          <p className="text-xs text-gray-700">© 2024 {c.siteName}</p>
        </div>
      </footer>

    </div>
  );
}