export const metadata = {
  title: 'Loja Paulopinto',
  description: 'Loja de fotografia, impressões, postais personalizados e vouchers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
