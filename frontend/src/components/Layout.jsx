import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import apiClient from '../api/client';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'inventory_2' },
  { path: '/invoices', label: 'Orders', icon: 'shopping_cart' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      logoutStore();
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-light font-body overflow-x-hidden">
      {/* Side Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[240px] z-50 bg-[#FFFFFF] border-r-[3px] border-vexor-black shadow-[4px_0px_0px_#0A0A0A] overflow-y-auto" style={{ borderRadius: 0 }}>
        <div className="p-6 border-b-[3px] border-vexor-black">
          <Link to="/" className="block w-full">
            <img src="/src/assets/horizontal_black.png" alt="Vexor Logo" className="w-full h-auto object-contain" />
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <ul className="flex flex-col gap-3">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-[12px] font-headline text-[1.05rem] italic uppercase font-[900] border-[2px] transition-all duration-150 ${
                      isActive
                        ? 'bg-vexor-orange text-white border-vexor-black shadow-[3px_3px_0px_#0A0A0A]'
                        : 'text-secondary border-transparent hover:bg-surface-neutral hover:text-vexor-black hover:border-vexor-black hover:shadow-[3px_3px_0px_#E5E5E5]'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-secondary font-headline text-lg italic uppercase w-full border-2 border-transparent hover:bg-surface-neutral hover:text-on-background hover:border-border-muted transition-colors duration-150"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        {/* Top App Bar */}
        <header className="h-16 border-b border-border-muted bg-surface-light flex justify-between items-center px-8 sticky top-0 z-40">
          <h2 className="font-headline text-xl font-bold italic text-on-surface uppercase md:hidden">VEXOR OPS</h2>
          
          <div className="hidden md:flex flex-1 items-center max-w-md">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-border-muted">search</span>
              <input
                className="w-full bg-surface-neutral border-b border-border-muted py-2 pl-10 pr-4 font-body text-base placeholder-border-muted shadow-none focus:border-vexor-orange"
                placeholder="SEARCH SKUS, ORDERS..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 bg-vexor-black text-white flex items-center justify-center font-headline font-bold text-sm">
              V
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-light border-t border-border-muted flex justify-around py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || 
            (item.path === '/dashboard' && location.pathname === '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${isActive ? 'text-vexor-orange' : 'text-secondary'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
