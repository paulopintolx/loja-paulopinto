'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tag: string;
  image: string;
};

type User = {
  name: string;
  email: string;
};

const catalog: Product[] = [
  {
    id: 1,
    name: 'Noite de Lisboa',
    description: 'Formato 30x40 em papel mate premium.',
    price: 42,
    tag: 'Premium',
    image:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Mar em Casa',
    description: 'Foto em caixa de madeira com acabamento fino.',
    price: 58,
    tag: 'Popular',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Jardim Encantado',
    description: 'Postal personalizado para eventos e felicitações.',
    price: 18,
    tag: 'Postal',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Retrato Familiar',
    description: 'Bicicleta e luz natural para uma estética elegante.',
    price: 64,
    tag: 'Studio',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
  },
];

const frames = ['Moldura Minimal', 'Moldura de Madeira', 'Moldura de Metal', 'Moldura Vintage'];
const occasions = ['Natal', 'Aniversário', 'Casamento', 'Agradecimento', 'New Year', 'Outros'];
const voucherList = [
  { code: 'PAULO10', discount: 10 },
  { code: 'FESTA25', discount: 25 },
  { code: 'PRINT15', discount: 15 },
];

export default function Storefront() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [quote, setQuote] = useState({ name: '', email: '', details: '' });

  useEffect(() => {
    const savedUser = window.localStorage.getItem('paulopinto-user');
    const savedCart = window.localStorage.getItem('paulopinto-cart');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('paulopinto-cart', JSON.stringify(cart));
  }, [cart]);

  const visibleProducts = useMemo(() => {
    if (selectedTag === 'Todos') return catalog;
    return catalog.filter((product) => product.tag === selectedTag);
  }, [selectedTag]);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = appliedVoucher ? (subtotal * appliedVoucher.discount) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const addToCart = (product: Product) => {
    setCart((current) => [...current, product]);
  };

  const removeFromCart = (index: number) => {
    setCart((current) => current.filter((_, idx) => idx !== index));
  };

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Preencha email e palavra-passe.');
      return;
    }

    const nextUser = {
      name: authMode === 'signup' ? customerName || 'Cliente' : user?.name || 'Cliente',
      email,
    };

    window.localStorage.setItem('paulopinto-user', JSON.stringify(nextUser));
    setUser(nextUser);
    setCustomerName('');
    setEmail('');
    setPassword('');
    setAuthMode('login');
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setUploadPreview(preview);
  };

  const applyVoucher = () => {
    const voucher = voucherList.find((item) => item.code.toLowerCase() === voucherCode.trim().toLowerCase());

    if (!voucher) {
      alert('Voucher inválido. Tente: PAULO10, FESTA25 ou PRINT15');
      return;
    }

    setAppliedVoucher(voucher);
    setVoucherCode('');
  };

  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Pedido de orçamento enviado com sucesso. Vamos responder por email em breve.');
    setQuote({ name: '', email: '', details: '' });
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">P</span>
          <div>
            <p className="eyebrow">PAULOPINTO</p>
            <h1>Loja de Fotografia</h1>
          </div>
        </div>

        <nav className="nav">
          <a href="#colecao">Coleção</a>
          <a href="#personalizar">Personalizar</a>
          <a href="#orcamento">Orçamento</a>
          <a href="#conta">Conta</a>
        </nav>

        <div className="nav-actions">
          <button className="ghost-button">Carrinho ({cart.length})</button>
          {user ? (
            <button className="primary-button" onClick={() => setUser(null)}>
              Sair
            </button>
          ) : (
            <button className="primary-button" onClick={() => setAuthMode('login')}>
              Entrar
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow accent">Fotografias premium</p>
          <h2>Impressões, postais e memórias únicas.</h2>
          <p>
            Crie postais personalizados, escolha molduras elegantes e transforme as suas fotografias em
            lembranças para celebrar cada momento.
          </p>
          <div className="cta-row">
            <a href="#colecao" className="primary-button">Comprar agora</a>
            <a href="#personalizar" className="ghost-button">Criar postal</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-card large">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
              alt="Fotografia de casal com luz natural"
            />
          </div>
          <div className="floating-card">
            <span className="pill">Temporada</span>
            <strong>Postais de Natal</strong>
            <small>Desde 18€</small>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <span>01</span>
          <h3>Fotografias para casa</h3>
          <p>Impressões em alta qualidade para paredes, presentes e coleções.</p>
        </div>
        <div className="feature-card">
          <span>02</span>
          <h3>Postais personalizados</h3>
          <p>Escolha molduras, temas e celebrações com um toque exclusivo.</p>
        </div>
        <div className="feature-card">
          <span>03</span>
          <h3>Vouchers e orçamentos</h3>
          <p>Crie vales de oferta e gere pedidos especiais a partir do checkout.</p>
        </div>
      </section>

      <section id="colecao" className="catalog-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow accent">Coleção</p>
            <h3>Fotografias e impressões em destaque</h3>
          </div>
          <div className="tag-filter">
            {['Todos', 'Premium', 'Popular', 'Postal', 'Studio'].map((tag) => (
              <button
                key={tag}
                className={selectedTag === tag ? 'active' : ''}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />
                <span>{product.tag}</span>
              </div>
              <div className="product-body">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div className="product-footer">
                  <strong>{product.price.toFixed(2)} €</strong>
                  <button className="primary-button small" onClick={() => addToCart(product)}>
                    Adicionar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="personalizar" className="studio-grid">
        <div className="studio-panel large-panel">
          <p className="eyebrow accent">Criar postal</p>
          <h3>Faça upload e personalize o seu cartão</h3>

          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <span>{uploadPreview ? 'Imagem carregada' : 'Carregar imagem'}</span>
          </label>

          {uploadPreview && (
            <div className="preview-card">
              <img src={uploadPreview} alt="Pré-visualização do upload" />
            </div>
          )}
        </div>

        <div className="studio-panel">
          <p className="eyebrow accent">Opções</p>
          <div className="option-stack">
            <div>
              <label>Moldura</label>
              <select value={selectedFrame} onChange={(event) => setSelectedFrame(event.target.value)}>
                {frames.map((frame) => (
                  <option key={frame} value={frame}>
                    {frame}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Ocasião</label>
              <select value={selectedOccasion} onChange={(event) => setSelectedOccasion(event.target.value)}>
                {occasions.map((occasion) => (
                  <option key={occasion} value={occasion}>
                    {occasion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Mensagem</label>
              <textarea defaultValue="Feliz Natal e um 2027 cheio de momentos especiais!" rows={4} />
            </div>
          </div>
        </div>
      </section>

      <section id="conta" className="account-grid">
        <div className="panel auth-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow accent">Conta local</p>
              <h3>{user ? `Bem-vindo, ${user.name}` : 'Acessar conta'}</h3>
            </div>
            <div className="tabs">
              <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
                Login
              </button>
              <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>
                Registar
              </button>
            </div>
          </div>

          {!user ? (
            <form onSubmit={handleAuth} className="auth-form">
              {authMode === 'signup' && (
                <div>
                  <label>Nome</label>
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="O seu nome" />
                </div>
              )}

              <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@email.com" />
              </div>

              <div>
                <label>Palavra-passe</label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
              </div>

              <button className="primary-button" type="submit">
                {authMode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
          ) : (
            <div className="account-summary">
              <p>Email: {user.email}</p>
              <p>Uploads e históricos ficam disponíveis na sua conta.</p>
            </div>
          )}
        </div>

        <div className="panel cart-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow accent">Checkout</p>
              <h3>Carrinho</h3>
            </div>
          </div>

          <div className="cart-list">
            {cart.length === 0 ? (
              <p className="empty-state">Ainda não adicionou produtos.</p>
            ) : (
              cart.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${index}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.tag}</small>
                  </div>
                  <div>
                    <span>{item.price.toFixed(2)} €</span>
                    <button onClick={() => removeFromCart(index)}>Remover</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="checkout-summary">
            <div>
              <span>Subtotal</span>
              <strong>{subtotal.toFixed(2)} €</strong>
            </div>
            <div>
              <span>Desconto</span>
              <strong>- {discountAmount.toFixed(2)} €</strong>
            </div>
            <div className="voucher-box">
              <input value={voucherCode} onChange={(event) => setVoucherCode(event.target.value)} placeholder="Código do voucher" />
              <button className="ghost-button" onClick={applyVoucher}>Aplicar</button>
            </div>
            <div className="total-row">
              <span>Total</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <button className="primary-button full" type="button">Pagar com Stripe</button>
          </div>
        </div>
      </section>

      <section id="orcamento" className="quote-section">
        <div className="panel quote-panel">
          <p className="eyebrow accent">Orçamento personalizado</p>
          <h3>Pede um orçamento para encomendas especiais</h3>

          <form onSubmit={submitQuote} className="quote-form">
            <div>
              <label>Nome</label>
              <input value={quote.name} onChange={(event) => setQuote((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div>
              <label>Email</label>
              <input value={quote.email} onChange={(event) => setQuote((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="full-width">
              <label>Detalhes da encomenda</label>
              <textarea
                rows={5}
                value={quote.details}
                onChange={(event) => setQuote((current) => ({ ...current, details: event.target.value }))}
              />
            </div>
            <button type="submit" className="primary-button">
              Enviar pedido
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p className="eyebrow accent">Paulopinto</p>
          <h4>Fotografias, impressões e postais únicos.</h4>
        </div>

        <div className="footer-links">
          <a href="mailto:encomendas@paulopinto.pt">encomendas@paulopinto.pt</a>
          <a href="#">Instagram</a>
          <a href="#">Política de Privacidade</a>
        </div>
      </footer>
    </main>
  );
}
