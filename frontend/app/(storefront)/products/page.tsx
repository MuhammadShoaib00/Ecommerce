'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { ProductCard } from '@/features/catalog/ProductCard';
import { ProductFilters } from '@/features/catalog/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ProductQueryParams } from '@/types';

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductQueryParams>({
    sort: 'newest',
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
    placeholderData: (prev) => prev,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
    staleTime: Infinity,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">All Products</h1>
        {data && (
          <p className="text-sm text-neutral-500 mt-1">
            {data.total} product{data.total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <ProductFilters
            filters={filters}
            categories={categories}
            onChange={setFilters}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : !data?.items.length ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search term."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={filters.page ?? 1}
                    totalPages={data.totalPages}
                    onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
