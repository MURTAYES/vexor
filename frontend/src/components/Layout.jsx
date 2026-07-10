import { useState, useEffect } from 'react';
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isSidebarExpanded) {
        setIsSidebarExpanded(true);
      } else if (window.innerWidth < 768 && isSidebarExpanded) {
        setIsSidebarExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarExpanded]);

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
      <nav 
        className={`flex flex-col fixed left-0 top-0 h-full z-50 bg-[#FFFFFF] border-r-[3px] border-vexor-black transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden ${isSidebarExpanded ? 'w-[240px] shadow-[4px_0px_0px_#0A0A0A]' : 'w-[80px]'}`} 
        style={{ borderRadius: 0 }}
      >
        <div className={`p-6 border-b-[3px] border-vexor-black flex items-center h-24 ${isSidebarExpanded ? 'justify-between' : 'justify-center px-2'}`}>
          <Link to="/" className={`block ${isSidebarExpanded ? 'w-full' : 'w-10'}`}>
            {isSidebarExpanded ? (
              <img src="/src/assets/horizontal_black.png" alt="Vexor Logo" className="w-full h-auto object-contain" />
            ) : (
              <img src="/src/assets/logo.png" alt="Vexor Icon" className="w-full h-auto object-contain" />
            )}
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {/* Toggle Button for Mobile/Desktop */}
          <button 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`mb-6 flex items-center justify-center py-2 text-vexor-black border-2 border-transparent hover:border-vexor-black transition-colors ${isSidebarExpanded ? 'self-end px-2' : 'w-full'}`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarExpanded ? 'menu_open' : 'menu'}
            </span>
          </button>

          <ul className="flex flex-col gap-3">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center py-[12px] font-headline text-[1.05rem] italic uppercase font-[900] border-[2px] transition-all duration-150 ${
                      isSidebarExpanded ? 'justify-start px-4 gap-3' : 'justify-center px-0'
                    } ${
                      isActive
                        ? 'bg-vexor-orange text-white border-vexor-black shadow-[3px_3px_0px_#0A0A0A]'
                        : 'text-secondary border-transparent hover:bg-surface-neutral hover:text-vexor-black hover:border-vexor-black hover:shadow-[3px_3px_0px_#E5E5E5]'
                    }`}
                    style={{ borderRadius: 0 }}
                    title={!isSidebarExpanded ? item.label : undefined}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {isSidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className={`flex items-center py-3 text-secondary font-headline text-lg italic uppercase w-full border-2 border-transparent hover:bg-surface-neutral hover:text-on-background hover:border-border-muted transition-colors duration-150 ${
                isSidebarExpanded ? 'justify-start px-4 gap-3' : 'justify-center px-0'
              }`}
              title={!isSidebarExpanded ? "Logout" : undefined}
            >
              <span className="material-symbols-outlined">logout</span>
              {isSidebarExpanded && <span>Logout</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-[240px]' : 'ml-[80px]'}`}
      >
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

          <div className="flex items-center gap-6 ml-auto md:ml-0">
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
    </div>
  );
};

export default Layout;
