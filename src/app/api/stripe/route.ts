import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { plan: PlanKey; email?: string; leadId?: string };
    const { plan: planKey, email, leadId } = body;

    if (!planKey || !(planKey in PLANS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLANS[planKey];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const lineItems: { price: string; quantity: number }[] = [];

    // STANDARDプランの初期費用
    if (planKey === "STANDARD") {
      const stdPlan = PLANS.STANDARD;
      if (stdPlan.initialFeePriceId) {
        lineItems.push({ price: stdPlan.initialFeePriceId, quantity: 1 });
      }
    }

    if (plan.priceId) {
      lineItems.push({ price: plan.priceId, quantity: 1 });
    } else {
      // Price IDが未設定時のフォールバック（開発用）
      const created = await stripe.prices.create({
        currency: plan.currency,
        product_data: { name: plan.name },
        unit_amount: plan.price,
        recurring: { interval: plan.interval },
      });
      lineItems.push({ price: created.id, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: { plan: planKey, leadId: leadId ?? "" },
      billing_address_collection: "required",
      locale: "ja",
      subscription_data: { metadata: { plan: planKey, leadId: leadId ?? "" } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}