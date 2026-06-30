'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast('Thanks for subscribing!', 'success');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-14 flex-1 rounded-xl border border-neutral-200 bg-white px-5 text-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
      />
      <button
        type="submit"
        className="h-14 rounded-xl bg-gradient-to-r from-[#2493ff] to-[#005eff] px-8 text-sm font-bold text-white shadow-[0_12px_25px_rgba(0,101,255,0.26)] transition hover:-translate-y-0.5"
      >
        Subscribe
      </button>
    </form>
  );
}
