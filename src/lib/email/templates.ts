interface EmailTemplate {
  key: string;
  day: number;
  subject: string;
  body: (vars: TemplateVars) => string;
}

interface TemplateVars {
  person_name: string;
  company_name: string;
  booking_url: string;
  unsubscribe_url: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: "day_0_thanks",
    day: 0,
    subject: "無料診断のお申し込みありがとうございます",
    body: (vars) => `${vars.person_name} 様

この度は、オンラインバックオフィス代行の無料診断にお申し込みいただき、
誠にありがとうございます。

お送りいただいた内容を確認し、貴社の業務改善に向けた
ご提案を準備しております。

ご不明点やご質問がございましたら、お気軽にご返信ください。

▼ 無料相談のご予約はこちら
${vars.booking_url}

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_2_challenges",
    day: 2,
    subject: "バックオフィスでよくある3つの課題",
    body: (vars) => `${vars.person_name} 様

先日は無料診断へのお申し込みありがとうございました。

中小企業のバックオフィスでは、以下の3つの課題が
特に多く見られます。

━━━━━━━━━━━━━━━━━━━━
■ 課題1: 属人化
特定の担当者しかわからない業務が多く、
退職や休職時にリスクが発生する

■ 課題2: 時間不足
社長や管理職が事務作業に追われ、
本業に集中できない

■ 課題3: コスト
正社員を雇うほどの業務量ではないが、
放置すると業務が回らない
━━━━━━━━━━━━━━━━━━━━

${vars.company_name} 様でも、似たような課題を
お感じではないでしょうか。

弊社では、これらの課題を月額制のオンライン代行で解決しています。

▼ 詳しいご相談はこちら
${vars.booking_url}

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_5_case_study",
    day: 5,
    subject: "導入事例：月20時間の業務削減に成功",
    body: (vars) => `${vars.person_name} 様

本日は、オンラインバックオフィス代行をご導入いただいた
企業様の事例をご紹介いたします。

━━━━━━━━━━━━━━━━━━━━
【導入事例】IT企業 A社様（従業員12名）

■ 導入前の課題
- 経理処理を社長が自ら対応（月15時間）
- 請求書作成が属人化
- データ入力が溜まりがち

■ 導入後の効果
- 社長の事務作業時間：月20時間 → 月2時間
- 請求書の遅延ゼロ
- データ入力の当日完了率 95%以上

■ ご利用プラン
スタンダードプラン（月額15万円）
━━━━━━━━━━━━━━━━━━━━

正社員1名を雇うよりも低コストで、
すぐに体制を整えることができます。

▼ 無料相談のご予約
${vars.booking_url}

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_8_plans",
    day: 8,
    subject: "お客様に最適なプランのご案内",
    body: (vars) => `${vars.person_name} 様

オンラインバックオフィス代行では、
貴社の業務量に合わせた3つのプランをご用意しています。

━━━━━━━━━━━━━━━━━━━━
■ ライトプラン（月額8万円）
- 月40時間までの業務代行
- 経理・請求の基本サポート
- 専任担当者1名

■ スタンダードプラン（月額15万円）★人気
- 月80時間までの業務代行
- 経理・請求・総務・秘書業務
- 専任担当者1名 + サブ担当
- 月次レポート付き

■ プレミアムプラン（月額30万円）
- 月160時間までの業務代行
- バックオフィス全般をカバー
- 専任チーム体制
- 業務改善コンサルティング付き
━━━━━━━━━━━━━━━━━━━━

どのプランが最適か、無料相談で詳しくご説明いたします。

▼ 無料相談のご予約
${vars.booking_url}

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_12_booking",
    day: 12,
    subject: "無料相談のご案内（30分で課題が明確に）",
    body: (vars) => `${vars.person_name} 様

先日の無料診断から、少しお時間が経ちましたが、
バックオフィスの状況はいかがでしょうか。

弊社の無料相談では、30分のオンライン面談で

✓ 貴社の課題の整理
✓ 最適なプランのご提案
✓ 導入後の業務イメージ

をお伝えしています。
もちろん、ご相談のみで契約の必要はございません。

▼ 無料相談のご予約（最短翌日対応可）
${vars.booking_url}

お気軽にご相談ください。

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_16_reminder",
    day: 16,
    subject: "まだ間に合います：無料相談のご案内",
    body: (vars) => `${vars.person_name} 様

お忙しいところ恐れ入ります。

バックオフィスの業務改善について、
まだご検討いただけるようでしたら、
ぜひ一度お話しさせてください。

多くのお客様が「もっと早く相談すればよかった」と
おっしゃっています。

▼ 30分の無料相談はこちら
${vars.booking_url}

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
  {
    key: "day_21_final",
    day: 21,
    subject: "【最後のご案内】無料相談について",
    body: (vars) => `${vars.person_name} 様

これまで数回にわたりご案内をお送りしてまいりましたが、
本メールを最後のご案内とさせていただきます。

もしバックオフィスの業務負担でお困りのことがありましたら、
いつでもご相談ください。

▼ 無料相談のご予約
${vars.booking_url}

今後のご連絡が不要な場合は、下記より配信停止いただけます。

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━
オンラインバックオフィス代行
━━━━━━━━━━━━━━━━━━━━

配信停止: ${vars.unsubscribe_url}`,
  },
];

export function getTemplate(key: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.key === key);
}

export function renderTemplate(
  key: string,
  vars: TemplateVars
): { subject: string; body: string } | null {
  const template = getTemplate(key);
  if (!template) return null;

  return {
    subject: template.subject,
    body: template.body(vars),
  };
}
