/**
 * LP コンテンツ設定 - 設計書準拠版
 * 文言差し替えはここだけ編集すれば全ページに反映される
 */
export const LP_CONTENT = {
  siteName: "オンラインバックオフィス代行",
  headerCta: "無料相談を申し込む",

  // Section 1: Hero
  heroEyebrow: "FOR SOLO CEO",
  heroHeadline1: "その\u300c事務作業\u300d\u3001",
  heroHeadline2: "年間700時間",
  heroHeadline3: "使っていませんか？",
  heroSub: "1人社長の平均的な事務作業時間は週12〜15時間。\n＝年間600〜700時間の「売上ゼロ時間」です。\nこの時間、売上に変えませんか。",
  heroCta: "▶ 60秒で分かる｜無料業務診断を受ける",
  heroCtaNote: "今月残り2枠 ／ 完全無料・営業なし",

  // Section 3: 診断
  diagnosisTitle: "⏱ 60秒｜あなたの\u300c隠れ事務コスト\u300d診断",
  diagnosisSub: "5つの質問に答えるだけで、月に何時間・いくら損しているかがその場でわかります。",

  // Section 5: 事例
  cases: [
    {
      name: "Webコンサルタント A.K様（40代）",
      revenue: "年商1,800万円・事業歴3年",
      plan: "STANDARD",
      before: ["請求書作成に毎月4時間", "メール対応で午前が消える", "月次収支が把握できない", "月間事務時間：約58時間"],
      after: ["完全代行で0時間に", "テンプレート化で週3時間に圧縮", "月次レポートを毎月10日に受け取る", "月間事務時間：約12時間（▲46時間）"],
      quote: "最初は何を任せていいか全くわからなかったのですが、業務棚卸しから一緒にやってもらえたので安心でした。今は提案書作りとクライアントとの打ち合わせだけに集中できています。売上も3ヶ月で1.3倍になりました",
    },
    {
      name: "オンラインショップ運営 M.T様（30代）",
      revenue: "年商2,400万円・事業歴5年",
      plan: "STANDARD",
      before: ["在庫・受発注管理に毎日2時間", "確定申告に毎年2週間消える", "問い合わせ対応が追いつかない", "月間事務時間：約65時間"],
      after: ["クラウド連携で管理工数を85%削減", "記帳代行で申告がスムーズに", "テンプレ返信で対応時間を70%削減", "月間事務時間：約15時間（▲50時間）"],
      quote: "最初はコストが心配でしたが、代行費用より取り戻した時間で生み出した売上のほうが遥かに大きかった。本当にやって良かったです。",
    },
  ],

  // Section 6: 料金プラン
  plans: [
    {
      name: "STARTER PLAN",
      nameJp: "お試し導入に",
      price: "¥45,000",
      period: "/月（税込）",
      initFee: null as string | null,
      hours: "月12時間",
      minTerm: "1ヶ月〜",
      slots: "月3社限定",
      unitPrice: "¥3,750/時間",
      popular: false,
      features: ["経理・請求メイン対応", "専任担当者1名", "チャットサポート", "業務報告（週次）"],
    },
    {
      name: "STANDARD PLAN",
      nameJp: "本格的な右腕として",
      price: "¥80,000",
      period: "/月（税込）",
      initFee: "初期費用 ¥50,000→¥30,000" as string | null,
      hours: "月25時間",
      minTerm: "3ヶ月〜",
      slots: "月5社限定",
      unitPrice: "¥3,200/時間",
      popular: true,
      features: ["経理・請求・総務・秘書 4カテゴリ全対応", "専任担当者1名＋サポート体制", "月次レポート提供", "業務棚卸しサポート（初回）", "Slackでの即時相談"],
    },
  ],

  // Section 9: 最終CTA
  finalCtaTitle1: "「事務作業に追われる毎日」を",
  finalCtaTitle2: "ここで終わりにしましょう。",
  finalCtaNote: "30分の無料相談で以下が明確になります",
  finalCtaPoints: ["どの業務を外注できるか", "月に何時間取り戻せるか", "どちらのプランが最適か"],
  finalCta: "無料相談を申し込む（完全無料）",
  contactEmail: "nakano.shoace@gmail.com",
};