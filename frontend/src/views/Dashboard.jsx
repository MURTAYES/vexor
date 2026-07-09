import { useDashboardStats } from '../api/dashboard';
import { useInvoices } from '../api/orders';
import { downloadOrderPdf } from '../api/orders';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useInvoices(1, 5);

  const orders = ordersData?.orders || [];

  const handleDownloadPdf = async (orderId, invoiceNumber) => {
    try {
      await downloadOrderPdf(orderId, invoiceNumber);
    } catch {
      alert('Failed to download PDF');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="font-headline text-5xl font-bold italic uppercase text-vexor-black leading-tight">PERFORMANCE OVERVIEW</h2>
          <p className="font-body text-lg text-secondary">LIVE METRICS // REAL-TIME DATA FEED</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Metric 1: Today's Invoices */}
        <div className="brutal-card p-6 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm font-bold uppercase text-secondary tracking-wider">TODAY'S INVOICES</h3>
            <span className="material-symbols-outlined text-vexor-orange">trending_up</span>
          </div>
          <div>
            <div className="text-[40px] font-headline font-bold italic uppercase leading-none tracking-tighter mb-2">
              {statsLoading ? '—' : stats?.today_invoices || 0}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-neutral text-vexor-black font-body text-xs font-bold px-2 py-1">ORDERS PLACED TODAY</span>
              <svg className="ml-auto" height="20" viewBox="0 0 60 20" width="60">
                <path className="sparkline" d="M0 15 Q 10 5, 20 10 T 40 5 T 60 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Metric 2: Total SKUs */}
        <div className="brutal-card p-6 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm font-bold uppercase text-secondary tracking-wider">TOTAL SKU COUNT</h3>
            <span className="material-symbols-outlined text-vexor-black">inventory_2</span>
          </div>
          <div>
            <div className="text-[40px] font-headline font-bold italic uppercase leading-none tracking-tighter mb-2">
              {statsLoading ? '—' : stats?.total_skus || 0}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-neutral text-vexor-black font-body text-xs font-bold px-2 py-1">ACTIVE IN CATALOG</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Low-Stock Alerts */}
        <div className={`brutal-card p-6 flex flex-col justify-between h-[160px] border-l-4 ${stats?.low_stock_alerts > 0 ? 'border-l-vexor-orange' : 'border-l-surface-neutral'}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm font-bold uppercase text-secondary tracking-wider">INVENTORY HEALTH</h3>
            <span className={`material-symbols-outlined ${stats?.low_stock_alerts > 0 ? 'text-vexor-orange' : 'text-vexor-black'}`}>warning</span>
          </div>
          <div>
            <div className={`text-[40px] font-headline font-bold italic uppercase leading-none tracking-tighter mb-2 ${stats?.low_stock_alerts > 0 ? 'text-vexor-orange' : ''}`}>
              {statsLoading ? '—' : stats?.low_stock_alerts || 0}
            </div>
            <div className="flex items-center gap-2">
              {stats?.low_stock_alerts > 0 ? (
                <span className="bg-vexor-orange text-white font-body text-xs font-bold px-2 py-1">RESTOCK REQUIRED</span>
              ) : (
                <span className="bg-surface-neutral text-vexor-black font-body text-xs font-bold px-2 py-1">ALL STOCK HEALTHY</span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 4: Quick Actions */}
        <div className="brutal-card p-6 flex flex-col justify-between h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm font-bold uppercase text-secondary tracking-wider">QUICK OPS</h3>
            <span className="material-symbols-outlined text-vexor-black">bolt</span>
          </div>
          <div className="flex flex-col gap-2">
            <a href="/checkout" className="block w-full py-2 bg-vexor-orange text-white font-headline text-base italic uppercase font-bold text-center hover:shadow-[4px_4px_0px_#000000] transition-shadow border-2 border-transparent hover:border-vexor-black">
              NEW INVOICE
            </a>
            <a href="/inventory/new" className="block w-full py-2 bg-vexor-black text-white font-headline text-base italic uppercase font-bold text-center hover:bg-vexor-orange transition-colors">
              ADD PRODUCT
            </a>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="brutal-card mt-8 overflow-hidden">
        <div className="p-6 border-b border-border-muted bg-vexor-black text-white flex justify-between items-center">
          <h3 className="font-headline text-2xl font-bold italic uppercase">COMMAND LOG // RECENT ORDERS</h3>
          <a href="/invoices" className="text-white hover:text-vexor-orange flex items-center gap-2 font-body font-bold uppercase text-xs">
            VIEW ALL <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-neutral border-b border-border-muted font-body text-sm font-bold text-vexor-black uppercase">
                <th className="p-4 w-40">INVOICE #</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4 w-32">TOTAL</th>
                <th className="p-4 w-32">STATUS</th>
                <th className="p-4 w-40 text-right">DATE</th>
                <th className="p-4 w-20 text-center">PDF</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm">
              {ordersLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-bold text-secondary uppercase">LOADING DATA STREAM...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-bold text-secondary uppercase">NO ORDERS LOGGED YET</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order._id} className={`border-b border-surface-neutral hover:bg-surface-neutral transition-colors ${idx % 2 !== 0 ? 'bg-surface-bright' : ''}`}>
                    <td className="p-4 font-bold text-vexor-black">{order.invoice_number}</td>
                    <td className="p-4 font-bold uppercase">{order.customer_name}</td>
                    <td className="p-4 font-headline text-base italic font-bold">৳{order.total}</td>
                    <td className="p-4">
                      <span className={`inline-block font-body text-[10px] font-bold px-2 py-1 uppercase ${
                        order.status === 'voided'
                          ? 'bg-error text-white'
                          : order.status === 'confirmed'
                          ? 'bg-vexor-black text-white'
                          : 'bg-surface-neutral border border-border-muted text-vexor-black'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-secondary">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},{' '}
                      {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDownloadPdf(order._id, order.invoice_number)}
                        className="text-on-surface-variant hover:text-vexor-orange transition-colors border-0 shadow-none"
                        title="Download PDF"
                      >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
