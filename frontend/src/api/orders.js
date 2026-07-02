import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await apiClient.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Also invalidate products since stock changed
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// For fetching invoice list (VIEW-01)
export const useInvoices = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['orders', { page, limit }],
    queryFn: async () => {
      // Assuming a GET /api/orders endpoint is created (we'll need this in Phase 3/4)
      const { data } = await apiClient.get('/orders', { params: { page, limit } });
      return data;
    },
  });
};
