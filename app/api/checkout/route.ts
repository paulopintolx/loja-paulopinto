import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const products: Record<number, { name: string; unitAmount: number }> = {
  1: { name: 'Noite de Lisboa — impressão 30×40', unitAmount: 4200 },
  2: { name: 'Mar em Casa — impressão premium', unitAmount: 5800 },
  3: { name: 'Jardim Encantado — postal personalizado', unitAmount: 1800 },
  4: { name: 'Retrato Familiar — impressão de estúdio', unitAmount: 6400 },
};

type RequestedItem = { id: number; quantity: number };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items as RequestedItem[];
    const voucherCode = typeof body.voucherCode === 'string' ? body.voucherCode.trim().toUpperCase() : '';
    const customerEmail = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : undefined;

    if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
      return NextResponse.json({ error: 'Carrinho inválido.' }, { status: 400 });
    }

    const lineItems = [];
    let subtotal = 0;
    const safeItems = [];

    for (const requested of items) {
      const product = products[Number(requested?.id)];
      const quantity = Number(requested?.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: 'Produto ou quantidade inválida.' }, { status: 400 });
      }
      subtotal += product.unitAmount * quantity;
      safeItems.push({ id: Number(requested.id), name: product.name, quantity, unitAmount: product.unitAmount });
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: product.name },
          unit_amount: product.unitAmount,
        },
        quantity,
      });
    }

    let discountCents = 0;
    let voucherId: string | null = null;
    if (voucherCode) {
      const supabase = getSupabaseAdmin();
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select('id, code, discount_percent, active, valid_until')
        .eq('code', voucherCode)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      if (!voucher || (voucher.valid_until && new Date(voucher.valid_until) < new Date())) {
        return NextResponse.json({ error: 'Voucher inválido ou expirado.' }, { status: 400 });
      }
      const percent = Number(voucher.discount_percent);
      if (!Number.isFinite(percent) || percent <= 0 || percent > 100) {
        return NextResponse.json({ error: 'Configuração de voucher inválida.' }, { status: 400 });
      }
      discountCents = Math.min(subtotal, Math.round((subtotal * percent) / 100));
      voucherId = voucher.id;
    }

    const supabase = getSupabaseAdmin();
    const stripe = getStripe();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
    const orderPayload = {
      email: customerEmail || null,
      status: 'pending',
      items: safeItems,
      subtotal_cents: subtotal,
      discount_cents: discountCents,
      total_cents: subtotal - discountCents,
      voucher_id: voucherId,
    };

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single();
    if (insertError) throw insertError;

    let couponId: string | undefined;
    if (discountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency: 'eur',
        duration: 'once',
        name: `Voucher ${voucherCode}`,
        metadata: { order_id: order.id },
      });
      couponId = coupon.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      success_url: `${siteUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
      client_reference_id: order.id,
      metadata: { order_id: order.id, voucher_id: voucherId || '' },
      payment_intent_data: { metadata: { order_id: order.id } },
    });

    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);
    if (updateError) throw updateError;

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout creation failed', error);
    return NextResponse.json({ error: 'Não foi possível iniciar o pagamento. Tente novamente.' }, { status: 500 });
  }
}
