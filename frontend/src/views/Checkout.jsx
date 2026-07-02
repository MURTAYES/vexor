import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInvoiceStore from '../store/invoiceStore';
import { useCheckout } from '../api/orders';
import InvoiceBuilderPopup from '../components/InvoiceBuilderPopup';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const navigate = useNavigate();
  
  const { 
    customer_name, 
    customer_phone, 
    customer_email, 
    line_items,
    setCustomerDetails,
    removeItem,
    clearInvoice
  } = useInvoiceStore();

  const checkoutMutation = useCheckout();

  const subtotal = line_items.reduce((sum, item) => sum + (item.snapshot_price * item.quantity), 0);

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (!customer_name || !customer_phone) {
      setCheckoutError({ message: 'Name and Phone are required' });
      return;
    }
    if (line_items.length === 0) {
      setCheckoutError({ message: 'Add at least one item' });
      return;
    }

    try {
      const payload = {
        customer_name,
        customer_phone,
        customer_email,
        line_items: line_items.map(i => ({
          sku_id: i.sku_id,
          quantity: i.quantity,
          special_instruction: i.special_instruction
        }))
      };
      
      const res = await checkoutMutation.mutateAsync(payload);
      clearInvoice();
      // In a real app we'd redirect to a success page or the invoice detail view
      alert(`Invoice ${res.invoice_number} Created Successfully!`);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        setCheckoutError({
          message: 'Stock Conflict',
          details: err.response.data.details
        });
      } else {
        setCheckoutError({ message: err.response?.data?.error || 'Checkout failed' });
      }
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-6xl mx-auto flex gap-8">
        
        {/* Left Column: Customer & Line Items */}
        <div className="flex-1 space-y-8">
          
          {/* Customer Box */}
          <div className="bg-white border-2 border-black shadow-brutal p-6">
            <h2 className="font-heading text-2xl uppercase mb-6 border-b-2 border-black pb-2">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-xs mb-1">Name *</label>
                <input 
                  type="text" 
                  value={customer_name}
                  onChange={e => setCustomerDetails({ customer_name: e.target.value })}
                  className="w-full p-2"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-xs mb-1">Phone *</label>
                <input 
                  type="text" 
                  value={customer_phone}
                  onChange={e => setCustomerDetails({ customer_phone: e.target.value })}
                  className="w-full p-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-bold uppercase text-xs mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  value={customer_email}
                  onChange={e => setCustomerDetails({ customer_email: e.target.value })}
                  className="w-full p-2"
                />
              </div>
            </div>
          </div>

          {/* Line Items Box */}
          <div className="bg-white border-2 border-black shadow-brutal p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
              <h2 className="font-heading text-2xl uppercase">Order Items</h2>
              <button 
                onClick={() => setShowBuilder(true)}
                className="bg-black text-white px-4 py-2 hover:bg-accent font-heading flex items-center gap-2"
              >
                <Plus className="w-4 h-4"/> Add Item
              </button>
            </div>

            {line_items.length === 0 ? (
              <div className="text-center py-12 text-muted font-bold uppercase border-2 border-dashed border-black">
                No items added yet
              </div>
            ) : (
              <div className="space-y-4">
                {line_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-2 border-black p-4 bg-neutral">
                    <div className="flex items-center gap-4">
                      <img src={item.product_image} alt="" className="w-16 h-16 object-cover border-2 border-black" />
                      <div>
                        <p className="font-heading uppercase">{item.product_name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="bg-white border border-black px-2 py-0.5 text-xs font-bold uppercase">Size: {item.size}</span>
                          <span className="bg-white border border-black px-2 py-0.5 text-xs font-bold uppercase">Qty: {item.quantity}</span>
                        </div>
                        {item.special_instruction && (
                          <p className="text-xs italic mt-2 text-accent bg-white p-1 border border-accent">
                            Instr: {item.special_instruction}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-heading text-xl">৳{item.snapshot_price * item.quantity}</p>
                      <button 
                        onClick={() => removeItem(item.sku_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Totals & Submit */}
        <div className="w-96">
          <div className="bg-white border-2 border-black shadow-brutal p-6 sticky top-8">
            <h2 className="font-heading text-2xl uppercase mb-6 border-b-2 border-black pb-2">Summary</h2>
            
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold uppercase text-muted">Subtotal</span>
              <span className="font-heading text-xl">৳{subtotal}</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 pt-4 border-t-4 border-black">
              <span className="font-bold uppercase text-2xl">Total</span>
              <span className="font-heading text-3xl text-accent">৳{subtotal}</span>
            </div>

            {checkoutError && (
              <div className="bg-red-100 border-2 border-red-500 p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700 font-bold uppercase mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{checkoutError.message}</span>
                </div>
                {checkoutError.details && (
                  <div className="text-sm text-red-800">
                    Failed SKU: {checkoutError.details.size} (Only {checkoutError.details.remaining_stock} left)
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending || line_items.length === 0}
              className="w-full bg-accent text-white py-4 text-2xl font-heading uppercase hover:bg-black disabled:bg-muted"
            >
              {checkoutMutation.isPending ? 'Processing...' : 'Confirm Invoice'}
            </button>
          </div>
        </div>

      </div>

      {showBuilder && <InvoiceBuilderPopup onClose={() => setShowBuilder(false)} />}
    </div>
  );
};

export default Checkout;
