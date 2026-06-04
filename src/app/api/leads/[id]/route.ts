import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: リード詳細取得
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "リードが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (err) {
    console.error("[API] Error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// PATCH: リード情報更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("leads")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API] Lead update failed:", error);
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[API] Error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
