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
    mutationFn: async ({ file, jerseyName, category, year }) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const queryParams = new URLSearchParams();
      if (jerseyName) queryParams.append('jerseyName', jerseyName);
      if (category) queryParams.append('category', category);
      if (year) queryParams.append('year', year);

      const url = queryParams.toString() ? `/products/image?${queryParams.toString()}` : '/products/image';

      const { data } = await apiClient.post(url, formData, {
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
    mutationFn: async ({ skuId, data }) => {
      const response = await apiClient.patch(`/products/skus/${skuId}/restock`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, password }) => {
      const response = await apiClient.delete(`/products/${productId}`, {
        data: { password }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
