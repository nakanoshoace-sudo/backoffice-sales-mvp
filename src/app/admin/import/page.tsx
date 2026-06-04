"use client";

import { useState } from "react";
import Link from "next/link";

interface ImportResult {
  success: boolean;
  total: number;
  created: number;
  skipped: number;
  updated: number;
  errors: number;
  details: { line: number; status: string; email?: string; error?: string }[];
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("duplicate_handling", duplicateHandling);

      const res = await fetch("/api/leads/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "インポートに失敗しました");
        return;
      }

      setResult(data);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="text-gray-500 hover:text-gray-700">
          ← リード一覧
        </Link>
        <h2 className="text-2xl font-bold">CSVインポート</h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
        <h3 className="font-bold mb-4">リードをCSVからインポート</h3>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-2">CSVフォーマット:</p>
          <code className="text-xs bg-gray-200 px-2 py-1 rounded block overflow-x-auto">
            company_name,person_name,email,title,employee_size,pain_points,urgency,source,notes
          </code>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• <strong>必須:</strong> company_name, person_name, email</li>
            <li>• <strong>pain_points:</strong> &quot;|&quot; 区切り（例: 経理|請求|総務）</li>
            <li>• <strong>urgency:</strong> urgent / somewhat / researching / undecided</li>
            <li>• <strong>employee_size:</strong> 1-4 / 5-10 / 11-20 / 21-30 / 31-50 / 51+</li>
            <li>• UTF-8（BOM付き可）、改行は LF/CRLF 両対応</li>
          </ul>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重複メールアドレスの処理:
            </label>
            <select
              value={duplicateHandling}
              onChange={(e) => setDuplicateHandling(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="skip">スキップ（既存を維持）</option>
              <option value="update">更新（既存を上書き）</option>
              <option value="create">新規作成（重複許可）</option>
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "インポート中..." : "インポート実行"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <div className={`p-4 rounded-lg ${result.errors > 0 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"}`}>
              <p className="font-medium text-sm">インポート完了</p>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  作成: {result.created}件
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  更新: {result.updated}件
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  スキップ: {result.skipped}件
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                  エラー: {result.errors}件
                </span>
              </div>
            </div>

            {result.details.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
                <p className="font-medium text-sm mb-2 text-gray-700">詳細:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {result.details.map((d) => (
                    <li key={d.line} className="flex gap-2">
                      <span className="text-gray-400 w-12">行{d.line}</span>
                      <span className={d.status === "error" ? "text-red-600" : "text-gray-500"}>
                        {d.email && <span className="font-mono">{d.email}</span>}
                        {d.error && ` — ${d.error}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
