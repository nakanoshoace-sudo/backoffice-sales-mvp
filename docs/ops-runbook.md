# 運用ランブック

## 日次オペレーション

### メール送信確認
1. 管理画面でダッシュボードを確認
2. 送信失敗メールがないか確認
3. 失敗がある場合は messages テーブルの error_message を確認

### リード対応
1. 新規リード（status: new）を確認
2. スコアの高いリードから優先対応
3. 対応したらステータスを contacted に更新

## 障害対応

### メール送信が止まった場合
1. Resend ダッシュボードでAPI状態確認
2. 環境変数 RESEND_API_KEY が正しいか確認
3. 送信元ドメインの認証状態確認
4. Vercel のログで エラーを確認

### Supabase接続エラー
1. Supabase ダッシュボードでプロジェクト状態確認
2. 環境変数が正しいか確認
3. Row Level Security ポリシーの確認

### 管理画面にログインできない
1. Supabase Auth の管理画面でユーザー状態確認
2. パスワードリセット実施
3. ブラウザのCookieクリア

## 定期メンテナンス

### 週次
- ダッシュボードのKPI確認
- 滞留リードの棚卸し
- メール送信率の確認

### 月次
- リードデータのバックアップ
- 不要データの整理
- メールテンプレートの効果確認・改善

## 緊急連絡先

| サービス | URL |
|----------|-----|
| Vercel | https://vercel.com/dashboard |
| Supabase | https://supabase.com/dashboard |
| Resend | https://resend.com/overview |

## バックアップ

- Supabase は自動バックアップあり（Pro plan以上）
- 重要データは定期的にCSVエクスポート推奨
