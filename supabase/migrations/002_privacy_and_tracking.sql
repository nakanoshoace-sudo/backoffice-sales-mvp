-- ============================================
-- Sprint 4: 同意状態 + クリックトラッキング
-- ============================================

-- leads テーブルに同意日時カラムを追加
ALTER TABLE leads ADD COLUMN IF NOT EXISTS privacy_agreed_at timestamptz;

-- messages テーブルにクリックトラッキング用カラム追加
ALTER TABLE messages ADD COLUMN IF NOT EXISTS click_count integer NOT NULL DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS last_clicked_at timestamptz;
