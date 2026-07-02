import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

export const useProducts = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['products', { page, limit }],
    queryFn: async () => {
      const { data } = await apiClient.get('/products', { params: { page, limit } });
      return data;
    },
  });
};

export const useSearchProducts = (query) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      if (!query) return { products: [] };
      const { data } = await apiClient.get('/products/search', { params: { q: query } });
      return data;
    },
    enabled: !!query,
  });
};

export const useProductSkus = (productId) => {
  return useQuery({
    queryKey: ['products', productId, 'skus'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${productId}/skus`);
      return data;
    },
    enabled: !!productId,
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await apiClient.post('/products/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.url;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const { data } = await apiClient.post('/products', productData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useRestockSku = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ skuId, quantity }) => {
      const { data } = await apiClient.patch(`/products/skus/${skuId}/restock`, { quantity });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
