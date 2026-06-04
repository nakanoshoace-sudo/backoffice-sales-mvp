"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  LEAD_STATUSES,
  EVENT_TYPE_LABELS,
  URGENCY_LABELS,
  EMPLOYEE_SIZE_LABELS,
} from "@/lib/constants";
import type { LeadStatus, EventType, UrgencyLevel } from "@/lib/constants";
import { EMAIL_TEMPLATES } from "@/lib/email/templates";

interface Lead {
  id: string;
  company_name: string;
  person_name: string;
  email: string;
  title: string | null;
  employee_size: string;
  pain_points: string[];
  urgency: string;
  source: string | null;
  campaign: string | null;
  status: LeadStatus;
  score: number;
  opt_out: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_contacted_at: string | null;
}

interface LeadEvent {
  id: string;
  type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface Message {
  id: string;
  template_key: string;
  subject: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/leads/${leadId}`).then((r) => r.json()),
      fetch(`/api/leads/${leadId}/events`).then((r) => r.json()),
      fetch(`/api/leads/${leadId}/messages`).then((r) => r.json()),
    ])
      .then(([leadData, eventsData, messagesData]) => {
        setLead(leadData);
        setEvents(eventsData.events || []);
        setMessages(messagesData.messages || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [leadId]);

  async function handleStatusChange(newStatus: LeadStatus) {
    if (!lead || lead.status === newStatus) return;

    // won/lost/proposal の場合は理由を入力させる
    let reason: string | null = null;
    const reasonRequired = ["won", "lost", "proposal"];
    if (reasonRequired.includes(newStatus)) {
      const prompts: Record<string, string> = {
        won: "成約理由を入力してください（例: 価格合意、即決）",
        lost: "失注理由を入力してください（例: 予算不足、他社決定、時期尚早）",
        proposal: "提案内容のメモを入力してください（任意）",
      };
      reason = prompt(prompts[newStatus] || "理由を入力してください");
      if (reason === null && newStatus === "lost") return; // lost は理由必須、キャンセルで中断
    }

    setStatusChanging(true);

    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason: reason || undefined }),
      });

      if (res.ok) {
        setLead({ ...lead, status: newStatus });
        // イベント再取得
        const eventsRes = await fetch(`/api/leads/${leadId}/events`);
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
      }
    } catch (err) {
      console.error("Status change failed:", err);
    } finally {
      setStatusChanging(false);
    }
  }

  async function handleSendEmail(templateKey: string) {
    setEmailSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, template_key: templateKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "送信に失敗しました");
        return;
      }

      alert("メールを送信しました");
      // メッセージ・イベント再取得
      const [messagesRes, eventsRes] = await Promise.all([
        fetch(`/api/leads/${leadId}/messages`),
        fetch(`/api/leads/${leadId}/events`),
      ]);
      setMessages((await messagesRes.json()).messages || []);
      setEvents((await eventsRes.json()).events || []);
    } catch {
      alert("送信に失敗しました");
    } finally {
      setEmailSending(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">読み込み中...</div>;
  }

  if (!lead) {
    return <div className="text-center py-12 text-red-500">リードが見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="text-gray-500 hover:text-gray-700">
          ← 戻る
        </Link>
        <h2 className="text-2xl font-bold">{lead.company_name}</h2>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
          {STATUS_LABELS[lead.status]}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 基本情報 */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">基本情報</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">氏名</dt>
                <dd className="font-medium">{lead.person_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">メール</dt>
                <dd className="font-medium">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">役職</dt>
                <dd>{lead.title || "-"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">従業員数</dt>
                <dd>{EMPLOYEE_SIZE_LABELS[lead.employee_size] || lead.employee_size}</dd>
              </div>
              <div>
                <dt className="text-gray-500">検討時期</dt>
                <dd>{URGENCY_LABELS[lead.urgency as UrgencyLevel] || lead.urgency}</dd>
              </div>
              <div>
                <dt className="text-gray-500">流入元</dt>
                <dd>{lead.source || "-"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">困っている業務</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {lead.pain_points.map((p) => (
                    <span key={p} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {p}
                    </span>
                  ))}
                </dd>
              </div>
              {lead.notes && (
                <div className="col-span-2">
                  <dt className="text-gray-500">メモ</dt>
                  <dd className="whitespace-pre-wrap">{lead.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* イベント履歴 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">イベント履歴</h3>
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">イベントはありません</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 text-sm border-l-2 border-gray-200 pl-3">
                    <span className="text-gray-400 whitespace-nowrap">
                      {new Date(event.created_at).toLocaleString("ja-JP", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-gray-700">
                      {EVENT_TYPE_LABELS[event.type as EventType] || event.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* メール送信履歴 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">メール送信履歴</h3>
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">送信履歴はありません</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                    <div>
                      <span className="font-medium">{msg.subject}</span>
                      <span className="text-gray-500 ml-2">({msg.template_key})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        msg.status === "sent" ? "bg-green-100 text-green-700" :
                        msg.status === "failed" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {msg.status === "sent" ? "送信済" : msg.status === "failed" ? "失敗" : "待機中"}
                      </span>
                      {msg.sent_at && (
                        <span className="text-gray-400 text-xs">
                          {new Date(msg.sent_at).toLocaleDateString("ja-JP")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* スコア */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-1">スコア</p>
            <p className="text-4xl font-bold text-primary-600">{lead.score}</p>
          </div>

          {/* ステータス変更 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3 text-sm">ステータス変更</h3>
            <div className="space-y-1">
              {LEAD_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={statusChanging || lead.status === status}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    lead.status === status
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "hover:bg-gray-50 text-gray-600"
                  } disabled:opacity-50`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* メール送信 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3 text-sm">メール送信</h3>
            {lead.opt_out ? (
              <p className="text-sm text-red-600">配信停止中</p>
            ) : (
              <div className="space-y-1">
                {EMAIL_TEMPLATES.map((tmpl) => {
                  const sent = messages.some(
                    (m) => m.template_key === tmpl.key && m.status === "sent"
                  );
                  return (
                    <button
                      key={tmpl.key}
                      onClick={() => handleSendEmail(tmpl.key)}
                      disabled={emailSending || sent}
                      className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                        sent
                          ? "bg-green-50 text-green-600 cursor-default"
                          : "hover:bg-gray-50 text-gray-600"
                      } disabled:opacity-50`}
                    >
                      Day {tmpl.day}: {tmpl.subject.slice(0, 20)}...
                      {sent && " ✓"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* メタ情報 */}
          <div className="bg-white rounded-xl p-6 shadow-sm text-xs text-gray-500 space-y-1">
            <p>作成: {new Date(lead.created_at).toLocaleString("ja-JP")}</p>
            <p>更新: {new Date(lead.updated_at).toLocaleString("ja-JP")}</p>
            {lead.last_contacted_at && (
              <p>最終接触: {new Date(lead.last_contacted_at).toLocaleString("ja-JP")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
