html {
  scroll-behavior: smooth;
}

:root {
  --bg: #f6f0ea;
  --surface: #fffdfb;
  --panel: #f2e9e3;
  --card: #ffffff;
  --text: #1f1d1c;
  --muted: #5f5753;
  --accent: #b97752;
  --accent-dark: #8b5934;
  --line: rgba(31, 29, 28, 0.08);
  --shadow: 0 20px 50px rgba(20, 17, 15, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #f9f4ef 0%, #f3eeea 100%);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

img {
  display: block;
  width: 100%;
}

.page-shell {
  max-width: 1320px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}

.topbar,
.hero,
.features-grid,
.catalog-section,
.studio-grid,
.account-grid,
.quote-section,
.site-footer {
  width: 100%;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 28px;
  gap: 24px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--text);
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
}

.brand-block h1 {
  margin: 0;
  font-size: 1.07rem;
  letter-spacing: 0.08em;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.eyebrow.accent {
  color: var(--accent-dark);
}

.nav {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 0.92rem;
  color: var(--muted);
}

.nav a {
  transition: color 0.2s ease;
}

.nav a:hover {
  color: var(--text);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-button,
.ghost-button,
.tag-filter button,
.tabs button,
.cart-item button {
  border: none;
  border-radius: 999px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.primary-button {
  background: var(--text);
  color: #fff;
  padding: 0.9rem 1.5rem;
  font-weight: 600;
}

.ghost-button {
  padding: 0.86rem 1.4rem;
  background: rgba(31, 29, 28, 0.04);
  color: var(--text);
  border: 1px solid var(--line);
}

.primary-button:hover,
.ghost-button:hover,
.tag-filter button:hover,
.tabs button:hover {
  transform: translateY(-1px);
}

.primary-button.small {
  padding: 0.7rem 1rem;
  font-size: 0.85rem;
}

.primary-button.full {
  width: 100%;
  margin-top: 12px;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 42px;
  padding: 28px 0 44px;
}

.hero-copy h2 {
  margin: 0 0 18px;
  font-size: clamp(2.6rem, 3vw, 4.5rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.hero-copy p {
  max-width: 560px;
  margin: 0;
  color: var(--muted);
  font-size: 1.06rem;
  line-height: 1.7;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-card {
  overflow: hidden;
  border-radius: 34px;
  background: var(--card);
  box-shadow: var(--shadow);
}

.photo-card.large {
  width: min(100%, 640px);
  aspect-ratio: 1 / 1.4;
}

.photo-card img {
  height: 100%;
  object-fit: cover;
}

.floating-card {
  position: absolute;
  right: 28px;
  bottom: 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 22px;
  background: rgba(255,255,255,0.86);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow);
}

.pill {
  display: inline-flex;
  width: fit-content;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  background: rgba(185, 119, 82, 0.1);
  color: var(--accent-dark);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 10px 0 22px;
}

.feature-card,
.product-card,
.panel {
  background: rgba(255,255,255,0.74);
  border: 1px solid var(--line);
  border-radius: 28px;
  box-shadow: var(--shadow);
}

.feature-card {
  padding: 24px 22px;
}

.feature-card span {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--accent-dark);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
}

.feature-card h3 {
  margin: 0 0 10px;
  font-size: 1.45rem;
}

.feature-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.catalog-section,
.quote-section {
  padding-top: 32px;
}

.section-heading,
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.section-heading h3,
.quote-panel h3,
.panel h3 {
  margin: 0;
  font-size: clamp(2rem, 2vw, 2.8rem);
  letter-spacing: -0.04em;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-filter button,
.tabs button {
  padding: 0.72rem 1rem;
  background: rgba(31, 29, 28, 0.04);
  color: var(--text);
}

.tag-filter button.active,
.tabs button.active {
  background: var(--text);
  color: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.product-card {
  overflow: hidden;
}

.product-image-wrap {
  position: relative;
  height: 300px;
}

.product-image-wrap img {
  height: 100%;
  object-fit: cover;
}

.product-image-wrap span {
  position: absolute;
  left: 14px;
  top: 14px;
  padding: 0.45rem 0.75rem;
  background: rgba(255,255,255,0.82);
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.product-body {
  padding: 18px 18px 22px;
}

.product-body h4 {
  margin: 0;
  font-size: 1.32rem;
}

.product-body p {
  margin: 8px 0 18px;
  color: var(--muted);
  line-height: 1.6;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-footer strong {
  font-size: 1.1rem;
}

.studio-grid,
.account-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 22px;
  padding-top: 36px;
}

.panel {
  padding: 24px 22px;
}

.large-panel,
.auth-panel,
.cart-panel,
.quote-panel {
  min-height: 100%;
}

.upload-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  width: 100%;
  border: 2px dashed rgba(31, 29, 28, 0.2);
  border-radius: 24px;
  background: rgba(31, 29, 28, 0.02);
  color: var(--muted);
  margin-top: 18px;
  cursor: pointer;
}

.upload-box input {
  display: none;
}

.preview-card {
  overflow: hidden;
  border-radius: 24px;
  margin-top: 20px;
  max-height: 420px;
}

.preview-card img {
  object-fit: cover;
  max-height: 420px;
}

.option-stack {
  display: grid;
  gap: 18px;
}

.option-stack label,
.auth-form label,
.quote-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--muted);
}

.option-stack select,
.option-stack textarea,
.auth-form input,
.quote-form input,
.quote-form textarea,
.voucher-box input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.7);
  color: var(--text);
}

.auth-form,
.quote-form {
  display: grid;
  gap: 14px;
}

.tabs {
  display: inline-flex;
  gap: 10px;
}

.account-summary {
  display: grid;
  gap: 12px;
  color: var(--muted);
}

.checkout-summary {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.checkout-summary > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.voucher-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.voucher-box input {
  flex: 1;
}

.total-row {
  border-top: 1px solid var(--line);
  padding-top: 12px;
  font-size: 1.12rem;
}

.cart-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.cart-item strong,
.cart-item small {
  display: block;
}

.cart-item small {
  color: var(--muted);
}

.cart-item button {
  margin-left: 8px;
  background: transparent;
  color: var(--accent-dark);
  font-size: 0.78rem;
}

.empty-state {
  color: var(--muted);
}

.quote-form {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quote-form .full-width {
  grid-column: 1 / -1;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 38px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.site-footer h4 {
  margin: 0;
  font-size: 1.1rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--muted);
}

@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero,
  .studio-grid,
  .account-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
  }
}

@media (max-width: 760px) {
  .page-shell {
    padding-inline: 16px;
  }

  .nav {
    display: none;
  }

  .features-grid,
  .product-grid,
  .quote-form {
    grid-template-columns: 1fr;
  }

  .site-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .cta-row,
  .nav-actions {
    width: 100%;
  }

  .cta-row > *,
  .nav-actions > * {
    flex: 1;
  }
}
