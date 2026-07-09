import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X, Loader2, Plus, Minus } from 'lucide-react';
import useInvoiceStore from '../store/invoiceStore';
import { useCheckout } from '../api/orders';

const MOCK_PRODUCTS = [
  {
    productId: 'p1', teamName: 'Real Madrid', season: '2024 / 25', kitType: 'Away', version: 'Player Issue',
    imageUrl: '/images/messi.png', unitPrice: 2400, sizes: [
      { size: 'S', stock: 1, skuId: 'sku1-S' },
      { size: 'M', stock: 5, skuId: 'sku1-M' },
      { size: 'L', stock: 0, skuId: 'sku1-L' },
      { size: 'XL', stock: 3, skuId: 'sku1-XL' }
    ]
  },
  {
    productId: 'p2', teamName: 'FC Barcelona', season: '2024 / 25', kitType: 'Home', version: 'Fan Version',
    imageUrl: '/images/messi.png', unitPrice: 1800, sizes: [
      { size: 'M', stock: 2, skuId: 'sku2-M' },
      { size: 'L', stock: 0, skuId: 'sku2-L' },
      { size: 'XL', stock: 0, skuId: 'sku2-XL' }
    ]
  },
  {
    productId: 'p3', teamName: 'Paris SG', season: '2024 / 25', kitType: 'Home', version: 'Player Issue',
    imageUrl: '/images/messi.png', unitPrice: 2600, sizes: [
      { size: 'S', stock: 4, skuId: 'sku3-S' },
      { size: 'M', stock: 1, skuId: 'sku3-M' }
    ]
  }
];

function JerseyModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizeObj, setSelectedSizeObj] = useState(null);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');
  
  const addItem = useInvoiceStore(state => state.addItem);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Reset panel on select new product
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSizeObj(null);
    setQty(1);
    setInstructions('');
  };

  const handleSizeSelect = (sizeObj) => {
    if (sizeObj.stock === 0) return;
    setSelectedSizeObj(sizeObj);
    setQty(1);
  };

  const handleAdd = () => {
    if (!selectedProduct || !selectedSizeObj) return;
    addItem({
      skuId: selectedSizeObj.skuId,
      productId: selectedProduct.productId,
      teamName: selectedProduct.teamName,
      season: selectedProduct.season,
      kitType: selectedProduct.kitType,
      version: selectedProduct.version,
      imageUrl: selectedProduct.imageUrl,
      size: selectedSizeObj.size,
      quantity: qty,
      maxQty: selectedSizeObj.stock,
      unitPrice: selectedProduct.unitPrice,
      specialInstruction: instructions
    });
    onClose();
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return MOCK_PRODUCTS;
    const lower = searchTerm.toLowerCase();
    return MOCK_PRODUCTS.filter(p => 
      p.teamName.toLowerCase().includes(lower) || 
      p.season.toLowerCase().includes(lower) ||
      p.kitType.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65" onClick={onClose}>
      <div 
        className="bg-white border-2 border-black flex flex-col shadow-[8px_8px_0px_#0A0A0A]" 
        style={{ width: 'min(90vw, 860px)', maxHeight: '85vh', borderRadius: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-vexor-black px-5 py-4 flex justify-between items-center shrink-0">
          <span className="font-heading italic text-[0.9rem] text-white tracking-[0.05em] uppercase">SELECT JERSEY</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 border-[1.5px] border-[#444] text-white flex items-center justify-center hover:border-vexor-orange hover:text-vexor-orange transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b-[1.5px] border-border-muted shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-border-muted" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH BY CLUB, SEASON..."
              className="w-full border-[1.5px] border-border-muted py-[10px] px-[14px] pl-9 font-body text-[0.85rem] uppercase outline-none shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[2px_2px_0px_#0A0A0A] transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        {/* Jersey Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
          {filteredProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Package size={40} className="text-border-muted mb-3" />
              <div className="font-heading text-[0.78rem] tracking-[0.15em] text-secondary uppercase">NO JERSEYS FOUND</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map(p => {
                const isSelected = selectedProduct?.productId === p.productId;
                return (
                  <div 
                    key={p.productId}
                    onClick={() => handleSelectProduct(p)}
                    className={`border-[1.5px] p-3 flex flex-col cursor-pointer transition-all duration-150 group ${
                      isSelected 
                        ? 'bg-vexor-black border-vexor-orange shadow-[4px_4px_0px_#FF5500]' 
                        : 'bg-white border-border-muted shadow-[3px_3px_0px_#E5E5E5] hover:border-vexor-orange hover:shadow-[4px_4px_0px_#FF5500] hover:-translate-x-[1px] hover:-translate-y-[1px]'
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="h-[100px] bg-neutral flex items-center justify-center mb-[10px]">
                      <img src={p.imageUrl} alt={p.teamName} className="max-h-[90px] object-contain mix-blend-multiply" />
                    </div>
                    <div className={`font-heading text-[0.78rem] font-[800] uppercase truncate ${isSelected ? 'text-white' : 'text-vexor-black'}`}>
                      {p.teamName}
                    </div>
                    <div className={`font-body text-[0.65rem] uppercase mt-[2px] ${isSelected ? 'text-white/80' : 'text-secondary'}`}>
                      {p.season} · {p.kitType} · {p.version}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.sizes.map(s => {
                        const noStock = s.stock === 0;
                        return (
                          <span 
                            key={s.size} 
                            className={`font-mono text-[0.58rem] px-[5px] py-[2px] ${
                              noStock ? 'bg-neutral text-[#CCCCCC]' : 'bg-border-muted text-vexor-black'
                            }`}
                          >
                            {s.size}·{s.stock}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection Panel */}
        {selectedProduct && (
          <div className="shrink-0 bg-[#FFF8F5] border-t-2 border-vexor-black p-4 sm:p-5 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-vexor-orange -translate-y-[2px]" />
            
            {/* Row 1: Sizes */}
            <div className="mb-4">
              <div className="font-heading text-[0.65rem] tracking-[0.15em] text-secondary mb-2 uppercase">SIZE</div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map(s => {
                  const noStock = s.stock === 0;
                  const isSelected = selectedSizeObj?.size === s.size;
                  return (
                    <button
                      key={s.size}
                      onClick={() => handleSizeSelect(s)}
                      disabled={noStock}
                      className={`w-11 h-9 flex items-center justify-center border-[1.5px] font-heading text-[0.7rem] uppercase transition-colors ${
                        noStock ? 'bg-neutral text-[#CCCCCC] border-border-muted cursor-not-allowed shadow-none' :
                        isSelected ? 'bg-vexor-black text-white border-vexor-black shadow-[3px_3px_0px_#FF5500]' :
                        'bg-white text-vexor-black border-border-muted shadow-[2px_2px_0px_#E5E5E5] hover:border-vexor-black cursor-pointer'
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: QTY + Instruction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <div className="font-heading text-[0.65rem] tracking-[0.15em] text-secondary mb-2 uppercase">QTY</div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="w-9 h-9 border-[1.5px] border-border-muted bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                  ><Minus size={14}/></button>
                  <input 
                    type="text" 
                    readOnly 
                    value={qty} 
                    className="w-16 h-9 border-y-[1.5px] border-x-0 border-border-muted text-center font-mono text-[0.85rem] outline-none bg-white"
                  />
                  <button 
                    onClick={() => setQty(Math.min(selectedSizeObj?.stock || 1, qty + 1))}
                    disabled={!selectedSizeObj || qty >= selectedSizeObj.stock}
                    className="w-9 h-9 border-[1.5px] border-border-muted bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    style={{ borderRadius: 0 }}
                  ><Plus size={14}/></button>
                </div>
              </div>
              
              <div>
                <div className="font-heading text-[0.65rem] tracking-[0.15em] text-secondary mb-2 uppercase">SPECIAL INSTRUCTIONS</div>
                <textarea 
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Print MESSI 10 on back..."
                  className="w-full min-h-[36px] max-h-[80px] border-[1.5px] border-[#E8D9A0] bg-[#FFFDE7] p-[8px] px-3 font-body text-[0.8rem] text-vexor-black outline-none shadow-[2px_2px_0px_#E8D9A0] focus:border-vexor-orange focus:shadow-[2px_2px_0px_#FF5500] resize-y transition-colors"
                  style={{ borderRadius: 0 }}
                />
              </div>
            </div>

            {/* Row 3: Actions */}
            <div className="flex justify-end gap-[10px]">
              <button 
                onClick={onClose}
                className="border-2 border-vexor-black bg-transparent font-heading text-[0.72rem] px-5 py-[10px] uppercase hover:shadow-[3px_3px_0px_#FF5500] transition-shadow"
                style={{ borderRadius: 0 }}
              >
                CANCEL
              </button>
              <button 
                onClick={handleAdd}
                disabled={!selectedSizeObj}
                className="bg-vexor-orange text-white font-heading text-[0.72rem] px-6 py-[10px] uppercase shadow-[3px_3px_0px_#0A0A0A] disabled:bg-secondary disabled:shadow-none hover:enabled:-translate-y-[1px] hover:enabled:-translate-x-[1px] hover:enabled:shadow-[4px_4px_0px_#0A0A0A] transition-all"
                style={{ borderRadius: 0 }}
              >
                ADD TO INVOICE →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Checkout() {
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

  // Attempt to generate a mock invoice ID matching the date for preview
  const previewInvoiceId = `VX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-NEW`;

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
      
      // Assume result gives PDF URL, or we construct it
      window.open(`/api/orders/${result.invoiceNumber || result._id}/pdf`, '_blank');
      
      clearInvoice();
      navigate('/dashboard'); // Should navigate to /orders/{id} eventually
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const text = await err.response.data.text();
          const errorData = JSON.parse(text);
          setSubmitError({ type: 'conflict', details: errorData.details });
        } catch {
          setSubmitError({ type: 'conflict', details: [] });
        }
      } else {
        setSubmitError({ type: 'error', message: 'PDF GENERATION FAILED' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral p-4 sm:p-8 overflow-x-hidden min-h-[calc(100vh-64px)]">
      <div className="max-w-[1100px] mx-auto space-y-6">
        
        {/* Section 1: Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-[2.2rem] font-[900] italic text-vexor-black leading-none m-0 uppercase">NEW INVOICE</h1>
            <p className="font-body text-[0.7rem] text-secondary tracking-[0.15em] mt-[6px] uppercase">BUILD ORDER // CONFIRM TO GENERATE PDF</p>
            <div className="font-mono text-[0.72rem] text-secondary tracking-[0.12em] mt-[10px]">{previewInvoiceId}</div>
          </div>
          <div className="flex gap-[10px]">
            <button 
              onClick={() => { clearInvoice(); navigate('/dashboard'); }}
              className="border-2 border-vexor-black bg-transparent font-heading text-[0.72rem] px-5 py-[10px] uppercase shadow-[3px_3px_0px_#E5E5E5] hover:shadow-[3px_3px_0px_#FF5500] hover:border-vexor-orange transition-all"
              style={{ borderRadius: 0 }}
            >
              DISCARD
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!canSubmit || isSubmitting}
              className={`font-heading text-[0.72rem] px-5 py-[10px] uppercase flex items-center justify-center transition-all ${
                isSubmitting ? 'bg-secondary text-white shadow-none cursor-not-allowed' :
                !canSubmit ? 'bg-secondary text-white shadow-none cursor-not-allowed' :
                'bg-vexor-orange text-white shadow-[3px_3px_0px_#0A0A0A] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[5px_5px_0px_#0A0A0A]'
              }`}
              style={{ borderRadius: 0 }}
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2"/> PROCESSING...</> : <>PRINT & CONFIRM ↗</>}
            </button>
          </div>
        </div>

        {/* Stock Conflict Banner */}
        {submitError?.type === 'conflict' && (
          <div className="bg-[#FEF2F2] border-2 border-[#DC2626] shadow-[3px_3px_0px_#DC2626] p-3 sm:p-4 mb-4">
            <div className="font-heading text-[0.75rem] font-bold text-[#DC2626] uppercase flex items-center mb-1"><AlertTriangle size={16} className="mr-2"/> STOCK CONFLICT</div>
            <div className="font-body text-[0.8rem] text-[#0A0A0A]">
              Some items exceed available stock. Please update quantities to continue.
            </div>
          </div>
        )}

        {/* Section 2: Customer Details */}
        <div className="bg-white border-[1.5px] border-border-muted shadow-[4px_4px_0px_#E5E5E5] p-6" style={{ borderRadius: 0 }}>
          <div className="font-heading italic text-[0.85rem] border-b-2 border-vexor-black pb-3 mb-5 uppercase text-vexor-black tracking-wide">
            ▐ CUSTOMER DETAILS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={`block font-heading text-[0.6rem] tracking-[0.18em] uppercase mb-[6px] ${validationErrors.name ? 'text-[#DC2626]' : 'text-secondary'}`}>FULL NAME *</label>
              <input 
                type="text" 
                value={customer_name}
                onChange={e => { setCustomerDetails({ customer_name: e.target.value }); setValidationErrors(prev => ({...prev, name: false})); }}
                className={`w-full border-[1.5px] p-[10px] px-[14px] font-body text-[0.88rem] text-vexor-black outline-none transition-shadow ${
                  validationErrors.name ? 'border-[#DC2626] shadow-[2px_2px_0px_#DC2626]' : 'border-border-muted shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[2px_2px_0px_#0A0A0A]'
                }`}
                style={{ borderRadius: 0 }}
              />
            </div>
            <div>
              <label className={`block font-heading text-[0.6rem] tracking-[0.18em] uppercase mb-[6px] ${validationErrors.phone ? 'text-[#DC2626]' : 'text-secondary'}`}>PHONE NUMBER *</label>
              <input 
                type="text" 
                value={customer_phone}
                onChange={e => { setCustomerDetails({ customer_phone: e.target.value }); setValidationErrors(prev => ({...prev, phone: false})); }}
                className={`w-full border-[1.5px] p-[10px] px-[14px] font-body text-[0.88rem] text-vexor-black outline-none transition-shadow ${
                  validationErrors.phone ? 'border-[#DC2626] shadow-[2px_2px_0px_#DC2626]' : 'border-border-muted shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[2px_2px_0px_#0A0A0A]'
                }`}
                style={{ borderRadius: 0 }}
              />
            </div>
            <div>
              <label className="block font-heading text-[0.6rem] tracking-[0.18em] uppercase mb-[6px] text-secondary">EMAIL (OPTIONAL)</label>
              <input 
                type="email" 
                value={customer_email}
                onChange={e => setCustomerDetails({ customer_email: e.target.value })}
                className="w-full border-[1.5px] border-border-muted p-[10px] px-[14px] font-body text-[0.88rem] text-vexor-black outline-none shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black focus:shadow-[2px_2px_0px_#0A0A0A] transition-shadow"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Order Items */}
        <div className="bg-white border-[1.5px] border-border-muted shadow-[4px_4px_0px_#E5E5E5] p-6" style={{ borderRadius: 0 }}>
          <div className="flex justify-between items-center border-b-2 border-vexor-black pb-3 mb-5">
            <div className="font-heading italic text-[0.85rem] uppercase text-vexor-black tracking-wide">
              ▐ ORDER ITEMS
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-vexor-black text-white px-[18px] py-[8px] font-heading text-[0.72rem] tracking-[0.12em] shadow-[3px_3px_0px_#FF5500] hover:bg-vexor-orange hover:shadow-[3px_3px_0px_#0A0A0A] transition-colors"
              style={{ borderRadius: 0 }}
            >
              + ADD JERSEY
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral border-b-2 border-vexor-black">
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-left uppercase w-[40px]">#</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-left uppercase">ITEM</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-left uppercase w-[90px]">SIZE</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-center uppercase w-[120px]">QTY</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-right uppercase w-[110px]">UNIT PRICE</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-right uppercase w-[120px]">TOTAL</th>
                <th className="font-heading text-[0.62rem] tracking-[0.15em] text-secondary px-[14px] py-[10px] text-center uppercase w-[48px]">✕</th>
              </tr>
            </thead>
            <tbody>
              {line_items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <ShoppingCart size={40} className="text-border-muted mx-auto mb-3" />
                    <div className="font-heading text-[0.78rem] tracking-[0.15em] text-secondary uppercase mt-3">NO ITEMS ADDED</div>
                    <div className="font-body text-[0.75rem] text-secondary mt-1">Click + ADD JERSEY to begin building this invoice.</div>
                  </td>
                </tr>
              ) : (
                line_items.map((item, idx) => {
                  const productDef = MOCK_PRODUCTS.find(p => p.productId === item.productId) || { sizes: [] };
                  const isConflict = submitError?.type === 'conflict' && submitError.details.some(d => d.sku_id === item.skuId);
                  
                  return (
                    <tr key={item._localId} className="group/item relative">
                      <td colSpan={7} className="p-0 border-b-[1px] border-border-muted hover:bg-[#FFF8F5] transition-colors relative bg-white">
                        
                        {/* Sub-row 1: Main Data */}
                        <div className="flex items-center px-[14px] py-3">
                          <div className="w-[26px] font-mono text-[0.75rem] text-secondary text-center shrink-0">{idx + 1}</div>
                          
                          <div className="flex-1 flex items-center px-[14px] min-w-[200px]">
                            <img src={item.imageUrl} alt={item.teamName} className="w-[40px] h-[52px] object-contain mix-blend-multiply bg-neutral shrink-0 mr-3 p-1 border-[1.5px] border-border-muted" />
                            <div>
                              <div className="font-heading font-[800] text-[0.85rem] text-vexor-black uppercase truncate">{item.teamName}</div>
                              <div className="font-body text-[0.7rem] text-secondary mt-[2px] uppercase">{item.season} · {item.kitType} · {item.version}</div>
                            </div>
                          </div>

                          <div className="w-[90px] px-[14px] shrink-0">
                            <select 
                              value={item.size}
                              onChange={e => {
                                const newSize = e.target.value;
                                const newSizeObj = productDef.sizes.find(s => s.size === newSize);
                                if (newSizeObj) {
                                  updateItem(item._localId, { 
                                    size: newSize, skuId: newSizeObj.skuId, maxQty: newSizeObj.stock, quantity: Math.min(item.quantity, newSizeObj.stock)
                                  });
                                }
                              }}
                              className="w-full border-[1.5px] border-border-muted p-[6px] px-[10px] font-heading text-[0.72rem] text-vexor-black uppercase outline-none shadow-[2px_2px_0px_#E5E5E5] focus:border-vexor-black bg-white appearance-none cursor-pointer"
                              style={{ borderRadius: 0 }}
                            >
                              {productDef.sizes.filter(s => s.stock > 0 || s.size === item.size).map(s => (
                                <option key={s.size} value={s.size} disabled={s.stock === 0}>{s.size}</option>
                              ))}
                            </select>
                          </div>

                          <div className="w-[120px] px-[14px] shrink-0 flex items-center justify-center">
                            <button 
                              onClick={() => updateItem(item._localId, { quantity: Math.max(1, item.quantity - 1) })}
                              disabled={item.quantity <= 1}
                              className="w-[24px] h-[24px] border-[1px] border-border-muted bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                              style={{ borderRadius: 0 }}
                            ><Minus size={12}/></button>
                            <input 
                              type="text" readOnly value={item.quantity}
                              className={`w-[48px] h-[24px] border-y-[1px] border-x-0 text-center font-mono text-[0.85rem] outline-none bg-transparent ${isConflict ? 'border-[#DC2626] text-[#DC2626] font-bold' : 'border-border-muted text-vexor-black'}`}
                            />
                            <button 
                              onClick={() => updateItem(item._localId, { quantity: Math.min(item.maxQty, item.quantity + 1) })}
                              disabled={item.quantity >= item.maxQty}
                              className="w-[24px] h-[24px] border-[1px] border-border-muted bg-white flex items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                              style={{ borderRadius: 0 }}
                            ><Plus size={12}/></button>
                          </div>

                          <div className="w-[110px] px-[14px] font-mono text-[0.85rem] text-secondary text-right shrink-0">
                            ৳ {item.unitPrice.toLocaleString()}
                          </div>
                          
                          <div className="w-[120px] px-[14px] font-mono text-[0.95rem] font-[700] text-vexor-black text-right shrink-0">
                            ৳ {item.lineTotal.toLocaleString()}
                          </div>

                          <div className="w-[48px] flex items-center justify-center shrink-0">
                            <button 
                              onClick={() => removeItem(item._localId)}
                              className="w-[28px] h-[28px] border-[1.5px] border-border-muted bg-white flex items-center justify-center text-secondary hover:border-[#DC2626] hover:text-[#DC2626] hover:shadow-[2px_2px_0px_#DC2626] transition-all cursor-pointer"
                              style={{ borderRadius: 0 }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Sub-row 2: Special Instructions */}
                        <div className={`px-[14px] pl-[68px] pb-3 bg-[#FFFBF0] border-t-0 border-b-2 border-border-muted transition-all overflow-hidden ${
                          !item.specialInstruction ? 'h-[28px] pt-[6px] hover:h-[72px] hover:pt-0' : 'pt-0'
                        }`}>
                          <div className="font-heading text-[0.58rem] tracking-[0.18em] text-secondary mb-[4px] uppercase">
                            SPECIAL INSTRUCTIONS
                          </div>
                          <textarea 
                            value={item.specialInstruction}
                            onChange={e => updateItem(item._localId, { specialInstruction: e.target.value })}
                            placeholder="e.g. Print MESSI 10 on back, add World Cup patch..."
                            className={`w-full resize-y border-[1.5px] border-[#E8D9A0] bg-[#FFFDE7] p-[8px] px-3 font-body text-[0.8rem] text-vexor-black outline-none shadow-[2px_2px_0px_#E8D9A0] focus:border-vexor-orange focus:shadow-[2px_2px_0px_#FF5500] transition-colors ${
                              !item.specialInstruction ? 'hidden group-hover/item:block h-[36px]' : 'min-h-[36px] max-h-[80px]'
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

          {/* Invoice Summary */}
          {line_items.length > 0 && (
            <div className="flex flex-col items-end mt-0">
              <div className="w-full h-[2px] bg-vexor-black" />
              <div className="pt-4 flex flex-col items-end gap-[6px] min-w-[280px]">
                <div className="flex justify-between w-full items-center">
                  <span className="font-heading text-[0.65rem] tracking-[0.15em] text-secondary uppercase">SUBTOTAL</span>
                  <span className="font-mono text-[1rem] text-vexor-black">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full items-center mt-2">
                  <span className="font-heading text-[0.9rem] font-[900] text-vexor-black uppercase">TOTAL</span>
                  <span className="font-mono text-[1.4rem] font-[700] text-vexor-orange">৳ {subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <JerseyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
