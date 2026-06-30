'use client';

import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '@/lib/api/recommendations';
import { ProductCard } from '@/features/catalog/ProductCard';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Home-page "Popular Products" row — real products pulled from the API
 * (top-sellers / personalized recommendations), rendered with the shared,
 * fully-functional ProductCard (working add-to-cart + links to detail pages).
 */
export function PopularProducts() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['home-popular'],
    queryFn: recommendationsApi.get,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500">
        No products available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {data.slice(0, 4).map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
