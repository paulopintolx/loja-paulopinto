import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    const details = typeof body.details === 'string' ? body.details.trim().slice(0, 5000) : '';

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || details.length < 10) {
      return NextResponse.json({ error: 'Indique nome, email válido e detalhes (mínimo 10 caracteres).' }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from('quote_requests')
      .insert({ name, email, details })
      .select('id')
      .single();
    if (error) throw error;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const recipient = process.env.CONTACT_EMAIL || 'encomendas@paulopinto.pt';
      const from = process.env.RESEND_FROM_EMAIL;
      if (!from) throw new Error('RESEND_FROM_EMAIL is required when Resend is enabled');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [recipient],
          reply_to: email,
          subject: `Pedido de orçamento — ${name}`,
          text: `Nome: ${name}\nEmail: ${email}\n\nPedido:\n${details}\n\nReferência: ${data.id}`,
        }),
      });
      if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
    }

    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Quote request failed', error);
    return NextResponse.json({ error: 'Não foi possível enviar o pedido. Tente novamente.' }, { status: 500 });
  }
}
