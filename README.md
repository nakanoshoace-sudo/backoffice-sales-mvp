# オンラインバックオフィス代行 - 営業自動化MVP

## 概要

小規模〜中小企業向けのオンラインバックオフィス代行サービスの営業導線を半自動化するMVPです。

**営業フロー:** LP → 無料診断フォーム → 追客メール → 商談予約 → 成約

## 技術スタック

- **フレームワーク:** Next.js 15 (App Router)
- **言語:** TypeScript
- **DB:** Supabase (PostgreSQL)
- **認証:** Supabase Auth
- **メール送信:** Resend
- **スタイリング:** Tailwind CSS
- **デプロイ:** Vercel

## セットアップ

### 1. リポジトリのクローンと依存関係インストール

```bash
git clone <repo-url>
cd online-backoffice
npm install
```

> **注意:** このプロジェクトには `.npmrc` (`include=dev`) が含まれています。グローバル設定で `omit=dev` が有効な場合でも devDependencies がインストールされます。

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて各項目を設定してください。詳細は [docs/env-checklist.md](docs/env-checklist.md) を参照。

### 3. Supabase セットアップ

#### ローカル開発（Supabase CLI）

```bash
npx supabase init
npx supabase start
npx supabase db reset
```

#### クラウド（Supabase Dashboard）

1. https://supabase.com でプロジェクト作成
2. SQL Editor で `supabase/migrations/001_initial_schema.sql` を実行
3. Settings > API から URL と Key を `.env.local` に設定

### 4. 管理者アカウント作成

Supabase Dashboard > Authentication > Users から手動で管理者ユーザーを作成してください。

### 5. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

### 6. シードデータ投入

```bash
npm run seed
```

12件のダミーリードが投入されます。

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase サービスロールキー（サーバーのみ） |
| `RESEND_API_KEY` | ✅ | Resend APIキー |
| `RESEND_FROM_EMAIL` | ✅ | 送信元メールアドレス |
| `NEXT_PUBLIC_SITE_URL` | ✅ | サイトURL |
| `NEXT_PUBLIC_CALENDLY_URL` | - | Calendly予約ページURL（未設定時は簡易フォーム） |
| `CALENDLY_WEBHOOK_SECRET` | - | Calendly Webhook 署名キー |
| `NOTIFICATION_EMAIL` | - | 新規リード通知メール宛先 |
| `SLACK_WEBHOOK_URL` | - | Slack Webhook URL（新規リード通知） |
| `CRON_SECRET` | - | Vercel Cron 認証シークレット |
| `SENTRY_DSN` | - | Sentry DSN（エラー監視、未設定時はコンソールログのみ） |

## 画面一覧

| パス | 説明 |
|------|------|
| `/` | LP（ランディングページ） |
| `/diagnosis` | 無料診断フォーム |
| `/thanks` | サンクスページ |
| `/book` | 商談予約ページ |
| `/privacy` | プライバシーポリシー |
| `/legal/tokushoho` | 特定商取引法に基づく表記 |
| `/unsubscribe` | 配信停止完了ページ |
| `/admin` | ダッシュボード（ファネル指標付き） |
| `/admin/leads` | リード一覧 |
| `/admin/leads/[id]` | リード詳細 |
| `/admin/import` | CSVインポート（重複処理対応） |
| `/admin/login` | 管理者ログイン |

## API エンドポイント

| パス | メソッド | 認証 | 説明 |
|------|----------|------|------|
| `/api/leads` | POST | 不要 | フォームからリード作成（通知付き、同意保存） |
| `/api/leads` | GET | 必要 | リード一覧取得 |
| `/api/leads/[id]` | GET/PATCH | 必要 | リード詳細・更新 |
| `/api/leads/[id]/status` | PATCH | 必要 | ステータス変更 |
| `/api/leads/import` | POST | 必要 | CSVインポート（重複チェック付き） |
| `/api/leads/export` | GET | 必要 | CSVエクスポート（ステータスフィルタ可） |
| `/api/email/send` | POST | 必要 | メール送信 |
| `/api/bookings` | POST | 不要 | 予約作成 |
| `/api/dashboard` | GET | 必要 | ダッシュボード＋ファネル＋クリック指標 |
| `/api/unsubscribe` | GET/POST | 不要 | 配信停止 |
| `/api/track/click` | GET | 不要 | メールクリックトラッキング（リダイレクト） |
| `/api/cron/email-sequence` | GET | CRON_SECRET | 自動追客メール（Day 0-21） |
| `/api/webhooks/calendly` | POST | HMAC署名 | Calendly予約連携 |

## テスト方法

### 手動テスト

1. LP表示確認: http://localhost:3000
2. フォーム送信: http://localhost:3000/diagnosis
3. 管理画面: http://localhost:3000/admin (要ログイン)
4. seed実行後、ダッシュボードとリード一覧を確認

### 自動テスト（TODO）

```bash
npm test
```

## デプロイ方法

### Vercel

1. GitHub リポジトリを Vercel に接続
2. Environment Variables をすべて設定
3. Deploy

```bash
npx vercel --prod
```

### デプロイ前チェック

- [docs/launch-checklist.md](docs/launch-checklist.md) を参照

## よくあるトラブル

### Supabase 接続エラー

- `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` が正しいか確認
- Supabase プロジェクトが running 状態か確認

### メール送信エラー

- `RESEND_API_KEY` が有効か確認
- ドメイン認証が完了しているか確認（本番時）
- テスト時は `RESEND_FROM_EMAIL=onboarding@resend.dev` を使用

### 管理画面にアクセスできない

- Supabase Auth でユーザーを作成しているか確認
- ブラウザの Cookie をクリアして再ログイン

### RLS エラー

- `supabase/migrations/001_initial_schema.sql` を確認
- Service Role Key がサーバーサイドで使われているか確認

## ドキュメント

- [docs/PRD.md](docs/PRD.md) - 製品要件定義
- [docs/user-flow.md](docs/user-flow.md) - ユーザーフロー
- [docs/architecture.md](docs/architecture.md) - アーキテクチャ
- [docs/schema.md](docs/schema.md) - データベーススキーマ
- [docs/api.md](docs/api.md) - API仕様
- [docs/email-sequence.md](docs/email-sequence.md) - メールシーケンス
- [docs/ops-runbook.md](docs/ops-runbook.md) - 運用ランブック
- [docs/env-checklist.md](docs/env-checklist.md) - 環境変数チェックリスト
- [docs/launch-checklist.md](docs/launch-checklist.md) - ローンチチェックリスト
- [docs/todo.md](docs/todo.md) - TODO一覧

## ライセンス

Private
