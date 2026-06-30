'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { useToast } from '@/components/ui/Toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
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
      await signup(values.email, values.name, values.password);
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
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
          <h1 className="text-2xl font-bold text-neutral-900">Create account</h1>
          <p className="text-neutral-500 text-sm mt-1">Start shopping on ShopFlow today</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-4"
        >
          <FormField
            label="Full name"
            autoComplete="name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />

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
            autoComplete="new-password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isLoading} className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
