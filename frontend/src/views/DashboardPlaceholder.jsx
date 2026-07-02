import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import apiClient from '../api/client';

const DashboardPlaceholder = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      logoutStore();
      navigate('/login');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl text-accent mb-4">Dashboard (Phase 3 WIP)</h1>
      <button onClick={handleLogout} className="px-6 py-2 bg-black text-white">Logout</button>
    </div>
  );
};

export default DashboardPlaceholder;
