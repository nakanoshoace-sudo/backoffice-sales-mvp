import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia", typescript: true });
  }
  return _stripe;
}

// 後方互換のためのエクスポート（ビルド時に評価されない遅延評価）
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

export const PLANS = {
  STARTER: {
    name: "STARTER PLAN",
    nameJp: "お試し導入に",
    price: 45000,
    currency: "jpy",
    interval: "month" as const,
    minTermMonths: 1,
    slots: 3,
    hours: 12,
    unitPrice: 3750,
    initialFee: 0,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    features: [
      "経理・請求メイン対応",
      "専任担当者1名",
      "チャットサポート",
      "業務報告（週次）",
    ],
  },
  STANDARD: {
    name: "STANDARD PLAN",
    nameJp: "本格的な右腕として",
    price: 80000,
    currency: "jpy",
    interval: "month" as const,
    minTermMonths: 3,
    slots: 5,
    hours: 25,
    unitPrice: 3200,
    initialFee: 30000,
    priceId: process.env.STRIPE_STANDARD_PRICE_ID ?? "",
    initialFeePriceId: process.env.STRIPE_STANDARD_INITIAL_PRICE_ID ?? "",
    features: [
      "経理・請求・総務・秘書 4カテゴリ全対応",
      "専任担当者1名＋サポート体制",
      "月次レポート提供",
      "業務棚卸しサポート（初回）",
      "Slackでの即時相談",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;