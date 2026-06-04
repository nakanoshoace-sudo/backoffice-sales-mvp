-- Migration 004: Stripe payment columns
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS stripe_customer_id     TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS plan                   TEXT,
  ADD COLUMN IF NOT EXISTS payment_status         TEXT DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_leads_stripe_customer     ON leads(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_stripe_subscription ON leads(stripe_subscription_id);