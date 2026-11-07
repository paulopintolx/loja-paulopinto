# Loja Paulopinto — deploy e serviços externos

O projeto contém a base Next.js para Netlify, rotas de servidor Stripe e pedidos de orçamento, e o esquema Supabase.

## Setup local
- Node.js 20+
- `npm install`
- Copiar `.env.example` para `.env.local` e preencher os valores
- Executar o SQL de `supabase/schema.sql` no Supabase SQL Editor
- `npm run dev`

## Supabase
1. Criar um projeto Supabase.
2. Executar `supabase/schema.sql` no SQL Editor.
3. Guardar a Project URL, anon key e service-role key nas variáveis do ambiente.
4. A service-role key é segredo de servidor: nunca colocar em `NEXT_PUBLIC_*`, no browser ou no Git.
5. O bucket `customer-uploads` é privado. Antes de ativar uploads de clientes, implementar políticas Storage que restrinjam cada ficheiro ao utilizador autenticado; não tornar o bucket público.
6. A autenticação e a experiência de conta ainda precisam de ser ligadas à Auth do Supabase no frontend antes de produção.

## Stripe
1. Começar com chaves de teste `sk_test_...`.
2. Criar endpoint de webhook apontando para `https://loja.paulopinto.pt/api/stripe/webhook` e subscrever `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` e `checkout.session.expired`.
3. Configurar `STRIPE_WEBHOOK_SECRET` com o segredo do endpoint.
4. A rota de checkout aceita apenas IDs e quantidades; os preços são definidos no servidor. Os vouchers são verificados na tabela Supabase `vouchers`.
5. Testar pagamento, cancelamento e webhook com cartão Stripe de teste antes de passar a live.

## Netlify
- Ligar o repositório GitHub `paulopintolx/loja-paulopinto` como site Netlify.
- `netlify.toml` define build e plugin Next.js.
- Definir estas variáveis no Site configuration → Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CONTACT_EMAIL`.
- Para emails de orçamento, configurar `RESEND_API_KEY` e `RESEND_FROM_EMAIL` com um remetente verificado no Resend. O destinatário padrão é `encomendas@paulopinto.pt`.
- Adicionar `loja.paulopinto.pt` em Domain management e configurar os registos DNS indicados pela Netlify.

## Estado / checklist antes da produção
- Checkout server-side: preparado, dependente de configuração e testes Stripe/Supabase.
- Webhook: valida assinatura e atualiza estado da encomenda.
- Pedido de orçamento: persiste no Supabase e pode enviar email via Resend.
- Catálogo/preços do checkout: IDs de demonstração e valores definidos em `app/api/checkout/route.ts`; substituir pelos preços e produtos aprovados pela loja.
- Frontend ainda precisa de chamar `/api/checkout` e `/api/quote`, ligar Supabase Auth e implementar uploads autenticados com políticas Storage. A conta local atual não é autenticação de produção; não recolher palavras-passe reais até à integração com Supabase Auth.
- Rever RGPD, termos de venda, política de privacidade, portes, IVA e configuração legal antes de abrir ao público.

Não commitar segredos. Usar variáveis de ambiente na Netlify e no ambiente local.
