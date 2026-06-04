"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PAIN_POINTS, EMPLOYEE_SIZES, EMPLOYEE_SIZE_LABELS, URGENCY_LABELS } from "@/lib/constants";

export default function DiagnosisPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <DiagnosisPage />
    </Suspense>
  );
}

function DiagnosisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // フォームトラッキング
  const sessionId = useRef(
    typeof window !== "undefined"
      ? `form_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      : ""
  );
  const trackedFields = useRef(new Set<string>());

  const trackEvent = useCallback((event: string, field?: string, metadata?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    fetch("/api/track/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId.current,
        event,
        field,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {}); // ベストエフォート
  }, []);

  const handleFieldFocus = useCallback((field: string) => {
    if (!trackedFields.current.has(field)) {
      trackedFields.current.add(field);
      trackEvent("focus", field);
    }
  }, [trackEvent]);

  // ページ離脱検知
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackEvent("abandon", undefined, {
        fields_started: Array.from(trackedFields.current),
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [trackEvent]);

  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    email: "",
    title: "",
    employee_size: "",
    pain_points: [] as string[],
    urgency: "",
    notes: "",
    privacy_agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const source = searchParams.get("source") || "";
  const campaign = searchParams.get("campaign") || "";

  function handlePainPointToggle(point: string) {
    setFormData((prev) => ({
      ...prev,
      pain_points: prev.pain_points.includes(point)
        ? prev.pain_points.filter((p) => p !== point)
        : [...prev.pain_points, point],
    }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) newErrors.company_name = "会社名を入力してください";
    if (!formData.person_name.trim()) newErrors.person_name = "氏名を入力してください";
    if (!formData.email.trim()) newErrors.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "正しいメールアドレスを入力してください";
    if (!formData.employee_size) newErrors.employee_size = "従業員数を選択してください";
    if (formData.pain_points.length === 0) newErrors.pain_points = "1つ以上選択してください";
    if (!formData.urgency) newErrors.urgency = "検討時期を選択してください";
    if (!formData.privacy_agreed) newErrors.privacy_agreed = "プライバシーポリシーへの同意が必要です";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      trackEvent("validation_error");
      return;
    }

    trackEvent("submit_attempt");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
          campaign,
          privacy_agreed: formData.privacy_agreed,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || "送信に失敗しました" });
        return;
      }

      const data = await res.json();
      router.push(`/thanks?lead_id=${data.id}`);
    } catch {
      setErrors({ form: "通信エラーが発生しました。もう一度お試しください。" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">
            無料診断 | オンラインバックオフィス代行
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">無料バックオフィス診断</h2>
          <p className="text-gray-600 mb-8">
            3分で完了します。貴社の状況に合わせた改善プランをご提案します。
          </p>

          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 会社名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                会社名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                onFocus={() => handleFieldFocus("company_name")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="株式会社○○"
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
            </div>

            {/* 氏名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.person_name}
                onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                onFocus={() => handleFieldFocus("person_name")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="山田 太郎"
              />
              {errors.person_name && (
                <p className="mt-1 text-sm text-red-600">{errors.person_name}</p>
              )}
            </div>

            {/* メール */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => handleFieldFocus("email")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="example@company.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* 役職 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">役職</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="代表取締役"
              />
            </div>

            {/* 従業員数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                従業員数 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employee_size}
                onChange={(e) => setFormData({ ...formData, employee_size: e.target.value })}
                onFocus={() => handleFieldFocus("employee_size")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">選択してください</option>
                {EMPLOYEE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {EMPLOYEE_SIZE_LABELS[size]}
                  </option>
                ))}
              </select>
              {errors.employee_size && (
                <p className="mt-1 text-sm text-red-600">{errors.employee_size}</p>
              )}
            </div>

            {/* 困っている業務 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                現在困っているバックオフィス業務 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAIN_POINTS.map((point) => (
                  <label
                    key={point}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.pain_points.includes(point)
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.pain_points.includes(point)}
                      onChange={() => handlePainPointToggle(point)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
              {errors.pain_points && (
                <p className="mt-1 text-sm text-red-600">{errors.pain_points}</p>
              )}
            </div>

            {/* 検討時期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                導入検討時期 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {(Object.entries(URGENCY_LABELS) as [string, string][]).map(
                  ([value, label]) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.urgency === value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={value}
                        checked={formData.urgency === value}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  )
                )}
              </div>
              {errors.urgency && <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>}
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                相談したい内容・メモ（任意）
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                placeholder="具体的に困っていることや、相談したいことがあればご記入ください"
              />
            </div>

            {/* プライバシーポリシー同意 */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacy_agreed}
                  onChange={(e) =>
                    setFormData({ ...formData, privacy_agreed: e.target.checked })
                  }
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 underline hover:text-primary-700"
                  >
                    プライバシーポリシー
                  </a>
                  に同意の上、送信します。
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              {errors.privacy_agreed && (
                <p className="mt-1 text-sm text-red-600">{errors.privacy_agreed}</p>
              )}
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "送信中..." : "無料診断を送信する"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              ※ 送信いただいた情報はサービスのご案内にのみ使用いたします
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
