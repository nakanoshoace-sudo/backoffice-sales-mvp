# TODO

## 優先度: 高（公開前に必須）

- [x] Supabase プロジェクト作成・接続設定
- [ ] Vercel デプロイ設定
- [ ] 本番ドメイン設定
- [ ] Resend ドメイン認証（送信元のDKIM/SPF設定）
- [x] Calendly Webhook 設定 + HMAC署名検証
- [ ] 管理者アカウント作成（Supabase Auth）
- [ ] CRON_SECRET を Vercel に設定
- [x] 配信停止機能
- [x] 特定商取引法表記（/legal/tokushoho）- データ駆動化済み
- [ ] 特商法表記の事業者情報を正式情報に更新（src/app/legal/tokushoho/page.tsx の LEGAL_INFO）
- [x] プライバシーポリシー
- [ ] プライバシーポリシーの連絡先を正式情報に更新
- [x] 診断フォームにプライバシーポリシー同意チェック
- [x] Sentry SDK 導入済み
- [ ] Sentry DSN を本番環境に設定

## 優先度: 中

- [ ] メール開封トラッキング（Pixel方式）
- [x] メールクリックトラッキング
- [x] メール別成果比較（/api/dashboard/email-stats）
- [x] source別予約率・成約率
- [x] won/lost/proposal 理由保存（close_reason）
- [x] フォーム離脱分析（form_analytics テーブル）
- [x] LP文言の設定ファイル化（src/lib/lp-content.ts）
- [x] CSVインポート / エクスポート
- [ ] リードのバルク操作（一括ステータス変更）
- [ ] メールテンプレートの管理画面編集
- [ ] OGP画像設定
- [ ] Google Analytics / GTM 導入

## 優先度: 低

- [ ] 複数ユーザー対応
- [ ] LINE連携
- [ ] リードスコアリング機械学習化
- [ ] レポート自動生成
- [ ] 顧客別ダッシュボード
- [ ] API認証強化

## エラー監視・可観測性

- [x] 構造化JSONログ
- [x] @sentry/nextjs SDK 導入済み
- [x] PII除去
- [ ] Vercel ログ確認フロー整備
- [ ] アラート設定
- [ ] Uptime 監視

## 技術的負債

- [ ] テスト追加
- [ ] CI/CD パイプライン
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ対応
- [ ] global-error.tsx 追加
