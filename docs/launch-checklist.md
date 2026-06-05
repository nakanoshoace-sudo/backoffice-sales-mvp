# 営業開始前チェックリスト
# online-backoffice MVP — 2026-06-05 作成

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 【全体マップ】
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
##
##  LP公開  →  フォーム送信  →  メール自動送信  →  商談予約  →  決済
##   ✅完了       ✅完了           🔶確認中         🔶要設定     🔶要確認
##
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ A. インフラ・デプロイ
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [✅] Next.js ビルド (32ルート, TypeScriptエラー0)
  [✅] Vercel 本番デプロイ
       URL: https://backoffice-sales-mvp.vercel.app
  [✅] Vercel 環境変数 全14件設定済み
  [✅] GitHub 自動デプロイ設定済み (mainブランチpush → 自動反映)
  [  ] カスタムドメイン設定 ★未対応
       → Vercel Dashboard > Domains で独自ドメインを設定
       → 例: backoffice.shoace.com など


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ B. LP・フロントエンド
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [✅] LP 8セクション実装 (ライトブルーSaaSデザイン)
  [✅] 診断フォーム (/diagnosis) — DB保存確認済み
  [✅] 料金プランページ (/pricing)
  [✅] チェックアウトページ (/checkout)
  [✅] 特定商取引法ページ (/legal/tokushoho) — 実際の事業者情報に更新済み
  [✅] プライバシーポリシーページ (/privacy)
  [  ] プライバシーポリシーの内容確認 ★要確認
       → /privacy の内容が実態に合っているか確認
  [  ] LP文言の最終確認 ★要確認
       → 実績数値・お客様の声などプレースホルダーが残っていないか


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ C. メール配信
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [✅] Resend ドメイン認証済み (agematch.jp)
  [✅] Day 0 サンクスメール — フォーム送信時に即時送信
  [✅] 管理者通知メール — nakano.shoace@gmail.com に新規リード通知
  [🔶] メール受信テスト ★要確認
       → /diagnosis からフォーム送信後、メールが届いているか確認
  [  ] Day 2〜21 フォローメール ★要テスト
       → 毎朝9時にcronが走る設定 (vercel.json)
       → 手動テスト: /api/cron/email-sequence に CRON_SECRET付きでGETリクエスト
  [  ] メール文面の確認 ★要確認
       → src/lib/email/templates.ts の内容を確認・修正


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ D. Stripe 決済
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [✅] Stripe 本番アカウント設定済み
  [✅] 商品・価格作成済み
       STARTER:  price_1Ted8cCVTqqUCbAJGyBHLLi3 (¥45,000/月)
       STANDARD: price_1Ted8yCVTqqUCbAJ8eSqVSXU (¥80,000/月)
       初期費用:  price_1Ted98CVTqqUCbAJZnroElyo (¥30,000/1回)
  [✅] Stripe Webhook 設定済み
  [  ] 決済フロー動作テスト ★要確認
       → /pricing → STARTER選択 → メールアドレス入力 → Stripeページが開くか
       → テストカード: 4242 4242 4242 4242 (有効期限: 任意未来, CVC: 任意)
  [  ] Stripe 銀行口座登録確認 ★要確認
       → https://dashboard.stripe.com/settings/payouts
       → 入金先口座が登録されているか確認


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ E. 管理画面
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [✅] 管理者アカウント作成済み
       URL:   https://backoffice-sales-mvp.vercel.app/admin/login
       Email: nakano.shoace@gmail.com
       PW:    (admin-credentials.txt 参照)
  [  ] 管理画面ログイン確認 ★要確認
       → ログインできるか
       → リード一覧が表示されるか
  [  ] リードステータス管理の操作確認 ★要確認
       → new → contacted → ... → won の流れを動かせるか


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ F. 商談予約 (Calendly)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [  ] Calendly アカウント作成 ★未対応
       → https://calendly.com で無料アカウント作成
       → 「30分無料相談」イベント作成
  [  ] LPの予約URLを実際のCalendlyリンクに差し替え ★未対応
       → src/lib/lp-content.ts の booking_url を更新
  [  ] Calendly Webhook 設定 (任意)
       → CALENDLY_WEBHOOK_SECRET を Vercel に設定


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ■ G. 集客・トラフィック
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [  ] SNS/DM での告知 ★営業開始時
       → LP URL をX/InstagramなどでシェアするときにUTMパラメータ付与
       → 例: ?source=twitter&campaign=launch
  [  ] Google Search Console 登録 (任意)
       → https://search.google.com/search-console
  [  ] OGP画像設定 (任意)
       → SNSシェア時のサムネイル画像を設定


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 【優先度別まとめ】
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
##
##  🔴 営業開始に必須 (今すぐやる)
##  ┣ メール受信テスト確認 (フォーム送信してメールが届くか)
##  ┣ 管理画面ログイン確認
##  ┣ Stripe決済フロー確認
##  ┗ Stripe銀行口座登録確認
##
##  🟡 できれば営業開始前に (1週間以内)
##  ┣ Calendly作成 + LP予約URLを差し替え
##  ┣ カスタムドメイン設定
##  ┣ LP文言・プレースホルダーの最終確認
##  ┗ メールテンプレート (Day2〜21) の文面確認
##
##  🟢 営業開始後でOK
##  ┣ Google Search Console登録
##  ┣ OGP画像設定
##  ┗ Slack通知設定 (SLACK_WEBHOOK_URL)
##
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 保存ファイル一覧 (すべて .gitignore 対象)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
##  stripe-keys.txt       — Stripe全キー
##  supabase-keys.txt     — Supabase anon/service_role キー
##  admin-credentials.txt — 管理画面ログイン情報
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
