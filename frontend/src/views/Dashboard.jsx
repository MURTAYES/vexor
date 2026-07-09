import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus, Package, ShoppingCart,
  TrendingUp, AlertTriangle, CheckCircle,
  Bell, Search, Download, ArrowRight, LogOut,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

// 6. Mock Data
const MOCK_DATA = {
  today: {
    revenueToday:   4800,
    ordersToday:    3,
    activeSkuCount: 6,
    restockCount:   4,
    revenueSparkline: [800, 1200, 2400, 1600, 3200, 2800, 4800],
    ordersSparkline:  [0, 1, 2, 1, 3, 2, 3],
    recentOrders: [
      { id: 'VX-20260709-003', customer: 'Rahim Hossain', total: 2400, status: 'confirmed', date: '9 Jul, 10:45' },
      { id: 'VX-20260709-002', customer: 'Tanvir Ahmed',  total: 1800, status: 'confirmed', date: '9 Jul, 09:22' },
      { id: 'VX-20260709-001', customer: 'Sumaiya Khanam',total: 600,  status: 'confirmed', date: '9 Jul, 08:57' },
    ],
    lowStockItems: [
      { productId: 'p1', productName: 'Real Madrid Away', size: 'L',  stock: 1 },
      { productId: 'p2', productName: 'FC Barcelona Home', size: 'XL', stock: 0 },
      { productId: 'p3', productName: 'Paris SG Home',    size: 'M',  stock: 2 },
      { productId: 'p4', productName: 'Real Madrid Home', size: 'S',  stock: 1 },
    ],
  },
  week: {
    revenueToday:   32500,
    ordersToday:    18,
    activeSkuCount: 6,
    restockCount:   4,
    revenueSparkline: [4000, 4200, 4800, 3100, 6200, 5400, 4800],
    ordersSparkline:  [3, 2, 4, 1, 5, 4, 3],
    recentOrders: [
      { id: 'VX-20260709-003', customer: 'Rahim Hossain', total: 2400, status: 'confirmed', date: '9 Jul, 10:45' },
      { id: 'VX-20260708-005', customer: 'Ali Akbar',  total: 4800, status: 'confirmed', date: '8 Jul, 14:22' },
      { id: 'VX-20260707-001', customer: 'Nusrat Jahan',total: 2400,  status: 'void', date: '7 Jul, 08:57' },
    ],
    lowStockItems: [
      { productId: 'p1', productName: 'Real Madrid Away', size: 'L',  stock: 1 },
      { productId: 'p2', productName: 'FC Barcelona Home', size: 'XL', stock: 0 },
    ]
  },
  month: {
    revenueToday:   128400,
    ordersToday:    72,
    activeSkuCount: 6,
    restockCount:   2,
    revenueSparkline: [12000, 15000, 18000, 22000, 19000, 28000, 14400],
    ordersSparkline:  [8, 12, 10, 15, 11, 19, 7],
    recentOrders: [
      { id: 'VX-20260709-003', customer: 'Rahim Hossain', total: 2400, status: 'confirmed', date: '9 Jul, 10:45' },
      { id: 'VX-20260630-012', customer: 'Fahim Morshed',  total: 7200, status: 'confirmed', date: '30 Jun, 16:12' },
    ],
    lowStockItems: [
      { productId: 'p2', productName: 'FC Barcelona Home', size: 'XL', stock: 0 },
      { productId: 'p4', productName: 'Real Madrid Home', size: 'S',  stock: 1 },
    ]
  }
};

const NAV_ITEMS = [
  { label: 'OVERVIEW',    icon: LayoutDashboard, route: '/dashboard' },
  { label: 'NEW INVOICE', icon: FilePlus,         route: '/invoices/new' },
  { label: 'INVENTORY',   icon: Package,           route: '/inventory' },
  { label: 'ORDERS',      icon: ShoppingCart,      route: '/orders'    },
];

// 7. Sparkline Component
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 96, H = 32;

  const points = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H,
  ]);

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <svg width={W} height={H} style={{ position: 'absolute', bottom: 16, right: 16 }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Subcomponents
function NavItem({ item, isActive }) {
  const Icon = item.icon;
  return (
    <Link 
      to={item.route}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 20px',
        backgroundColor: isActive ? '#FF5500' : 'transparent',
        borderLeft: isActive ? '3px solid #FF7733' : '3px solid transparent',
        color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.55)',
        fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
        fontSize: '0.72rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#1A1A1A';
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
        }
      }}
    >
      <Icon size={18} />
      {item.label}
    </Link>
  );
}

function LogoutButton() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%',
        padding: '12px 20px',
        backgroundColor: 'transparent',
        border: 'none', borderLeft: '3px solid transparent',
        color: 'rgba(255,255,255,0.55)',
        fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
        fontSize: '0.72rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#1A1A1A';
        e.currentTarget.style.color = '#FF5500';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
      }}
    >
      <LogOut size={18} />
      LOGOUT
    </button>
  );
}

function DateRangeToggle({ range, setRange }) {
  const options = [
    { value: 'today', label: 'TODAY' },
    { value: 'week', label: 'THIS WEEK' },
    { value: 'month', label: 'THIS MONTH' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {options.map((opt, i) => {
        const isActive = range === opt.value;
        
        return (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            style={{
              background: isActive ? '#0A0A0A' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#595959',
              border: '1.5px solid #E5E5E5',
              borderLeft: i > 0 ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              padding: '6px 14px',
              borderRadius: 0,
              cursor: 'pointer',
              boxShadow: isActive ? '4px 4px 0px #FF5500' : 'none',
              zIndex: isActive ? 10 : 1,
              position: 'relative',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ label, icon, value, valueStyle, subLabel, sparklineData, sparklineColor }) {
  return (
    <div 
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E5E5E5',
        padding: '20px',
        boxShadow: '4px 4px 0px #E5E5E5',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        cursor: 'default',
        borderRadius: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-1px, -1px)';
        e.currentTarget.style.boxShadow = '6px 6px 0px #FF5500';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900, color: '#0A0A0A', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {icon}
      </div>
      <div style={{ ...valueStyle, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ borderTop: '2px solid #0A0A0A', paddingTop: '8px', display: 'inline-block' }}>
        <span style={{ fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.7rem', color: '#595959', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {subLabel}
        </span>
      </div>
      {sparklineData && <Sparkline data={sparklineData} color={sparklineColor} />}
    </div>
  );
}

function CommandLog({ orders }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const todayTotal = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  const handlePdf = (e, id) => {
    e.stopPropagation();
    // trigger GET /api/orders/{id}/pdf
    window.open(`/api/orders/${id}/pdf`, '_blank');
  };

  return (
    <div style={{
      background: '#FFFFFF', border: '1.5px solid #E5E5E5', boxShadow: '4px 4px 0px #E5E5E5', borderRadius: 0
    }}>
      {/* Header */}
      <div style={{
        background: '#0A0A0A', color: '#FFFFFF', padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.05em' }}>
          ▐ COMMAND LOG // RECENT ORDERS
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex' }}>
            {['all', 'confirmed', 'void'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? '#FF5500' : '#1A1A1A',
                  color: filter === f ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                  fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
                  fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '4px 10px', border: 'none', borderRadius: 0, cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '0.1em' }}>
            VIEW ALL →
          </button>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F2F2F2', borderBottom: '2px solid #0A0A0A' }}>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'left', width: '160px' }}>INVOICE #</th>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'left' }}>CUSTOMER</th>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'left', width: '120px' }}>TOTAL</th>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'left', width: '130px' }}>STATUS</th>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'left', width: '110px' }}>DATE</th>
            <th style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#595959', padding: '10px 16px', textAlign: 'center', width: '48px' }}>PDF</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center' }}>
                <Package size={32} color="#E5E5E5" style={{ margin: '0 auto' }} />
                <p style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.75rem', color: '#595959', letterSpacing: '0.15em', marginTop: '12px' }}>
                  NO ORDERS YET TODAY
                </p>
                <button
                  onClick={() => navigate('/invoices/new')}
                  style={{
                    marginTop: '16px', background: '#FF5500', color: '#FFFFFF', border: 'none',
                    padding: '8px 16px', fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
                    fontSize: '0.75rem', letterSpacing: '0.15em', cursor: 'pointer', borderRadius: 0,
                    boxShadow: '3px 3px 0px #0A0A0A'
                  }}
                >
                  + NEW INVOICE
                </button>
              </td>
            </tr>
          ) : (
            filteredOrders.map(o => (
              <tr 
                key={o.id}
                onClick={() => navigate(`/orders/${o.id}`)}
                style={{ borderBottom: '1px solid #E5E5E5', cursor: 'pointer', transition: 'background-color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF8F5'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.78rem', color: '#0A0A0A' }}>{o.id}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.85rem' }}>
                  <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.customer}</div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.88rem', color: '#0A0A0A', textAlign: 'right' }}>
                  ৳ {o.total.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: o.status === 'confirmed' ? '#0A0A0A' : '#F2F2F2',
                    color: o.status === 'confirmed' ? '#FFFFFF' : '#595959',
                    border: o.status === 'confirmed' ? '1px solid #0A0A0A' : '1px solid #595959',
                    padding: '3px 8px', fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif",
                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: 0
                  }}>
                    {o.status === 'confirmed' ? '■ CONFIRMED' : 'VOID'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.75rem', color: '#595959' }}>{o.date}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={(e) => handlePdf(e, o.id)}
                    style={{
                      border: '1.5px solid #E5E5E5', width: '28px', height: '28px', background: '#FFFFFF',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      borderRadius: 0, transition: 'all 150ms'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#FF5500';
                      e.currentTarget.style.boxShadow = '2px 2px 0px #FF5500';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E5E5E5';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Download size={14} color="#0A0A0A" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid #0A0A0A', background: '#F2F2F2' }}>
            <td colSpan={2} style={{ padding: '10px 16px', fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#595959' }}>
              TOTAL FOR VIEW
            </td>
            <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '1rem', fontWeight: 700, color: '#0A0A0A' }}>
              ৳ {todayTotal.toLocaleString()}
            </td>
            <td colSpan={3} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function LowStockPanel({ items }) {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#FFFFFF', border: '1.5px solid #E5E5E5', boxShadow: '4px 4px 0px #E5E5E5', borderRadius: 0,
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{
        background: '#0A0A0A', color: '#FFFFFF', padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.05em' }}>
          ⚠ LOW STOCK ALERTS
        </span>
        <span style={{
          background: '#FF5500', color: '#FFFFFF', padding: '1px 7px',
          fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.62rem', borderRadius: 0
        }}>
          {items.length}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <CheckCircle size={28} color="#22C55E" style={{ margin: '0 auto' }} />
            <p style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.72rem', color: '#22C55E', letterSpacing: '0.15em', marginTop: '10px' }}>
              ALL STOCK HEALTHY
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #E5E5E5', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#0A0A0A', textTransform: 'uppercase' }}>
                {item.productName}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{
                  fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.7rem', letterSpacing: '0.10em',
                  color: item.stock === 0 ? '#DC2626' : '#FF5500', textTransform: 'uppercase'
                }}>
                  SIZE {item.size} · {item.stock === 0 ? 'OUT OF STOCK' : `${item.stock} LEFT`}
                </span>
                <button
                  onClick={() => navigate(`/inventory/${item.productId}/restock`)}
                  style={{
                    background: 'transparent', border: '1px solid #E5E5E5', borderRadius: 0,
                    padding: '3px 8px', fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.58rem',
                    letterSpacing: '0.12em', color: '#595959', cursor: 'pointer',
                    boxShadow: '2px 2px 0px #E5E5E5', transition: 'all 150ms'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#FF5500';
                    e.currentTarget.style.color = '#FF5500';
                    e.currentTarget.style.boxShadow = '2px 2px 0px #FF5500';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E5E5E5';
                    e.currentTarget.style.color = '#595959';
                    e.currentTarget.style.boxShadow = '2px 2px 0px #E5E5E5';
                  }}
                >
                  RESTOCK →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function DashboardPage() {
  const [range, setRange] = useState('today');
  const [data, setData] = useState(MOCK_DATA.today);
  const navigate = useNavigate();

  useEffect(() => {
    // 8. Auto-refresh KPI data every 60 seconds
    const interval = setInterval(() => {
      setData(prev => ({ ...prev })); // dummy trigger for mock refresh
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Re-fetch or re-filter mock data based on range
    setData(MOCK_DATA[range]);
  }, [range]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F2F2' }}>
      {/* 1. Sidebar */}
      <aside style={{ width: 180, minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
        <div style={{ padding: '24px 20px 32px', borderBottom: '1px solid #222' }}>
          <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', color: '#FF5500', letterSpacing: '-0.02em' }}>
            // VEXOR
          </span>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map(item => (
            <NavItem key={item.label} item={item} isActive={item.route === '/dashboard'} />
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #222', padding: '16px 0' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, marginLeft: 180, display: 'flex', flexDirection: 'column' }}>
        {/* 2. Topbar */}
        <div style={{
          height: 64, background: '#FFFFFF', borderBottom: '2px solid #E5E5E5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1.5px solid #E5E5E5', padding: '8px 14px', flex: 1, maxWidth: 480,
            boxShadow: '2px 2px 0px #E5E5E5', borderRadius: 0
          }}>
            <Search size={14} color="#595959" />
            <input
              placeholder="SEARCH SKUS, ORDERS..."
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.75rem', letterSpacing: '0.10em',
                color: '#0A0A0A', width: '100%', textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              width: 36, height: 36, background: '#FFFFFF', border: '1.5px solid #E5E5E5', borderRadius: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '2px 2px 0px #E5E5E5', transition: 'box-shadow 150ms'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '2px 2px 0px #FF5500'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '2px 2px 0px #E5E5E5'}
            >
              <Bell size={16} color="#0A0A0A" />
            </button>
            <div style={{
              width: 36, height: 36,
              background: '#0A0A0A', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900,
            }}>
              V
            </div>
          </div>
        </div>

        {/* 3. Page Header + Date Toggle */}
        <div style={{ padding: '32px 32px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '2.2rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', margin: 0, color: '#0A0A0A', lineHeight: 1 }}>
              PERFORMANCE OVERVIEW
            </h1>
            <p style={{ fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.7rem', color: '#595959', letterSpacing: '0.15em', marginTop: 6, textTransform: 'uppercase' }}>
              LIVE METRICS // REAL-TIME DATA FEED
            </p>
          </div>
          <DateRangeToggle range={range} setRange={setRange} />
        </div>

        {/* 4. KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '20px 32px' }}>
          <StatCard
            label="REVENUE"
            icon={<TrendingUp size={18} color="#FF5500" />}
            value={`৳ ${data.revenueToday.toLocaleString()}`}
            valueStyle={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '2.2rem', fontWeight: 700, color: '#0A0A0A' }}
            subLabel={`CONFIRMED SALES ${range}`}
            sparklineData={data.revenueSparkline}
            sparklineColor="#FF5500"
          />
          
          <StatCard
            label="ORDERS"
            icon={<ShoppingCart size={18} color="#0A0A0A" />}
            value={data.ordersToday}
            valueStyle={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '2.8rem', fontWeight: 700, color: '#0A0A0A', lineHeight: 1, marginTop: '-4px' }}
            subLabel={`ORDERS PLACED ${range}`}
            sparklineData={data.ordersSparkline}
            sparklineColor="#0A0A0A"
          />

          <div style={{
            background: '#FFFFFF', border: '1.5px solid #E5E5E5', padding: '20px', boxShadow: '4px 4px 0px #E5E5E5', borderRadius: 0,
            position: 'relative', overflow: 'hidden', transition: 'transform 150ms ease, box-shadow 150ms ease', cursor: 'default'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '6px 6px 0px #FF5500';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5';
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900, color: '#0A0A0A', letterSpacing: '0.05em' }}>
                STOCK HEALTH
              </span>
              {data.restockCount > 0
                ? <AlertTriangle size={18} color="#FF5500" />
                : <CheckCircle size={18} color="#22C55E" />
              }
            </div>
            
            <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '2.2rem', fontWeight: 900, marginTop: 12, color: '#0A0A0A' }}>
              {data.activeSkuCount} <span style={{ fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.9rem', fontWeight: 400, color: '#595959', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SKUs ACTIVE</span>
            </div>
            
            <div style={{ color: data.restockCount > 0 ? '#FF5500' : '#22C55E', fontFamily: "'Barlow', 'Futura STD Extra Bold Condensed Oblique', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', marginTop: 4, textTransform: 'uppercase' }}>
              {data.restockCount > 0 ? `${data.restockCount} NEED RESTOCK` : 'ALL STOCK HEALTHY'}
            </div>
            
            {data.restockCount > 0 && (
              <button 
                onClick={() => navigate('/inventory')}
                style={{
                  marginTop: 10, padding: '4px 10px',
                  background: '#FF5500', color: '#FFF', border: 'none', borderRadius: 0,
                  fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.62rem', letterSpacing: '0.12em',
                  cursor: 'pointer', boxShadow: '2px 2px 0px #0A0A0A', transition: 'transform 150ms'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px, -1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translate(0, 0)'}
              >
                VIEW ALERTS →
              </button>
            )}
          </div>

          <div style={{
            background: '#FFFFFF', border: '1.5px solid #E5E5E5', padding: '20px', boxShadow: '4px 4px 0px #E5E5E5', borderRadius: 0,
            position: 'relative', overflow: 'hidden', transition: 'transform 150ms ease, box-shadow 150ms ease', cursor: 'default',
            display: 'flex', flexDirection: 'column'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '6px 6px 0px #FF5500';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5';
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 900, color: '#0A0A0A', letterSpacing: '0.05em' }}>
                ⚡ QUICK OPS
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate('/invoices/new')}
                style={{
                  width: '100%', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#FF5500', color: '#FFFFFF', border: 'none', borderRadius: 0,
                  fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', boxShadow: '3px 3px 0px #0A0A0A', transition: 'transform 150ms, box-shadow 150ms'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #0A0A0A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #0A0A0A';
                }}
              >
                <span>■ NEW INVOICE</span>
                <ArrowRight size={14} />
              </button>
              
              <button
                onClick={() => navigate('/inventory/new')}
                style={{
                  width: '100%', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#0A0A0A', color: '#FFFFFF', border: 'none', borderRadius: 0,
                  fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', boxShadow: '3px 3px 0px #FF5500', transition: 'transform 150ms, box-shadow 150ms'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #FF5500';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #FF5500';
                }}
              >
                <span>■ ADD PRODUCT</span>
                <ArrowRight size={14} />
              </button>
              
              <button
                onClick={() => navigate('/inventory')}
                style={{
                  width: '100%', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#F2F2F2', color: '#0A0A0A', border: '1.5px solid #E5E5E5', borderRadius: 0,
                  fontFamily: "'Trade Gothic Bold', 'Barlow Condensed', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', boxShadow: '3px 3px 0px #595959', transition: 'transform 150ms, box-shadow 150ms'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #595959';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #595959';
                }}
              >
                <span>■ RESTOCK ITEM</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Bottom Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, padding: '0 32px 32px', flex: 1 }}>
          <CommandLog orders={data.recentOrders} />
          <LowStockPanel items={data.lowStockItems} />
        </div>
      </main>
    </div>
  );
}
