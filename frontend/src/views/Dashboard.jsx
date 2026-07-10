import { useState } from 'react';
import { useDashboardStats } from '../api/dashboard';
import { useInvoices } from '../api/orders';
import { downloadOrderPdf } from '../api/orders';
import CheckoutModal from '../components/CheckoutModal';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useInvoices(1, 5);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const orders = ordersData?.orders || [];

  const handleDownloadPdf = async (orderId, invoiceNumber) => {
    try {
      await downloadOrderPdf(orderId, invoiceNumber);
    } catch {
      alert('Failed to download PDF');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#F2F2F2] p-6 md:p-8 border-[3px] border-vexor-black shadow-[6px_6px_0px_#0A0A0A]" style={{ borderRadius: 0 }}>
        <div>
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-[900] italic uppercase text-vexor-black leading-none tracking-tight">PERFORMANCE <br/> OVERVIEW</h2>
          <p className="font-mono text-[0.75rem] md:text-sm text-secondary mt-3 font-bold tracking-[0.25em]">LIVE METRICS // REAL-TIME DATA FEED</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full md:w-auto bg-vexor-orange text-white px-8 py-5 font-headline text-xl italic uppercase font-[900] tracking-widest shadow-[5px_5px_0px_#0A0A0A] hover:bg-vexor-black hover:shadow-[5px_5px_0px_#FF5500] border-[3px] border-transparent hover:border-vexor-black transition-all"
            style={{ borderRadius: 0 }}
          >
            + CREATE INVOICE
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Metric 1: Today's Invoices */}
        <div className="bg-white border-[3px] border-vexor-black p-6 flex flex-col justify-between h-[180px] shadow-[4px_4px_0px_#E5E5E5] hover:shadow-[4px_4px_0px_#0A0A0A] transition-shadow" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start">
            <h3 className="font-heading text-sm font-[800] uppercase text-secondary tracking-[0.15em]">TODAY'S INVOICES</h3>
            <span className="material-symbols-outlined text-vexor-orange text-[28px]">trending_up</span>
          </div>
          <div>
            <div className="text-[48px] font-headline font-[900] italic uppercase leading-none tracking-tighter mb-2 text-vexor-black">
              {statsLoading ? '—' : stats?.today_invoices || 0}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#F2F2F2] text-vexor-black font-mono text-[10px] font-bold px-2 py-1 tracking-widest">ORDERS PLACED TODAY</span>
              <svg className="ml-auto" height="20" viewBox="0 0 60 20" width="60">
                <path className="sparkline" d="M0 15 Q 10 5, 20 10 T 40 5 T 60 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Metric 2: Total SKUs */}
        <div className="bg-white border-[3px] border-vexor-black p-6 flex flex-col justify-between h-[180px] shadow-[4px_4px_0px_#E5E5E5] hover:shadow-[4px_4px_0px_#0A0A0A] transition-shadow" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start">
            <h3 className="font-heading text-sm font-[800] uppercase text-secondary tracking-[0.15em]">TOTAL SKU COUNT</h3>
            <span className="material-symbols-outlined text-vexor-black text-[28px]">inventory_2</span>
          </div>
          <div>
            <div className="text-[48px] font-headline font-[900] italic uppercase leading-none tracking-tighter mb-2 text-vexor-black">
              {statsLoading ? '—' : stats?.total_skus || 0}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#F2F2F2] text-vexor-black font-mono text-[10px] font-bold px-2 py-1 tracking-widest">ACTIVE IN CATALOG</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Low-Stock Alerts */}
        <div className={`bg-white border-[3px] border-vexor-black p-6 flex flex-col justify-between h-[180px] transition-shadow ${stats?.low_stock_alerts > 0 ? 'shadow-[4px_4px_0px_#FF5500]' : 'shadow-[4px_4px_0px_#E5E5E5] hover:shadow-[4px_4px_0px_#0A0A0A]'}`} style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-start">
            <h3 className="font-heading text-sm font-[800] uppercase text-secondary tracking-[0.15em]">INVENTORY HEALTH</h3>
            <span className={`material-symbols-outlined text-[28px] ${stats?.low_stock_alerts > 0 ? 'text-vexor-orange animate-pulse' : 'text-vexor-black'}`}>warning</span>
          </div>
          <div>
            <div className={`text-[48px] font-headline font-[900] italic uppercase leading-none tracking-tighter mb-2 ${stats?.low_stock_alerts > 0 ? 'text-vexor-orange' : 'text-vexor-black'}`}>
              {statsLoading ? '—' : stats?.low_stock_alerts || 0}
            </div>
            <div className="flex items-center gap-2">
              {stats?.low_stock_alerts > 0 ? (
                <span className="bg-vexor-orange text-white font-mono text-[10px] font-bold px-2 py-1 tracking-widest animate-pulse">RESTOCK REQUIRED</span>
              ) : (
                <span className="bg-[#F2F2F2] text-vexor-black font-mono text-[10px] font-bold px-2 py-1 tracking-widest">ALL STOCK HEALTHY</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border-[3px] border-vexor-black shadow-[6px_6px_0px_#0A0A0A] mt-8" style={{ borderRadius: 0 }}>
        <div className="p-4 sm:p-6 border-b-[3px] border-vexor-black bg-vexor-black text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-headline text-xl sm:text-2xl font-[900] italic uppercase tracking-wider">COMMAND LOG <span className="text-vexor-orange">//</span> RECENT ORDERS</h3>
          <a href="/invoices" className="text-white hover:text-vexor-orange flex items-center gap-2 font-heading font-bold uppercase text-[0.8rem] tracking-[0.15em] transition-colors">
            VIEW ALL <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F2F2F2] border-b-[3px] border-vexor-black font-heading text-xs font-[800] text-vexor-black uppercase tracking-[0.15em]">
                <th className="p-4 px-6 w-40">INVOICE #</th>
                <th className="p-4 px-6">CUSTOMER</th>
                <th className="p-4 px-6 w-32">TOTAL</th>
                <th className="p-4 px-6 w-32">STATUS</th>
                <th className="p-4 px-6 w-40 text-right">DATE</th>
                <th className="p-4 px-6 w-20 text-center">PDF</th>
              </tr>
            </thead>
            <tbody className="font-body text-[0.95rem]">
              {ordersLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center font-bold text-secondary uppercase tracking-[0.2em]">LOADING DATA STREAM...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center font-bold text-secondary uppercase tracking-[0.2em]">NO ORDERS LOGGED YET</td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order._id} className={`border-b-[1.5px] border-border-muted hover:bg-[#F2F2F2] transition-colors ${idx % 2 !== 0 ? 'bg-[#FAFAFA]' : ''}`}>
                    <td className="p-4 px-6 font-bold text-vexor-black font-mono">{order.invoice_number}</td>
                    <td className="p-4 px-6 font-[800] uppercase text-vexor-black tracking-wide">{order.customer_name}</td>
                    <td className="p-4 px-6 font-headline text-[1.2rem] italic font-[900] text-vexor-black">৳{order.total}</td>
                    <td className="p-4 px-6">
                      <span className={`inline-block font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest ${
                        order.status === 'voided'
                          ? 'bg-[#DC2626] text-white'
                          : order.status === 'confirmed'
                          ? 'bg-vexor-black text-white'
                          : 'bg-white border-[2px] border-vexor-black text-vexor-black'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right font-mono text-[0.8rem] text-secondary font-bold">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},{' '}
                      {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td className="p-4 px-6 text-center">
                      <button
                        onClick={() => handleDownloadPdf(order._id, order.invoice_number)}
                        className="w-[36px] h-[36px] bg-white border-[2px] border-vexor-black text-vexor-black hover:text-white hover:bg-vexor-orange hover:border-vexor-orange flex items-center justify-center transition-colors shadow-[2px_2px_0px_#0A0A0A]"
                        title="Download PDF"
                        style={{ borderRadius: 0 }}
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

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};

export default Dashboard;
