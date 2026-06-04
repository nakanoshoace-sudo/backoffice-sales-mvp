# データベーススキーマ

## ER図（概要）

```
leads ──< lead_events
leads ──< messages
leads ──< bookings
leads ──< pipeline_logs
```

## テーブル定義

### leads

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, default gen_random_uuid() | |
| company_name | text | NOT NULL | 会社名 |
| person_name | text | NOT NULL | 氏名 |
| email | text | NOT NULL | メールアドレス |
| title | text | | 役職 |
| employee_size | text | | 従業員規模 |
| pain_points | text[] | | 困っている業務 |
| urgency | text | | urgent/somewhat/researching/undecided |
| source | text | | 流入元 |
| campaign | text | | キャンペーン |
| status | text | NOT NULL, default 'new' | ステータス |
| score | integer | NOT NULL, default 0 | スコア |
| opt_out | boolean | NOT NULL, default false | 配信停止 |
| notes | text | | メモ |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | |
| last_contacted_at | timestamptz | | 最終接触日 |

### lead_events

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| lead_id | uuid | FK → leads, NOT NULL | |
| type | text | NOT NULL | イベントタイプ |
| metadata | jsonb | | 追加データ |
| created_at | timestamptz | NOT NULL, default now() | |

イベントタイプ: `form_submitted`, `email_sent`, `email_clicked`, `page_visited`, `status_changed`, `score_changed`, `booking_created`

### messages

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| lead_id | uuid | FK → leads, NOT NULL | |
| template_key | text | NOT NULL | テンプレートキー |
| subject | text | NOT NULL | 件名 |
| body_snapshot | text | NOT NULL | 送信時の本文 |
| status | text | NOT NULL, default 'queued' | queued/sent/failed |
| sent_at | timestamptz | | 送信日時 |
| provider_message_id | text | | Resendのメッセージ ID |
| error_message | text | | エラー内容 |
| created_at | timestamptz | NOT NULL, default now() | |

### bookings

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| lead_id | uuid | FK → leads, NOT NULL | |
| booking_source | text | NOT NULL | calendly/manual/form |
| booked_at | timestamptz | NOT NULL, default now() | 予約作成日 |
| meeting_at | timestamptz | | 面談日時 |
| status | text | NOT NULL, default 'scheduled' | scheduled/completed/cancelled/no_show |
| note | text | | メモ |
| created_at | timestamptz | NOT NULL, default now() | |

### pipeline_logs

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| lead_id | uuid | FK → leads, NOT NULL | |
| from_status | text | NOT NULL | 変更前 |
| to_status | text | NOT NULL | 変更後 |
| reason | text | | 変更理由 |
| created_at | timestamptz | NOT NULL, default now() | |

## インデックス

- `leads.email` (ユニーク推奨だがMVPでは非ユニーク)
- `leads.status`
- `leads.created_at`
- `lead_events.lead_id`
- `messages.lead_id`
- `bookings.lead_id`
- `pipeline_logs.lead_id`
