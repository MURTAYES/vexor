import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X, Loader2, Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import useInvoiceStore from '../store/invoiceStore';
import { useCheckout } from '../api/orders';
import { useSearchProducts, useProductSkus } from '../api/products';

// ---------------------------------------------------------
// LIVE JERSEY SELECTION MODAL
// ---------------------------------------------------------

const ProductResult = ({ product, onSelect }) => {
  return (
    <div 
      className="border-[1.5px] border-border-muted p-2 flex items-center gap-4 cursor-pointer hover:bg-neutral hover:border-vexor-orange hover:shadow-[2px_2px_0px_#FF5500] transition-all bg-white"
      onClick={() => onSelect(product)}
      style={{ borderRadius: 0 }}
    >
      <div className="w-[50px] h-[64px] bg-neutral border-[1.5px] border-border-muted shrink-0 p-1 flex items-center justify-center">
        <img src={product.image_url} alt="" className="max-h-full object-contain mix-blend-multiply" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-heading font-[800] text-[0.85rem] uppercase truncate text-vexor-black">{product.club_country_name}</p>
        <p className="font-body text-[0.65rem] font-bold text-secondary uppercase truncate mt-[2px]">{product.season} • {product.kit_type} • {product.version}</p>
      </div>
      <div className="font-mono text-[0.85rem] font-bold text-vexor-black shrink-0 px-2">৳{product.base_price}</div>
    </div>
  );
};

const ProductSelector = ({ product, onCancel, onClose }) => {
  const { data, isLoading } = useProductSkus(product._id);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [instruction, setInstruction] = useState('');
  
  const addItem = useInvoiceStore(state => state.addItem);

  const handleAdd = () => {
    if (!selectedSku) return;
    
    addItem({
      skuId: selectedSku.sku_id,
      productId: product._id,
      teamName: product.club_country_name,
      season: product.season,
      kitType: product.kit_type,
      version: product.version,
      imageUrl: product.image_url,
      size: selectedSku.size,
      quantity,
      maxQty: selectedSku.stock,
      unitPrice: product.base_price,
      specialInstruction: instruction
    });
    
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white relative p-6">
      <button onClick={onCancel} className="absolute top-4 right-4 p-2 bg-neutral hover:bg-vexor-black hover:text-white border-[2px] border-vexor-black transition-colors" style={{ borderRadius: 0 }}>
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4 mb-6 mt-4">
        <div className="w-[100px] h-[130px] border-[2px] border-vexor-black bg-neutral flex items-center justify-center p-2 shrink-0">
          <img src={product.image_url} alt="" className="max-h-full object-contain mix-blend-multiply" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="font-headline font-[900] text-3xl italic uppercase truncate text-vexor-black leading-none">{product.club_country_name}</h2>
          <p className="font-body text-sm font-bold text-secondary uppercase mt-2">{product.season} • {product.kit_type} • {product.version}</p>
          <p className="text-vexor-orange font-headline text-2xl font-bold italic mt-3">৳{product.base_price}</p>
        </div>
      </div>

      <div className="mb-6 flex-shrink-0">
        <p className="font-heading text-[0.7rem] tracking-[0.15em] text-secondary mb-2 uppercase">SELECT SIZE</p>
        <div className="flex gap-2 flex-wrap">
          {isLoading ? (
            <div className="animate-pulse h-[42px] bg-neutral w-full border-[1.5px] border-border-muted" style={{ borderRadius: 0 }}></div>
          ) : (
            data?.skus.map(sku => {
              const isOutOfStock = sku.stock_available === 0;
              const isSelected = selectedSku?.sku_id === sku.sku_id;
              
              return (
                <button
                  key={sku._id}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSku({ sku_id: sku.sku_id, size: sku.size, stock: sku.stock_available })}
                  className={`border-[1.5px] border-vexor-black px-4 py-[6px] font-heading font-bold uppercase transition-colors
                    ${isOutOfStock ? 'opacity-30 cursor-not-allowed bg-neutral shadow-none' : 'hover:border-vexor-orange hover:shadow-[3px_3px_0px_#FF5500] cursor-pointer'}
                    ${isSelected ? 'bg-vexor-black text-white shadow-[3px_3px_0px_#FF5500] border-vexor-black' : 'bg-white text-vexor-black shadow-[2px_2px_0px_#E5E5E5]'}
                  `}
                  style={{ borderRadius: 0 }}
                >
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-[1rem]">{sku.size}</span>
                    <span className="text-[0.6rem] mt-1 tracking-widest font-mono">
                      {isOutOfStock ? '(OOS)' : (sku.stock_available <= 3 ? `(LOW:${sku.stock_available})` : `(${sku.stock_available})`)}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedSku && (
        <div className="flex flex-col flex-1 overflow-y-auto min-h-0 border-t-[2px] border-vexor-black pt-5 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-vexor-orange -translate-y-[2px]" />
          <div className="mb-5 flex-shrink-0">
            <p className="font-heading text-[0.7rem] tracking-[0.15em] text-secondary mb-2 uppercase">QUANTITY (MAX: {selectedSku.stock})</p>
            <div className="flex items-center">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 border-[2px] border-vexor-black bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-neutral transition-colors"
                style={{ borderRadius: 0 }}
              ><Minus size={16}/></button>
              <input 
                type="text" 
                readOnly 
                value={quantity}
                className="w-16 h-10 border-y-[2px] border-x-0 border-vexor-black text-center font-mono text-[1rem] outline-none bg-white font-bold"
              />
              <button 
                onClick={() => setQuantity(Math.min(selectedSku.stock, quantity + 1))}
                disabled={quantity >= selectedSku.stock}
                className="w-10 h-10 border-[2px] border-vexor-black bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-neutral transition-colors"
                style={{ borderRadius: 0 }}
              ><Plus size={16}/></button>
            </div>
          </div>

          <div className="mb-6 flex-shrink-0">
            <p className="font-heading text-[0.7rem] tracking-[0.15em] text-secondary mb-2 uppercase">SPECIAL INSTRUCTIONS (OPTIONAL)</p>
            <input 
              type="text" 
              maxLength="300"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full p-[10px] px-3 font-body text-[0.85rem] border-[2px] border-border-muted focus:border-vexor-orange focus:shadow-[3px_3px_0px_#FF5500] outline-none transition-all"
              placeholder="e.g. Needs custom printing on back..."
              style={{ borderRadius: 0 }}
            />
          </div>
          
          <div className="mt-auto pt-2 flex-shrink-0">
            <button 
              onClick={handleAdd}
              className="w-full bg-vexor-orange text-white py-[12px] text-[0.95rem] font-heading italic font-[900] tracking-widest hover:bg-vexor-black uppercase shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[4px_4px_0px_#FF5500] hover:-translate-y-[1px] hover:-translate-x-[1px] border-[2px] border-transparent hover:border-vexor-black transition-all"
              style={{ borderRadius: 0 }}
            >
              + ADD TO INVOICE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function JerseyModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) setDebouncedTerm(searchTerm);
      else setDebouncedTerm('');
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useSearchProducts(debouncedTerm);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div 
        className="bg-[#F2F2F2] border-[3px] border-vexor-black flex flex-col shadow-[8px_8px_0px_#0A0A0A]" 
        style={{ width: 'min(95vw, 600px)', height: 'min(85vh, 700px)', borderRadius: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {selectedProduct ? (
          <ProductSelector 
            product={selectedProduct} 
            onCancel={() => setSelectedProduct(null)} 
            onClose={() => { setSelectedProduct(null); setSearchTerm(''); onClose(); }}
          />
        ) : (
          <>
            {/* Modal Header & Search */}
            <div className="bg-white px-5 py-4 flex flex-col shrink-0 border-b-[3px] border-vexor-black">
              <div className="flex justify-between items-center mb-4">
                <span className="font-headline font-[900] italic text-[1.2rem] text-vexor-black tracking-tight uppercase">SELECT JERSEY</span>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 border-[2px] border-vexor-black bg-white text-vexor-black flex items-center justify-center hover:border-vexor-orange hover:bg-vexor-orange hover:text-white transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-border-muted" size={16} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="SEARCH BY CLUB, SEASON..."
                  className="w-full border-[2px] border-vexor-black py-[12px] px-[14px] pl-[38px] font-headline text-[1.1rem] italic font-bold uppercase outline-none shadow-[3px_3px_0px_#E5E5E5] focus:border-vexor-orange focus:shadow-[3px_3px_0px_#FF5500] transition-all placeholder-secondary"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>

            {/* Jersey Grid */}
            <div className="flex-1 overflow-y-auto px-5 py-5 bg-[#F2F2F2]">
              {isLoading && <p className="font-heading font-bold uppercase text-secondary text-center py-12 tracking-widest">SCANNING INVENTORY...</p>}
              {!isLoading && data?.products?.length === 0 && debouncedTerm && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Package size={40} className="text-secondary mb-3 opacity-50" />
                  <div className="font-heading text-[0.8rem] font-bold tracking-[0.15em] text-secondary uppercase">NO JERSEYS FOUND</div>
                </div>
              )}
              {!isLoading && !debouncedTerm && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Search size={48} className="text-border-muted mb-4 opacity-30" />
                  <p className="font-headline text-2xl uppercase text-secondary mb-2 italic font-[900]">BUILD INVOICE</p>
                  <p className="font-mono text-secondary uppercase text-[0.75rem] tracking-widest">TYPE TO SEARCH INVENTORY...</p>
                </div>
              )}
              {!isLoading && data?.products?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.products.map(product => (
                    <ProductResult 
                      key={product._id} 
                      product={product} 
                      onSelect={setSelectedProduct} 
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// CHECKOUT MODAL (MAIN)
// ---------------------------------------------------------

export default function CheckoutModal({ isOpen, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({ name: false, phone: false });
  const navigate = useNavigate();
  const checkoutMutation = useCheckout();

  const { 
    customer_name, customer_phone, customer_email, line_items,
    setCustomerDetails, updateItem, removeItem, clearInvoice
  } = useInvoiceStore();

  const subtotal = line_items.reduce((sum, i) => sum + i.lineTotal, 0);
  const canSubmit = customer_name.trim() !== '' && customer_phone.trim() !== '' && line_items.length > 0;

  const handleConfirm = async () => {
    const errs = { name: !customer_name.trim(), phone: !customer_phone.trim() };
    setValidationErrors(errs);
    if (errs.name || errs.phone || line_items.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        customer_name,
        customer_phone,
        customer_email,
        line_items: line_items.map(i => ({
          sku_id: i.skuId,
          quantity: i.quantity,
          special_instruction: i.specialInstruction
        }))
      };
      
      const result = await checkoutMutation.mutateAsync(payload);
      
      // If result contains text, we parse it or use headers
      // Since it's a PDF stream, result might just be Blob
      // So downloading logic can happen outside if we just navigate or open window
      // Let's assume order ID is in response headers for this flow, or we navigate away.
      
      clearInvoice();
      navigate('/dashboard'); 
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const text = await (typeof err.response.data.text === 'function' ? err.response.data.text() : JSON.stringify(err.response.data));
          const errorData = typeof err.response.data === 'string' ? JSON.parse(text) : err.response.data;
          setSubmitError({ type: 'conflict', details: errorData.details });
        } catch {
          setSubmitError({ type: 'conflict', details: null });
        }
      } else {
        setSubmitError({ type: 'error', message: 'CHECKOUT FAILED' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 md:p-8" onClick={onClose}>
      <div 
        className="w-full max-w-[1400px] h-full max-h-[95vh] bg-[#F2F2F2] border-[3px] border-vexor-black shadow-[8px_8px_0px_#0A0A0A] flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
        style={{ borderRadius: 0 }}
      >
        {/* Header Section */}
        <div className="bg-white border-b-[3px] border-vexor-black p-5 px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 sticky top-0 z-10 gap-4">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-[900] italic uppercase text-vexor-black tracking-tight leading-none">
              INVOICE BUILDER <span className="text-vexor-orange">/</span>
            </h1>
            <div className="font-mono text-[0.65rem] md:text-[0.7rem] text-secondary tracking-widest mt-2">DRAFT MODE // AWAITING CONFIRMATION</div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleConfirm}
              disabled={!canSubmit || isSubmitting}
              className={`flex-1 md:flex-none font-heading text-[0.72rem] md:text-[0.8rem] px-5 py-[12px] md:py-[10px] uppercase flex items-center justify-center transition-all ${
                isSubmitting ? 'bg-secondary text-white shadow-none cursor-not-allowed border-[2px] border-transparent' :
                !canSubmit ? 'bg-secondary text-white shadow-none cursor-not-allowed border-[2px] border-transparent' :
                'bg-vexor-orange text-white shadow-[3px_3px_0px_#0A0A0A] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[5px_5px_0px_#0A0A0A] border-[2px] border-transparent hover:border-vexor-black'
              }`}
              style={{ borderRadius: 0 }}
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2"/> PROCESSING...</> : <>PRINT & CONFIRM ↗</>}
            </button>
            <button onClick={onClose} className="p-[10px] text-vexor-black hover:text-white hover:bg-vexor-black border-[2px] border-transparent hover:border-vexor-black transition-colors" style={{ borderRadius: 0 }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1">
          {/* Stock Conflict Banner */}
          {submitError?.type === 'conflict' && (
            <div className="bg-[#FEF2F2] border-[2px] border-[#DC2626] shadow-[4px_4px_0px_#DC2626] p-4 md:p-5 mb-6" style={{ borderRadius: 0 }}>
              <div className="font-headline text-[1.1rem] italic font-[900] text-[#DC2626] uppercase flex items-center mb-2"><AlertTriangle size={20} className="mr-2"/> STOCK CONFLICT</div>
              <div className="font-body text-[0.85rem] font-bold text-vexor-black uppercase">
                Some items exceed available stock or ran out while you were browsing. Please review cart quantities.
              </div>
            </div>
          )}

          {/* Section: Customer Details */}
          <div className="bg-white border-[2px] border-vexor-black shadow-[4px_4px_0px_#E5E5E5] p-5 md:p-6 mb-6" style={{ borderRadius: 0 }}>
            <div className="font-heading italic font-[900] text-[0.9rem] border-b-[2px] border-vexor-black pb-3 mb-5 uppercase text-vexor-black tracking-wide">
              ▐ CUSTOMER DETAILS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={`block font-heading text-[0.65rem] tracking-[0.15em] font-bold uppercase mb-[6px] ${validationErrors.name ? 'text-[#DC2626]' : 'text-secondary'}`}>FULL NAME *</label>
                <input 
                  type="text" 
                  value={customer_name}
                  onChange={e => { setCustomerDetails({ customer_name: e.target.value }); setValidationErrors(prev => ({...prev, name: false})); }}
                  className={`w-full border-[2px] p-[10px] px-[14px] font-body text-[0.85rem] font-bold text-vexor-black outline-none transition-all ${
                    validationErrors.name ? 'border-[#DC2626] shadow-[3px_3px_0px_#DC2626]' : 'border-border-muted shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[4px_4px_0px_#0A0A0A]'
                  }`}
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div>
                <label className={`block font-heading text-[0.65rem] tracking-[0.15em] font-bold uppercase mb-[6px] ${validationErrors.phone ? 'text-[#DC2626]' : 'text-secondary'}`}>PHONE NUMBER *</label>
                <input 
                  type="text" 
                  value={customer_phone}
                  onChange={e => { setCustomerDetails({ customer_phone: e.target.value }); setValidationErrors(prev => ({...prev, phone: false})); }}
                  className={`w-full border-[2px] p-[10px] px-[14px] font-body text-[0.85rem] font-bold text-vexor-black outline-none transition-all ${
                    validationErrors.phone ? 'border-[#DC2626] shadow-[3px_3px_0px_#DC2626]' : 'border-border-muted shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[4px_4px_0px_#0A0A0A]'
                  }`}
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div>
                <label className="block font-heading text-[0.65rem] tracking-[0.15em] font-bold uppercase mb-[6px] text-secondary">EMAIL (OPTIONAL)</label>
                <input 
                  type="email" 
                  value={customer_email}
                  onChange={e => setCustomerDetails({ customer_email: e.target.value })}
                  className="w-full border-[2px] border-border-muted p-[10px] px-[14px] font-body text-[0.85rem] font-bold text-vexor-black outline-none shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[4px_4px_0px_#0A0A0A] transition-all"
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Section: Order Items */}
          <div className="bg-white border-[2px] border-vexor-black shadow-[4px_4px_0px_#E5E5E5] p-0 overflow-hidden" style={{ borderRadius: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-[2px] border-vexor-black p-5 md:p-6 bg-[#FAFAFA]">
              <div className="font-heading italic font-[900] text-[0.9rem] uppercase text-vexor-black tracking-wide mb-4 md:mb-0">
                ▐ ORDER ITEMS
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto bg-vexor-black text-white px-[20px] py-[10px] font-heading text-[0.75rem] font-bold tracking-widest uppercase shadow-[3px_3px_0px_#FF5500] hover:bg-vexor-orange hover:shadow-[3px_3px_0px_#0A0A0A] transition-colors border-[2px] border-transparent hover:border-vexor-black"
                style={{ borderRadius: 0 }}
              >
                + ADD JERSEY
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-neutral border-b-[2px] border-vexor-black">
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-left uppercase w-[40px]">#</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-left uppercase">ITEM</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-left uppercase w-[80px]">SIZE</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-center uppercase w-[130px]">QTY</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-right uppercase w-[120px]">UNIT PRICE</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-right uppercase w-[120px]">TOTAL</th>
                    <th className="font-heading text-[0.65rem] tracking-[0.15em] font-bold text-secondary px-[14px] py-[12px] text-center uppercase w-[50px]">✕</th>
                  </tr>
                </thead>
                <tbody>
                  {line_items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center bg-white">
                        <ShoppingCart size={48} className="text-border-muted mx-auto mb-4 opacity-30" />
                        <div className="font-heading text-[0.8rem] font-bold tracking-[0.15em] text-secondary uppercase mt-3">NO ITEMS ADDED</div>
                        <div className="font-body text-[0.75rem] font-bold text-secondary mt-1">Click + ADD JERSEY to begin building this invoice.</div>
                      </td>
                    </tr>
                  ) : (
                    line_items.map((item, idx) => {
                      const isConflict = submitError?.type === 'conflict' && submitError?.details?.sku_id === item.skuId;
                      
                      return (
                        <tr key={item._localId} className="group/item relative">
                          <td colSpan={7} className="p-0 border-b-[2px] border-border-muted hover:bg-[#FFF8F5] transition-colors relative bg-white">
                            
                            {/* Sub-row 1: Main Data */}
                            <div className="flex items-center px-[14px] py-4">
                              <div className="w-[30px] font-mono text-[0.8rem] text-secondary font-bold text-center shrink-0">{idx + 1}</div>
                              
                              <div className="flex-1 flex items-center px-[14px] min-w-[200px]">
                                <div className="w-[45px] h-[60px] bg-neutral border-[2px] border-border-muted p-1 shrink-0 mr-4 flex items-center justify-center">
                                  <img src={item.imageUrl} alt={item.teamName} className="max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="overflow-hidden">
                                  <div className="font-headline italic font-[900] text-[1.1rem] text-vexor-black uppercase truncate leading-none mb-1" title={item.teamName}>{item.teamName}</div>
                                  <div className="font-body font-bold text-[0.7rem] text-secondary uppercase truncate">{item.season} · {item.kitType} · {item.version}</div>
                                </div>
                              </div>

                              <div className="w-[80px] px-[14px] shrink-0">
                                <div className="font-heading font-[900] text-[1.1rem] text-vexor-black uppercase text-center border-[2px] border-border-muted bg-neutral py-1">
                                  {item.size}
                                </div>
                              </div>

                              <div className="w-[130px] px-[14px] shrink-0 flex items-center justify-center">
                                <button 
                                  onClick={() => updateItem(item._localId, { quantity: Math.max(1, item.quantity - 1) })}
                                  disabled={item.quantity <= 1}
                                  className="w-[28px] h-[28px] border-[2px] border-vexor-black bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-neutral transition-colors"
                                  style={{ borderRadius: 0 }}
                                ><Minus size={14}/></button>
                                <input 
                                  type="text" readOnly value={item.quantity}
                                  className={`w-[48px] h-[28px] border-y-[2px] border-x-0 text-center font-mono text-[0.95rem] outline-none bg-transparent ${isConflict ? 'border-[#DC2626] text-[#DC2626] font-bold bg-[#FEF2F2]' : 'border-vexor-black text-vexor-black font-bold'}`}
                                />
                                <button 
                                  onClick={() => updateItem(item._localId, { quantity: Math.min(item.maxQty, item.quantity + 1) })}
                                  disabled={item.quantity >= item.maxQty}
                                  className="w-[28px] h-[28px] border-[2px] border-vexor-black bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-neutral transition-colors"
                                  style={{ borderRadius: 0 }}
                                ><Plus size={14}/></button>
                              </div>

                              <div className="w-[120px] px-[14px] font-mono text-[0.9rem] font-bold text-secondary text-right shrink-0">
                                ৳{item.unitPrice.toLocaleString()}
                              </div>
                              
                              <div className="w-[120px] px-[14px] font-mono text-[1.05rem] font-[700] text-vexor-black text-right shrink-0">
                                ৳{item.lineTotal.toLocaleString()}
                              </div>

                              <div className="w-[50px] flex items-center justify-center shrink-0">
                                <button 
                                  onClick={() => removeItem(item._localId)}
                                  className="w-[32px] h-[32px] border-[2px] border-vexor-black bg-white flex items-center justify-center text-vexor-black hover:bg-[#DC2626] hover:border-[#DC2626] hover:text-white hover:shadow-[3px_3px_0px_#0A0A0A] transition-all cursor-pointer"
                                  style={{ borderRadius: 0 }}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Sub-row 2: Special Instructions */}
                            <div className={`px-[14px] pl-[85px] pb-4 bg-[#FFFBF0] border-t-0 border-b-[2px] border-border-muted transition-all overflow-hidden ${
                              !item.specialInstruction ? 'h-[32px] pt-[8px] hover:h-[80px] hover:pt-0' : 'pt-0'
                            }`}>
                              <div className="font-heading font-bold text-[0.6rem] tracking-[0.18em] text-secondary mb-[6px] uppercase">
                                SPECIAL INSTRUCTIONS
                              </div>
                              <textarea 
                                value={item.specialInstruction}
                                onChange={e => updateItem(item._localId, { specialInstruction: e.target.value })}
                                placeholder="e.g. Print MESSI 10 on back, add World Cup patch..."
                                className={`w-full max-w-[500px] resize-y border-[2px] border-[#E8D9A0] bg-[#FFFDE7] p-[8px] px-3 font-body font-bold text-[0.8rem] text-vexor-black outline-none shadow-[2px_2px_0px_#E8D9A0] focus:border-vexor-orange focus:shadow-[2px_2px_0px_#FF5500] transition-colors ${
                                  !item.specialInstruction ? 'hidden group-hover/item:block h-[42px]' : 'min-h-[42px] max-h-[80px]'
                                }`}
                                style={{ borderRadius: 0 }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary */}
            {line_items.length > 0 && (
              <div className="flex flex-col items-end mt-0 bg-neutral p-5 md:p-8 border-t-[2px] border-vexor-black">
                <div className="flex flex-col items-end gap-3 min-w-[280px]">
                  <div className="flex justify-between w-full items-center">
                    <span className="font-heading font-bold text-[0.7rem] tracking-[0.2em] text-secondary uppercase">SUBTOTAL</span>
                    <span className="font-mono text-[1.1rem] font-bold text-vexor-black">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-[2px] bg-border-muted my-1" />
                  <div className="flex justify-between w-full items-center">
                    <span className="font-headline text-[1.2rem] font-[900] italic text-vexor-black uppercase tracking-wide">TOTAL</span>
                    <span className="font-mono text-[1.8rem] font-[700] text-vexor-orange bg-white px-3 py-1 border-[2px] border-vexor-black shadow-[3px_3px_0px_#0A0A0A]">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <JerseyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
