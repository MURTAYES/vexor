import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      // Request as blob since the backend now returns a PDF buffer (ORD-06)
      const response = await apiClient.post('/orders', orderData, {
        responseType: 'blob',
      });

      // Extract invoice number from custom header
      const invoiceNumber = response.headers['x-invoice-number'] || 'unknown';
      const orderId = response.headers['x-order-id'] || '';

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vexor-invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { invoiceNumber, orderId };
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
      const { data } = await apiClient.get('/orders', { params: { page, limit } });
      return data;
    },
  });
};

// Download PDF for a past order
export const downloadOrderPdf = async (orderId, invoiceNumber) => {
  const response = await apiClient.get(`/orders/${orderId}/pdf`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vexor-invoice-${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Resend email for an order (ORD-10)
export const useResendEmail = () => {
  return useMutation({
    mutationFn: async (orderId) => {
      const { data } = await apiClient.post(`/orders/${orderId}/resend-email`);
      return data;
    },
  });
};
