# 環境変数チェックリスト

## 必須環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase プロジェクトURL | Supabase Dashboard > Settings > API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 匿名キー | Supabase Dashboard > Settings > API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase サービスロールキー | Supabase Dashboard > Settings > API |
| RESEND_API_KEY | Resend APIキー | Resend Dashboard > API Keys |
| RESEND_FROM_EMAIL | 送信元メールアドレス | ドメイン認証後に設定 |
| NEXT_PUBLIC_SITE_URL | サイトURL | デプロイ後のURL |

## オプション環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| NEXT_PUBLIC_CALENDLY_URL | Calendly予約ページURL | (なし - 簡易フォームにフォールバック) |

## 環境別設定

### ローカル開発
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（ローカル用）
SUPABASE_SERVICE_ROLE_KEY=eyJ...（ローカル用）
RESEND_API_KEY=re_test_...
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CALENDLY_URL=
```

### 本番 (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=info@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link
```

## セキュリティ注意

- `SUPABASE_SERVICE_ROLE_KEY` は絶対にクライアントサイドに露出させないこと
- `RESEND_API_KEY` もサーバーサイドのみで使用
- `NEXT_PUBLIC_` プレフィックスが付いている変数のみクライアントに公開される
