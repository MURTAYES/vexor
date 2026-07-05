import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import apiClient from '../api/client';
import { useDashboardStats } from '../api/dashboard';
import { LogOut, PackageSearch, ReceiptText, PlusCircle, AlertTriangle, TrendingUp, Hash } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      logoutStore();
      navigate('/login');
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-5xl text-accent uppercase mb-2">Vexor ERP</h1>
            <p className="font-bold text-muted uppercase">Seller Dashboard</p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-white text-black border-2 border-black px-6 py-3 hover:bg-black hover:text-white font-bold uppercase transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="bg-white border-2 border-black p-6 shadow-brutal flex items-center justify-between">
            <div>
              <p className="font-bold text-muted uppercase text-sm mb-1">Today's Invoices</p>
              <div className="font-heading text-4xl text-black">
                {statsLoading ? '-' : stats?.today_invoices || 0}
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-accent opacity-20" />
          </div>

          <div className={`bg-white border-2 border-black p-6 shadow-brutal flex items-center justify-between ${stats?.low_stock_alerts > 0 ? 'border-accent' : ''}`}>
            <div>
              <p className={`font-bold uppercase text-sm mb-1 ${stats?.low_stock_alerts > 0 ? 'text-accent' : 'text-muted'}`}>Low-Stock Alerts</p>
              <div className={`font-heading text-4xl ${stats?.low_stock_alerts > 0 ? 'text-accent' : 'text-black'}`}>
                {statsLoading ? '-' : stats?.low_stock_alerts || 0}
              </div>
            </div>
            <AlertTriangle className={`w-12 h-12 opacity-20 ${stats?.low_stock_alerts > 0 ? 'text-accent opacity-100' : 'text-muted'}`} />
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-brutal flex items-center justify-between">
            <div>
              <p className="font-bold text-muted uppercase text-sm mb-1">Total SKUs</p>
              <div className="font-heading text-4xl text-black">
                {statsLoading ? '-' : stats?.total_skus || 0}
              </div>
            </div>
            <Hash className="w-12 h-12 text-black opacity-20" />
          </div>

        </div>

        {/* Navigation Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link to="/checkout" className="block group">
            <div className="bg-white border-2 border-black p-8 shadow-brutal group-hover:shadow-brutalHover group-hover:border-accent transition-all duration-200 flex flex-col items-center text-center">
              <PlusCircle className="w-16 h-16 mb-4 group-hover:text-accent transition-colors" />
              <h2 className="font-heading text-3xl uppercase mb-2">New Invoice</h2>
              <p className="font-bold text-muted uppercase text-sm">Create a new order & checkout</p>
            </div>
          </Link>

          <Link to="/inventory" className="block group">
            <div className="bg-white border-2 border-black p-8 shadow-brutal group-hover:shadow-brutalHover group-hover:border-accent transition-all duration-200 flex flex-col items-center text-center">
              <PackageSearch className="w-16 h-16 mb-4 group-hover:text-accent transition-colors" />
              <h2 className="font-heading text-3xl uppercase mb-2">Inventory</h2>
              <p className="font-bold text-muted uppercase text-sm">Manage products & restock</p>
            </div>
          </Link>

          <Link to="/invoices" className="block group">
            <div className="bg-white border-2 border-black p-8 shadow-brutal group-hover:shadow-brutalHover group-hover:border-accent transition-all duration-200 flex flex-col items-center text-center">
              <ReceiptText className="w-16 h-16 mb-4 group-hover:text-accent transition-colors" />
              <h2 className="font-heading text-3xl uppercase mb-2">Invoices</h2>
              <p className="font-bold text-muted uppercase text-sm">View past orders</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
