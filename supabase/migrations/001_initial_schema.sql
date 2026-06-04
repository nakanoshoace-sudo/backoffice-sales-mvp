-- ============================================
-- オンラインバックオフィス代行 MVP
-- 初期スキーマ
-- ============================================

-- leads テーブル
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  person_name text NOT NULL,
  email text NOT NULL,
  title text,
  employee_size text,
  pain_points text[] DEFAULT '{}',
  urgency text CHECK (urgency IN ('urgent', 'somewhat', 'researching', 'undecided')),
  source text,
  campaign text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'engaged', 'booked', 'proposal', 'won', 'lost')),
  score integer NOT NULL DEFAULT 0,
  opt_out boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_contacted_at timestamptz
);

-- lead_events テーブル
CREATE TABLE IF NOT EXISTS lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- messages テーブル
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  template_key text NOT NULL,
  subject text NOT NULL,
  body_snapshot text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  sent_at timestamptz,
  provider_message_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- bookings テーブル
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  booking_source text NOT NULL DEFAULT 'manual',
  booked_at timestamptz NOT NULL DEFAULT now(),
  meeting_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- pipeline_logs テーブル
CREATE TABLE IF NOT EXISTS pipeline_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_status text NOT NULL,
  to_status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON lead_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_logs_lead_id ON pipeline_logs(lead_id);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) - MVP: service role で全操作、anon は leads INSERT のみ
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;

-- 公開フォームからの INSERT を許可
CREATE POLICY "Allow public insert on leads" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- 公開フォームからの lead_events INSERT を許可
CREATE POLICY "Allow public insert on lead_events" ON lead_events
  FOR INSERT TO anon
  WITH CHECK (true);

-- 認証済みユーザーは全操作可能
CREATE POLICY "Authenticated full access on leads" ON leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access on lead_events" ON lead_events
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access on messages" ON messages
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access on bookings" ON bookings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access on pipeline_logs" ON pipeline_logs
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
