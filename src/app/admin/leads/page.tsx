"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS, LEAD_STATUSES } from "@/lib/constants";
import type { LeadStatus } from "@/lib/constants";

interface Lead {
  id: string;
  company_name: string;
  person_name: string;
  email: string;
  status: LeadStatus;
  score: number;
  source: string | null;
  created_at: string;
  last_contacted_at: string | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">リード管理</h2>
        <div className="flex items-center gap-3">
          <a
            href={`/api/leads/export${statusFilter ? `?status=${statusFilter}` : ""}`}
            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            download
          >
            📥 CSV出力
          </a>
          <span className="text-sm text-gray-500">{total}件</span>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            !statusFilter ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          すべて
        </button>
        {LEAD_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              statusFilter === status
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* テーブル */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12 text-gray-500">リードがありません</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">会社名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">担当者</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">スコア</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">流入元</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">作成日</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {lead.company_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.person_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        STATUS_COLORS[lead.status]
                      }`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.score}</td>
                  <td className="px-4 py-3 text-gray-500">{lead.source || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString("ja-JP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
