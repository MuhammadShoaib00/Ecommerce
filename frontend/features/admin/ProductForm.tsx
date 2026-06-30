'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number({ error: 'Price must be a number' }).min(0),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().optional(),
  stockQuantity: z.number({ error: 'Stock must be a number' }).int().min(0),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSubmit: (data: FormValues & { price: number }) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialValues, onSubmit, isLoading }: ProductFormProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stockQuantity: 0,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name ?? '',
        description: initialValues.description ?? '',
        price: initialValues.price !== undefined ? initialValues.price / 100 : 0,
        imageUrl: initialValues.imageUrl ?? '',
        category: (initialValues.category as any)?._id ?? initialValues.category ?? '',
        stockQuantity: initialValues.stockQuantity ?? 0,
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      price: Math.round(values.price * 100), // convert dollars → cents
      imageUrl: values.imageUrl || undefined,
      category: values.category || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Product Name"
        required
        error={errors.name?.message}
        {...register('name')}
      />
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Product description…"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-danger">{errors.description.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Price ($)"
          type="number"
          step="0.01"
          min="0"
          required
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <FormField
          label="Stock Quantity"
          type="number"
          min="0"
          required
          error={errors.stockQuantity?.message}
          {...register('stockQuantity', { valueAsNumber: true })}
        />
      </div>
      <Select
        label="Category"
        {...register('category')}
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </Select>
      <FormField
        label="Image URL"
        type="url"
        placeholder="https://example.com/image.jpg"
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        {initialValues ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  );
}
