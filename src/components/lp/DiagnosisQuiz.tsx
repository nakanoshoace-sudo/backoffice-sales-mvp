"use client";
import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { id: "tenure",  label: "Q1. 事業歴はどのくらいですか？",                 options: ["創業1年未満","1〜3年","3〜5年","5年以上"],                                                       hoursMap: null as number[]|null, rateMap: null as number[]|null },
  { id: "revenue", label: "Q2. 現在の年商規模は？",                          options: ["〜1,000万円","1,000〜3,000万円","3,000〜5,000万円","5,000万円以上"],                              hoursMap: null, rateMap: null },
  { id: "hours",   label: "Q3. 週に何時間、事務作業に使っていますか？",      options: ["5時間未満","5〜10時間","10〜15時間","15時間以上"],                                                 hoursMap: [3,7.5,12.5,18], rateMap: null },
  { id: "task",    label: "Q4. 最も時間を奪われている業務は？",               options: ["経理・請求書関連","メール・スケジュール管理","顧客管理・資料作成","全部大変"],                    hoursMap: null, rateMap: null },
  { id: "rate",    label: "Q5. 自分の時給をいくらと考えていますか？",        options: ["3,000円","5,000円","10,000円","15,000円以上"],                                                     hoursMap: null, rateMap: [3000,5000,10000,15000] },
];

export function DiagnosisQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  function pick(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    setStep(step < QUESTIONS.length - 1 ? step + 1 : QUESTIONS.length);
  }

  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step];
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex gap-1 mb-8">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-yellow-500" : i === step ? "bg-yellow-300" : "bg-gray-700"}`} />
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-2">{step + 1} / {QUESTIONS.length}</p>
        <p className="text-lg font-bold text-white mb-6">{q.label}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)}
              className="w-full text-left px-5 py-4 border border-gray-700 rounded-lg text-gray-300 hover:border-yellow-500 hover:text-white hover:bg-gray-800 transition-all text-sm min-h-[52px]">
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hw = QUESTIONS[2].hoursMap![answers[2]] ?? 7.5;
  const rate = QUESTIONS[4].rateMap![answers[4]] ?? 5000;
  const mh = Math.round(hw * 4.33);
  const ml = mh * rate;
  const yl = ml * 12;
  const lv = yl >= 3000000
    ? { txt: "今すぐ改善が必要なレベル", cls: "text-red-400" }
    : yl >= 1200000
    ? { txt: "早期対応を推奨するレベル", cls: "text-yellow-400" }
    : { txt: "改善余地があるレベル",     cls: "text-green-400" };

  return (
    <div className="max-w-xl mx-auto">
      <div className="border border-gray-700 rounded-xl p-6 bg-gray-900">
        <p className="text-xs text-yellow-500 font-bold mb-5 tracking-widest uppercase">Diagnosis Result</p>
        <div className="space-y-4 mb-6">
          <Row label="📊 月間時間損失"    value={`約${mh}時間`}              gold={false} />
          <Row label="💴 月間機会損失額"  value={`約${ml.toLocaleString()}円`} gold />
          <Row label="📅 年間機会損失額"  value={`約${yl.toLocaleString()}円`} gold large />
          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-400 text-sm">⚠ 判定</span>
            <span className={`font-bold text-sm ${lv.cls}`}>【{lv.txt}】</span>
          </div>
        </div>
        <Link href="/diagnosis?source=lp_quiz"
          className="block w-full text-center bg-yellow-500 text-black px-6 py-4 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
          ▶ 無料相談で改善策を受け取る
        </Link>
        <p className="text-center text-xs text-gray-500 mt-3">完全無料・営業なし・24時間以内に返信</p>
      </div>
      <button onClick={() => { setStep(0); setAnswers([]); }}
        className="mt-4 text-xs text-gray-600 hover:text-gray-400 underline w-full text-center">
        もう一度診断する
      </button>
    </div>
  );
}

function Row({ label, value, gold, large }: { label: string; value: string; gold?: boolean; large?: boolean }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-800 pb-3">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-bold ${large ? "text-2xl" : "text-lg"} ${gold ? "text-yellow-400" : "text-white"}`}>{value}</span>
    </div>
  );
}