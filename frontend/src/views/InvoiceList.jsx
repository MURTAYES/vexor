import { useInvoices, useResendEmail } from '../api/orders';
import { downloadOrderPdf } from '../api/orders';
import { FileText, Download, Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const InvoiceList = () => {
  const { data, isLoading, error } = useInvoices(1, 50);
  const resendEmail = useResendEmail();
  const [resendingId, setResendingId] = useState(null);

  const handleDownloadPdf = async (orderId, invoiceNumber) => {
    try {
      await downloadOrderPdf(orderId, invoiceNumber);
    } catch {
      alert('Failed to download PDF');
    }
  };

  const handleResendEmail = async (orderId) => {
    setResendingId(orderId);
    try {
      const result = await resendEmail.mutateAsync(orderId);
      alert(result.message);
    } catch {
      alert('Failed to resend email');
    } finally {
      setResendingId(null);
    }
  };

  if (isLoading) return <div className="p-8 font-heading uppercase text-2xl">Loading Invoices...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold uppercase">Error loading invoices.</div>;

  const orders = data?.orders || [];

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b-4 border-black pb-4">
          <h1 className="text-5xl text-accent uppercase mb-2">Invoices</h1>
          <p className="font-bold text-muted uppercase">Order History</p>
        </div>

        <div className="bg-white border-2 border-black shadow-brutal overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white font-heading uppercase text-sm">
                <th className="p-4 border-b-2 border-r-2 border-black">Invoice #</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Date</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Customer</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Status</th>
                <th className="p-4 border-b-2 border-r-2 border-black">Email</th>
                <th className="p-4 border-b-2 border-r-2 border-black text-right">Total (৳)</th>
                <th className="p-4 border-b-2 border-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((invoice, idx) => (
                <tr key={invoice._id} className={`hover:bg-neutral transition-colors ${idx !== orders.length - 1 ? 'border-b-2 border-black' : ''}`}>
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
                  <td className="p-4 border-r-2 border-black">
                    {invoice.email_sent_at ? (
                      <span className="text-xs font-bold text-green-600 uppercase">
                        Sent {new Date(invoice.email_sent_at).toLocaleDateString()}
                      </span>
                    ) : invoice.email_error ? (
                      <span className="text-xs font-bold text-red-600 uppercase" title={invoice.email_error}>
                        Failed
                      </span>
                    ) : invoice.customer_email ? (
                      <span className="text-xs font-bold text-muted uppercase">Pending</span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="p-4 border-r-2 border-black font-heading text-xl text-right text-accent">
                    ৳{invoice.total}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownloadPdf(invoice._id, invoice.invoice_number)}
                        className="p-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {invoice.customer_email && (
                        <button
                          onClick={() => handleResendEmail(invoice._id)}
                          disabled={resendingId === invoice._id}
                          className="p-2 bg-white border-2 border-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                          title="Resend Email"
                        >
                          {resendingId === invoice._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-bold text-muted uppercase">No invoices found.</td>
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
