import { useInvoices } from '../api/orders';
import { FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  const { data, isLoading, error } = useInvoices(1, 50);

  if (isLoading) return <div className="p-8 font-heading uppercase text-2xl">Loading Invoices...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold uppercase">Error loading invoices.</div>;

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b-4 border-black pb-4">
          <h1 className="text-5xl text-accent uppercase mb-2">Invoices</h1>
          <p className="font-bold text-muted uppercase">Order History</p>
        </div>

        <div className="bg-white border-2 border-black shadow-brutal">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white font-heading uppercase text-lg">
                <th className="p-4 border-b-2 border-r-2 border-black">Invoice #</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Date</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Customer</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Status</th>
                <th className="p-4 border-b-2 border-black text-right">Total (৳)</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((invoice, idx) => (
                <tr key={invoice._id} className={`hover:bg-neutral transition-colors ${idx !== data.length - 1 ? 'border-b-2 border-black' : ''}`}>
                  <td className="p-4 border-r-2 border-black font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted" />
                    {invoice.invoice_number}
                  </td>
                  <td className="p-4 border-r-2 border-black font-bold text-muted">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-r-2 border-black uppercase font-bold text-sm">
                    {invoice.customer_name}
                  </td>
                  <td className="p-4 border-r-2 border-black">
                    <span className={`px-2 py-1 text-xs font-bold uppercase border-2 border-black ${invoice.status === 'voided' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 font-heading text-xl text-right text-accent">
                    ৳{invoice.total}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td colSpan="5" className="p-8 text-center font-bold text-muted uppercase">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
