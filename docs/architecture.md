# アーキテクチャ

## 技術スタック

| レイヤー | 技術 | 理由 |
|----------|------|------|
| フレームワーク | Next.js 15 (App Router) | フルスタック、SSR/SSG、API Routes |
| 言語 | TypeScript | 型安全、保守性 |
| DB | Supabase (PostgreSQL) | 無料枠あり、リアルタイム、Auth付き |
| 認証 | Supabase Auth | 管理画面保護、シンプル |
| メール | Resend | 開発者体験◎、React Email対応 |
| スタイリング | Tailwind CSS | ユーティリティファースト、高速開発 |
| UI | shadcn/ui（最小限） | コピペベース、依存少 |
| ホスティング | Vercel | Next.jsネイティブ、自動デプロイ |
| 予約 | Calendly（外部） | MVPでは外部サービス活用 |

## ディレクトリ構成

```
online-backoffice/
├── docs/                    # ドキュメント
├── scripts/                 # seed等のスクリプト
├── supabase/
│   └── migrations/          # SQLマイグレーション
├── src/
│   ├── app/
│   │   ├── page.tsx         # LP
│   │   ├── diagnosis/       # 無料診断フォーム
│   │   ├── thanks/          # サンクス
│   │   ├── book/            # 商談予約
│   │   ├── admin/           # 管理画面
│   │   │   ├── login/
│   │   │   ├── leads/
│   │   │   └── page.tsx     # ダッシュボード
│   │   └── api/             # API Routes
│   │       ├── leads/
│   │       ├── email/
│   │       ├── bookings/
│   │       ├── dashboard/
│   │       └── auth/
│   ├── lib/
│   │   ├── supabase/        # Supabaseクライアント
│   │   ├── email/           # メール送信・テンプレート
│   │   ├── scoring.ts       # スコアリングロジック
│   │   ├── constants.ts     # 定数
│   │   └── validations.ts   # Zodスキーマ
│   ├── components/
│   │   ├── ui/              # 基本UIコンポーネント
│   │   └── ...              # 機能コンポーネント
│   └── middleware.ts        # 認証ミドルウェア
├── .env.example
├── package.json
├── README.md
└── next.config.ts
```

## データフロー

```
[ブラウザ] → [Next.js API Route] → [Supabase DB]
                    ↓
              [Resend API] → [メール送信]
```

## 認証フロー

```
/admin/* へアクセス
    ↓
middleware.ts で Supabase セッション確認
    ↓
未認証 → /admin/login へリダイレクト
認証済み → ページ表示
```

## セキュリティ方針

- 管理画面は Supabase Auth で保護
- API Route は適切な認証チェック付き
- 環境変数は .env.local で管理（.gitignore済み）
- Service Role Key はサーバーサイドのみ
- フォーム入力は Zod でバリデーション
- XSS対策はReactのデフォルトエスケープに依存
- CSRF対策はNext.jsのデフォルト挙動に依存

## デプロイ

- Vercel にGitHub連携でデプロイ
- 環境変数は Vercel Dashboard で設定
- Supabase は別途プロジェクト作成
- ドメインは Vercel で設定
