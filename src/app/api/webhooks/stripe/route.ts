import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = getSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const planKey  = session.metadata?.plan ?? "";
        const leadId   = session.metadata?.leadId ?? "";
        const email    = session.customer_email ?? session.customer_details?.email ?? "";
        if (supabase && leadId) {
          await supabase.from("leads").update({
            status: "won", plan: planKey,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          }).eq("id", leadId);
        }
        await notifySlack(`✅ 決済完了: ${email} / ${planKey} / ¥${(session.amount_total ?? 0).toLocaleString()}`);
        break;
      }
      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice & { subscription?: string };
        const subId = inv.subscription ?? "";
        await notifySlack(`💴 月次決済成功: ${inv.customer_email ?? ""} sub=${subId}`);
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        await notifySlack(`⚠️ 決済失敗: ${inv.customer_email ?? ""} — フォローが必要`);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        if (supabase) {
          await supabase.from("leads")
            .update({ status: "lost", close_reason: "解約（Stripe）" })
            .eq("stripe_subscription_id", sub.id);
        }
        await notifySlack(`🔴 解約: subscription ${sub.id}`);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook]", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function notifySlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  } catch { /* fire and forget */ }
}