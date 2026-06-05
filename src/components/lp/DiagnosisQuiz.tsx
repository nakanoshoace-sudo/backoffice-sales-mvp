"use client";
import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { label: "事業歴はどのくらいですか？",            options: ["創業1年未満","1〜3年","3〜5年","5年以上"],                                                  hoursMap: null as number[]|null, rateMap: null as number[]|null },
  { label: "現在の年商規模は？",                     options: ["〜1,000万円","1,000〜3,000万円","3,000〜5,000万円","5,000万円以上"],                         hoursMap: null, rateMap: null },
  { label: "週に何時間、事務作業に使っていますか？", options: ["5時間未満","5〜10時間","10〜15時間","15時間以上"],                                            hoursMap: [3, 7.5, 12.5, 18], rateMap: null },
  { label: "最も時間を奪われている業務は？",          options: ["経理・請求書関連","メール・スケジュール管理","顧客管理・資料作成","全部大変"],               hoursMap: null, rateMap: null },
  { label: "自分の時給をいくらと考えていますか？",   options: ["3,000円","5,000円","10,000円","15,000円以上"],                                               hoursMap: null, rateMap: [3000, 5000, 10000, 15000] },
];

// SVGアイコン
function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#2B9BE4]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconMoney() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#2B9BE4]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#2B9BE4]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconWarning() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export function DiagnosisQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  function pick(i: number) {
    const next = [...answers, i];
    setAnswers(next);
    setStep(step < QUESTIONS.length - 1 ? step + 1 : QUESTIONS.length);
  }

  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step];
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* 題名 */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-[#2B9BE4] rounded-full" />
          <h3 className="text-sm font-bold text-[#1A2F5E] tracking-wide">簡易診断</h3>
          <span className="text-xs text-gray-400 ml-auto">{step + 1} / {QUESTIONS.length}</span>
        </div>

        {/* プログレスバー */}
        <div className="flex gap-1 mb-6">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-[#2B9BE4]" : i === step ? "bg-[#2B9BE4]/50" : "bg-gray-100"}`} />
          ))}
        </div>

        <p className="text-sm font-bold text-[#1A2F5E] mb-4">{q.label}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)}
              className="w-full text-left px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium hover:border-[#2B9BE4] hover:bg-[#EBF8FF] transition-all min-h-[52px]">
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hw   = QUESTIONS[2].hoursMap![answers[2]] ?? 7.5;
  const rate = QUESTIONS[4].rateMap![answers[4]] ?? 5000;
  const mh   = Math.round(hw * 4.33);
  const ml   = mh * rate;
  const yl   = ml * 12;
  const lv   = yl >= 3_000_000
    ? { txt: "今すぐ改善が必要なレベル", cls: "text-red-500" }
    : yl >= 1_200_000
    ? { txt: "早期対応を推奨するレベル", cls: "text-amber-500" }
    : { txt: "改善余地があるレベル",     cls: "text-green-500" };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-[#2B9BE4] rounded-full" />
          <h3 className="text-sm font-bold text-[#1A2F5E] tracking-wide">診断結果</h3>
        </div>
        <div className="space-y-3 mb-6">
          {[
            { icon: <IconChart />,   label: "月間時間損失",   val: `約${mh}時間`,                 big: false },
            { icon: <IconMoney />,   label: "月間機会損失額", val: `約${ml.toLocaleString()}円`,  big: false },
            { icon: <IconCalendar />,label: "年間機会損失額", val: `約${yl.toLocaleString()}円`,  big: true  },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                {r.icon}
                <span className="text-gray-600 text-sm">{r.label}</span>
              </div>
              <span className={`font-bold text-[#1A2F5E] ${r.big ? "text-2xl" : "text-lg"}`}>{r.val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <IconWarning />
              <span className="text-gray-600 text-sm">判定</span>
            </div>
            <span className={`font-bold text-sm ${lv.cls}`}>【{lv.txt}】</span>
          </div>
        </div>
        <Link href="/diagnosis?source=lp_quiz"
          className="block w-full text-center bg-[#1A2F5E] text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-[#2B9BE4] transition-colors">
          オンラインで棚卸を依頼する（30分）
        </Link>
        <p className="text-center text-xs text-gray-400 mt-3">完全無料・営業なし・24時間以内に返信</p>
      </div>
      <button onClick={() => { setStep(0); setAnswers([]); }}
        className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline w-full text-center">
        もう一度診断する
      </button>
    </div>
  );
}
