import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { bookingCreateSchema } from "@/lib/validations";

// POST: 予約作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { lead_id, booking_source, meeting_at, note } = parsed.data;

    // 予約作成
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        lead_id,
        booking_source,
        meeting_at: meeting_at || null,
        note: note || null,
      })
      .select("id")
      .single();

    if (bookingError) {
      console.error("[API] Booking creation failed:", bookingError);
      return NextResponse.json({ error: "予約の作成に失敗しました" }, { status: 500 });
    }

    // ステータスを booked に更新
    const { data: currentLead } = await supabase
      .from("leads")
      .select("status, score")
      .eq("id", lead_id)
      .single();

    if (currentLead) {
      await supabase
        .from("leads")
        .update({
          status: "booked",
          score: currentLead.score + 20,
        })
        .eq("id", lead_id);

      // パイプラインログ
      await supabase.from("pipeline_logs").insert({
        lead_id,
        from_status: currentLead.status,
        to_status: "booked",
        reason: "予約フォームから予約",
      });
    }

    // イベント記録
    await supabase.from("lead_events").insert({
      lead_id,
      type: "booking_created",
      metadata: { booking_id: booking.id, booking_source, meeting_at },
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("[API] Error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
