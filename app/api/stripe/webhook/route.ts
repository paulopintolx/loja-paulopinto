import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook não configurado.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error);
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId && session.payment_status === 'paid') {
        const { error } = await getSupabaseAdmin()
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId);
        if (error) throw error;
      }
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      if (orderId) {
        const { error } = await getSupabaseAdmin()
          .from('orders')
          .update({ status: 'payment_failed' })
          .eq('id', orderId);
        if (error) throw error;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook processing failed', error);
    return NextResponse.json({ error: 'Erro ao atualizar encomenda.' }, { status: 500 });
  }
}
