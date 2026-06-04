-- ============================================
-- Sprint 5: close_reason + フォーム分析
-- ============================================

-- leads テーブルに成約/失注理由カラム追加
ALTER TABLE leads ADD COLUMN IF NOT EXISTS close_reason text;

-- フォーム行動分析テーブル
CREATE TABLE IF NOT EXISTS form_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event text NOT NULL,
  field text,
  metadata jsonb,
  event_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_analytics_session ON form_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_form_analytics_event ON form_analytics(event);

-- RLS: 公開からのINSERTを許可
ALTER TABLE form_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on form_analytics" ON form_analytics
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated full access on form_analytics" ON form_analytics
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
