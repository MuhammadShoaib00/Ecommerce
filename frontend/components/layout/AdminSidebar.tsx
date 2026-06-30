'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to store
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary-700 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
