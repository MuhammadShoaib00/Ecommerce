import { Package } from 'lucide-react';
import Link from 'next/link';

const footerGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/auth/login' },
      { label: 'Create Account', href: '/auth/signup' },
      { label: 'My Orders', href: '/orders' },
      { label: 'Cart', href: '/cart' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-100 bg-white text-neutral-500">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:px-12">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-black uppercase tracking-[0.04em] text-neutral-950">
            <Package className="h-7 w-7 text-primary-600" />
            <span>
              Shop<span className="text-primary-600">Flow</span>
            </span>
          </Link>
          <p className="mt-4 max-w-[240px] text-sm leading-6">
            Premium products, unbeatable prices, exceptional service.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-sm font-black text-neutral-950">{group.title}</h3>
            <div className="flex flex-col gap-2">
              {group.links.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm transition hover:text-primary-600">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-black text-neutral-950">We Accept</h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-black text-neutral-700">
            {['VISA', 'MC', 'PayPal', 'Pay'].map((method) => (
              <span key={method} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center shadow-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} ShopFlow. Built for modern commerce.
      </div>
    </footer>
  );
}
