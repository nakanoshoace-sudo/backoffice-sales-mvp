"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, EVENT_TYPE_LABELS } from "@/lib/constants";
import type { LeadStatus, EventType } from "@/lib/constants";

interface FunnelData {
  form_to_booked_rate: number;
  booked_to_won_rate: number;
  overall_conversion_rate: number;
  opt_out_rate: number;
  email_success_rate: number;
  email_click_rate: number;
  click_to_booked: number;
}

interface DashboardData {
  totalLeads: number;
  newLeadsThisWeek: number;
  statusBreakdown: Record<string, number>;
  sourceBreakdown: Record<string, number>;
  bookingsCount: number;
  wonCount: number;
  optOutCount: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  totalClicks: number;
  funnel: FunnelData;
  sourceConversion: Array<{
    source: string;
    total: number;
    booked: number;
    won: number;
    booking_rate: number;
    won_rate: number;
  }>;
  recentEvents: Array<{
    id: string;
    type: string;
    created_at: string;
    leads: { person_name: string; company_name: string } | null;
  }>;
  leadsNeedingAttention: Array<{
    id: string;
    company_name: string;
    person_name: string;
    status: string;
    score: number;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">読み込み中...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">データの取得に失敗しました</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ダッシュボード</h2>

      {/* KPIカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="総リード数" value={data.totalLeads} />
        <StatCard label="今週の新規" value={data.newLeadsThisWeek} />
        <StatCard label="予約数" value={data.bookingsCount} />
        <StatCard label="成約数" value={data.wonCount} />
      </div>

      {/* ファネル指標 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">📊 ファネル指標</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <FunnelMetric
            label="フォーム→予約率"
            value={data.funnel.form_to_booked_rate}
            unit="%"
            color={data.funnel.form_to_booked_rate > 10 ? "green" : "yellow"}
          />
          <FunnelMetric
            label="予約→成約率"
            value={data.funnel.booked_to_won_rate}
            unit="%"
            color={data.funnel.booked_to_won_rate > 30 ? "green" : "yellow"}
          />
          <FunnelMetric
            label="全体CV率"
            value={data.funnel.overall_conversion_rate}
            unit="%"
            color={data.funnel.overall_conversion_rate > 5 ? "green" : "yellow"}
          />
          <FunnelMetric
            label="メール送信成功率"
            value={data.funnel.email_success_rate}
            unit="%"
            color={data.funnel.email_success_rate > 95 ? "green" : "red"}
          />
          <FunnelMetric
            label="配信停止率"
            value={data.funnel.opt_out_rate}
            unit="%"
            color={data.funnel.opt_out_rate < 10 ? "green" : "red"}
          />
          <FunnelMetric
            label="メールクリック率"
            value={data.funnel.email_click_rate}
            unit="%"
            color={data.funnel.email_click_rate > 5 ? "green" : "yellow"}
          />
        </div>
        <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4 text-xs text-gray-500">
          <div>送信済みメール: {data.totalEmailsSent}通</div>
          <div>送信失敗: {data.totalEmailsFailed}通</div>
          <div>総クリック数: {data.totalClicks}回</div>
          <div>クリック→予約: {data.funnel.click_to_booked}件</div>
        </div>
      </div>

      {/* ステータス別 + 流入元 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">ステータス別</h3>
          <div className="space-y-2">
            {Object.entries(data.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {STATUS_LABELS[status as LeadStatus] || status}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">流入元別コンバージョン</h3>
          {data.sourceConversion.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">流入元</th>
                  <th className="pb-2 text-right">件数</th>
                  <th className="pb-2 text-right">予約率</th>
                  <th className="pb-2 text-right">成約率</th>
                </tr>
              </thead>
              <tbody>
                {data.sourceConversion.map((s) => (
                  <tr key={s.source} className="border-b last:border-0">
                    <td className="py-2 text-gray-700">{s.source}</td>
                    <td className="py-2 text-right">{s.total}</td>
                    <td className="py-2 text-right">
                      <span className={s.booking_rate > 10 ? "text-green-600" : "text-gray-600"}>
                        {s.booking_rate}%
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className={s.won_rate > 5 ? "text-green-600" : "text-gray-600"}>
                        {s.won_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">データなし</p>
          )}
        </div>
      </div>

      {/* メール別成果 */}
      <EmailStatsPanel />

      {/* 要対応リード */}
      {data.leadsNeedingAttention.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 text-orange-600">⚠️ 要対応リード（3日以上未対応）</h3>
          <div className="space-y-2">
            {data.leadsNeedingAttention.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="font-medium text-sm">{lead.company_name}</span>
                  <span className="text-gray-500 text-sm ml-2">{lead.person_name}</span>
                </div>
                <span className="text-sm text-gray-500">スコア: {lead.score}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 最近のイベント */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">最近のイベント</h3>
        <div className="space-y-3">
          {data.recentEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 text-sm">
              <span className="text-gray-400 whitespace-nowrap">
                {new Date(event.created_at).toLocaleString("ja-JP", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-gray-600">
                {event.leads?.company_name} - {EVENT_TYPE_LABELS[event.type as EventType] || event.type}
              </span>
            </div>
          ))}
          {data.recentEvents.length === 0 && (
            <p className="text-gray-500 text-sm">イベントはまだありません</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function FunnelMetric({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: "green" | "yellow" | "red";
}) {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color]}`}>
        {value}{unit}
      </p>
    </div>
  );
}

interface EmailStat {
  template_key: string;
  sent: number;
  clicked: number;
  click_rate: number;
  total_clicks: number;
  booked_contribution: number;
  booking_rate: number;
}

const TEMPLATE_LABELS: Record<string, string> = {
  day_0_thanks: "Day 0: お礼",
  day_2_challenges: "Day 2: 課題提示",
  day_5_case_study: "Day 5: 事例紹介",
  day_8_plans: "Day 8: プラン案内",
  day_12_booking: "Day 12: 予約促進",
  day_16_reminder: "Day 16: リマインド",
  day_21_final: "Day 21: 最終案内",
};

function EmailStatsPanel() {
  const [stats, setStats] = useState<EmailStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/email-stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (stats.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">📧 メール別成果</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">テンプレート</th>
              <th className="pb-2 text-right">送信数</th>
              <th className="pb-2 text-right">クリック数</th>
              <th className="pb-2 text-right">クリック率</th>
              <th className="pb-2 text-right">予約貢献</th>
              <th className="pb-2 text-right">予約率</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.template_key} className="border-b last:border-0">
                <td className="py-2 text-gray-700">
                  {TEMPLATE_LABELS[s.template_key] || s.template_key}
                </td>
                <td className="py-2 text-right">{s.sent}</td>
                <td className="py-2 text-right">{s.clicked}</td>
                <td className="py-2 text-right">
                  <span className={s.click_rate > 10 ? "text-green-600 font-medium" : ""}>
                    {s.click_rate}%
                  </span>
                </td>
                <td className="py-2 text-right">{s.booked_contribution}</td>
                <td className="py-2 text-right">
                  <span className={s.booking_rate > 10 ? "text-green-600 font-medium" : ""}>
                    {s.booking_rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
