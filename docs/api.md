# API仕様

## 公開API

### POST /api/leads
無料診断フォームからのリード作成

**Request Body:**
```json
{
  "company_name": "株式会社テスト",
  "person_name": "山田太郎",
  "email": "yamada@example.com",
  "title": "代表取締役",
  "employee_size": "5-10",
  "pain_points": ["経理", "請求", "データ入力"],
  "urgency": "urgent",
  "source": "google",
  "campaign": "campaign_001",
  "notes": "相談希望"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "score": 25
}
```

## 管理画面API（認証必須）

### GET /api/leads
リード一覧取得

**Query Params:**
- `status` - フィルタ (optional)
- `limit` - 件数 (default: 50)
- `offset` - オフセット (default: 0)

**Response:** `200 OK`
```json
{
  "leads": [...],
  "total": 100
}
```

### GET /api/leads/[id]
リード詳細取得

### PATCH /api/leads/[id]
リード情報更新

### PATCH /api/leads/[id]/status
ステータス更新

**Request Body:**
```json
{
  "status": "contacted",
  "reason": "初回メール送信済み"
}
```

### GET /api/leads/[id]/events
イベント履歴取得

### GET /api/leads/[id]/messages
メール送信履歴取得

### POST /api/email/send
メール送信

**Request Body:**
```json
{
  "lead_id": "uuid",
  "template_key": "day_0_thanks"
}
```

### POST /api/bookings
予約作成

**Request Body:**
```json
{
  "lead_id": "uuid",
  "booking_source": "form",
  "meeting_at": "2024-01-15T10:00:00Z",
  "note": "オンライン面談"
}
```

### GET /api/dashboard
ダッシュボードデータ取得

**Response:** `200 OK`
```json
{
  "totalLeads": 100,
  "newLeadsThisWeek": 12,
  "statusBreakdown": { "new": 30, "contacted": 20, ... },
  "bookingsCount": 8,
  "wonCount": 3,
  "sourceBreakdown": { "google": 40, "referral": 20, ... },
  "recentEvents": [...],
  "leadsNeedingAttention": [...]
}
```

### POST /api/auth/login
管理者ログイン（Supabase Auth経由）

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```
