import { useQuery } from '@tanstack/react-query';
import apiClient from './client';

export const useDashboardStats = (range = 1) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', range],
    queryFn: async () => {
      const { data } = await apiClient.get(`/dashboard/stats?range=${range}`);
      return data;
    },
  });
};
