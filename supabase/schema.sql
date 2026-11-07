-- Run this script in Supabase SQL Editor before enabling production checkout.
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'payment_failed', 'fulfilled', 'cancelled')),
  items jsonb not null,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  voucher_id uuid,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent numeric(5,2) not null check (discount_percent > 0 and discount_percent <= 100),
  active boolean not null default true,
  valid_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.orders
  add constraint orders_voucher_id_fkey foreign key (voucher_id) references public.vouchers(id) on delete set null;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  details text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'answered', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.vouchers enable row level security;
alter table public.quote_requests enable row level security;

-- No public policies: all writes are performed by server routes using the service role key.
revoke all on public.orders from anon, authenticated;
revoke all on public.vouchers from anon, authenticated;
revoke all on public.quote_requests from anon, authenticated;

insert into public.vouchers (code, discount_percent)
values ('PAULO10', 10), ('FESTA25', 25), ('PRINT15', 15)
on conflict (code) do nothing;

-- Private bucket for customer artwork. Configure upload authorization and user ownership
-- before exposing direct uploads in the browser; never make this bucket public.
insert into storage.buckets (id, name, public)
values ('customer-uploads', 'customer-uploads', false)
on conflict (id) do nothing;
