import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { diagnosisFormSchema } from "@/lib/validations";
import { calculateInitialScore } from "@/lib/scoring";
import { notifyNewLead } from "@/lib/notifications";
import { sendDay0Email } from "@/lib/email/send-day0";
import { requireAuth } from "@/lib/auth";

// POST: フォーム送信 → リード作成（公開）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = diagnosisFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容に不備があります", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    // 初期スコア計算
    const initialScore = calculateInitialScore({
      urgency: data.urgency,
      employee_size: data.employee_size,
      pain_points: data.pain_points,
    });

    // リード作成
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        company_name: data.company_name,
        person_name: data.person_name,
        email: data.email,
        title: data.title || null,
        employee_size: data.employee_size,
        pain_points: data.pain_points,
        urgency: data.urgency,
        source: data.source || null,
        campaign: data.campaign || null,
        status: "new",
        score: initialScore,
        notes: data.notes || null,
        privacy_agreed_at: data.privacy_agreed ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("[API] Lead creation failed:", leadError);
      return NextResponse.json(
        { error: "リードの作成に失敗しました" },
        { status: 500 }
      );
    }

    // 初回イベント記録
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      type: "form_submitted",
      metadata: {
        source: data.source,
        campaign: data.campaign,
        initial_score: initialScore,
      },
    });

    // 新規リード通知（非同期・失敗しても問題ない）
    notifyNewLead({
      company_name: data.company_name,
      person_name: data.person_name,
      email: data.email,
      urgency: data.urgency,
      pain_points: data.pain_points,
      score: initialScore,
    }).catch((err) => console.error("[Notification] Failed:", err));

    return NextResponse.json({ id: lead.id, score: initialScore }, { status: 201 });
  } catch (err) {
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// GET: リード一覧取得（認証必須）
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: leads, count, error } = await query;

    if (error) {
      console.error("[API] Leads fetch failed:", error);
      return NextResponse.json(
        { error: "リードの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads, total: count });
  } catch (err) {
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
