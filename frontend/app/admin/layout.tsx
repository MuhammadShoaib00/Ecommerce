'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace('/auth/login?redirect=/admin/dashboard');
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 bg-neutral-50 min-h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
