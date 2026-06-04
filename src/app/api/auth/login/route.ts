import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST: 管理者ログイン
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "ログインに失敗しました" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    console.error("[API] Auth error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
