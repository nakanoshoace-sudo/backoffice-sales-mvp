/**
 * Seed Script: ダミーデータ投入
 * Usage: npx tsx scripts/seed.ts
 *
 * 事前に .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("環境変数が設定されていません。.env.local を確認してください。");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const dummyLeads = [
  {
    company_name: "株式会社テックスタート",
    person_name: "田中太郎",
    email: "tanaka@techstart.example.com",
    title: "代表取締役",
    employee_size: "5-10",
    pain_points: ["経理", "請求", "データ入力"],
    urgency: "urgent",
    source: "google",
    campaign: "search_001",
    status: "new",
    score: 25,
  },
  {
    company_name: "合同会社ウェブクリエイト",
    person_name: "鈴木花子",
    email: "suzuki@webcreate.example.com",
    title: "取締役",
    employee_size: "11-20",
    pain_points: ["経理", "総務", "秘書"],
    urgency: "somewhat",
    source: "referral",
    status: "contacted",
    score: 20,
    last_contacted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    company_name: "山田コンサルティング",
    person_name: "山田一郎",
    email: "yamada@consulting.example.com",
    title: "所長",
    employee_size: "1-4",
    pain_points: ["経理", "データ入力"],
    urgency: "researching",
    source: "google",
    status: "new",
    score: 15,
  },
  {
    company_name: "株式会社ECプロ",
    person_name: "佐藤美咲",
    email: "sato@ecpro.example.com",
    title: "COO",
    employee_size: "21-30",
    pain_points: ["経理", "請求", "総務", "採用事務"],
    urgency: "urgent",
    source: "facebook",
    campaign: "fb_ad_001",
    status: "engaged",
    score: 35,
    last_contacted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    company_name: "合同会社デザインラボ",
    person_name: "高橋健太",
    email: "takahashi@designlab.example.com",
    title: "代表",
    employee_size: "5-10",
    pain_points: ["経理", "秘書"],
    urgency: "undecided",
    source: "twitter",
    status: "new",
    score: 10,
  },
  {
    company_name: "株式会社開発ファクトリー",
    person_name: "伊藤直樹",
    email: "ito@devfactory.example.com",
    title: "CTO",
    employee_size: "11-20",
    pain_points: ["経理", "請求", "データ入力", "総務"],
    urgency: "urgent",
    source: "google",
    status: "booked",
    score: 55,
    last_contacted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    company_name: "渡辺法律事務所",
    person_name: "渡辺雄二",
    email: "watanabe@law.example.com",
    title: "弁護士",
    employee_size: "5-10",
    pain_points: ["データ入力", "秘書", "総務"],
    urgency: "somewhat",
    source: "referral",
    status: "proposal",
    score: 40,
    last_contacted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    company_name: "株式会社マーケティングパートナーズ",
    person_name: "中村あゆみ",
    email: "nakamura@mp.example.com",
    title: "マネージャー",
    employee_size: "21-30",
    pain_points: ["経理", "請求"],
    urgency: "somewhat",
    source: "google",
    status: "won",
    score: 60,
    last_contacted_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    company_name: "個人事業 小林製作",
    person_name: "小林大輔",
    email: "kobayashi@example.com",
    title: "代表",
    employee_size: "1-4",
    pain_points: ["経理"],
    urgency: "researching",
    source: "direct",
    status: "lost",
    score: 10,
    notes: "予算が合わなかった",
  },
  {
    company_name: "株式会社フューチャーテック",
    person_name: "松本理沙",
    email: "matsumoto@futuretech.example.com",
    title: "取締役",
    employee_size: "11-20",
    pain_points: ["経理", "請求", "秘書", "採用事務"],
    urgency: "urgent",
    source: "referral",
    status: "new",
    score: 30,
  },
  {
    company_name: "合同会社クラウドワークス",
    person_name: "加藤誠",
    email: "kato@cloudworks.example.com",
    title: "CEO",
    employee_size: "5-10",
    pain_points: ["経理", "データ入力", "その他"],
    urgency: "urgent",
    source: "google",
    campaign: "search_002",
    status: "contacted",
    score: 25,
    last_contacted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    company_name: "株式会社サポートプラス",
    person_name: "吉田真理",
    email: "yoshida@supportplus.example.com",
    title: "事業部長",
    employee_size: "31-50",
    pain_points: ["総務", "採用事務", "データ入力"],
    urgency: "somewhat",
    source: "facebook",
    status: "engaged",
    score: 20,
    last_contacted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // 既存データクリア（開発用）
  console.log("  Clearing existing data...");
  await supabase.from("lead_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("pipeline_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // リード投入
  console.log("  Inserting leads...");
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .insert(dummyLeads)
    .select("id, company_name");

  if (leadsError) {
    console.error("❌ Lead insert failed:", leadsError);
    process.exit(1);
  }

  console.log(`  ✅ ${leads.length} leads inserted`);

  // 各リードにフォーム送信イベントを追加
  console.log("  Inserting events...");
  const events = leads.map((lead) => ({
    lead_id: lead.id,
    type: "form_submitted",
    metadata: { source: "seed" },
  }));

  await supabase.from("lead_events").insert(events);

  // booked リードに予約を追加
  const bookedLead = leads.find((l) => l.company_name === "株式会社開発ファクトリー");
  if (bookedLead) {
    await supabase.from("bookings").insert({
      lead_id: bookedLead.id,
      booking_source: "calendly",
      meeting_at: new Date(Date.now() + 3 * 86400000).toISOString(),
      note: "初回面談",
    });
    console.log("  ✅ Booking created for 株式会社開発ファクトリー");
  }

  console.log("\n🎉 Seed completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
