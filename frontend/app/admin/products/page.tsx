'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { adminApi } from '@/lib/api/admin';
import { ProductForm } from '@/features/admin/ProductForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => productsApi.list({ page, limit: 20 }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const create = useMutation({
    mutationFn: adminApi.createProduct,
    onSuccess: () => { invalidate(); setCreateOpen(false); toast('Product created', 'success'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => { invalidate(); setEditTarget(null); toast('Product updated', 'success'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => { invalidate(); setDeleteTarget(null); toast('Product deleted', 'success'); },
    onError: (e: Error) => toast(e.message, 'error'),
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Add product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Price</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data?.items.map((p) => (
                  <tr key={p._id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-4 py-3">
                      {p.category ? (
                        <Badge variant="neutral">{p.category.name}</Badge>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={p.stockQuantity === 0 ? 'text-danger font-medium' : 'text-neutral-700'}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditTarget(p)}
                          className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-neutral-400 hover:text-danger hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
              <span>Page {page} of {data.totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Product">
        <ProductForm
          onSubmit={(values) => create.mutate(values as unknown as Partial<Product>)}
          isLoading={create.isPending}
        />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Product">
        {editTarget && (
          <ProductForm
            initialValues={editTarget}
            onSubmit={(values) => update.mutate({ id: editTarget._id, data: values as unknown as Partial<Product> })}
            isLoading={update.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product">
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                variant="danger"
                isLoading={remove.isPending}
                onClick={() => remove.mutate(deleteTarget._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
