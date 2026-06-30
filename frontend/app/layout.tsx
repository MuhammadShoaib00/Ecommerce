import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ShopFlow — Premium E-Commerce',
  description: 'A professional storefront for premium products, deals, and fast checkout.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f7f7f8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
