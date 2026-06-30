'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { useToast } from '@/components/ui/Toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      const redirect = searchParams.get('redirect') ?? '/';
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      toast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 mb-4">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="text-neutral-500 text-sm mt-1">Sign in to your ShopFlow account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4"
        >
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <FormField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isLoading} className="w-full mt-1">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-xs text-neutral-500 space-y-1">
          <p className="font-semibold text-neutral-700 mb-2">Seeded test accounts:</p>
          <p>Admin: admin@shop.com / Admin@123</p>
          <p>Customer: customer@shop.com / Customer@123</p>
        </div>
      </div>
    </div>
  );
}
