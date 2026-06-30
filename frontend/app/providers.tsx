'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/utils/queryClient';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
