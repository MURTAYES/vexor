import { useState, useEffect } from 'react';
import { useSearchProducts, useProductSkus } from '../api/products';
import useInvoiceStore from '../store/invoiceStore';
import { X, Search } from 'lucide-react';

const ProductResult = ({ product, onSelect }) => {
  return (
    <div 
      className="border-2 border-black p-2 flex items-center gap-4 cursor-pointer hover:bg-neutral"
      onClick={() => onSelect(product)}
    >
      <div className="w-12 h-12 bg-neutral border-2 border-black">
        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-heading uppercase truncate">{product.club_country_name}</p>
        <p className="text-xs font-bold text-muted uppercase">{product.season} • {product.kit_type}</p>
      </div>
      <div className="font-heading text-accent">৳{product.base_price}</div>
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
      product_id: product._id,
      product_name: product.club_country_name,
      product_image: product.image_url,
      sku_id: selectedSku.sku_id,
      size: selectedSku.size,
      quantity,
      snapshot_price: product.base_price, // Client-side estimate, server recalculates
      special_instruction: instruction,
    });
    
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white relative p-6">
      <button onClick={onCancel} className="absolute top-4 right-4 p-2 bg-neutral hover:bg-black hover:text-white border-2 border-black">
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4 mb-6 mt-4">
        <img src={product.image_url} alt="" className="w-24 h-24 border-2 border-black object-cover" />
        <div>
          <h2 className="font-heading text-2xl uppercase">{product.club_country_name}</h2>
          <p className="font-bold text-muted uppercase">{product.season} • {product.kit_type}</p>
          <p className="text-accent font-heading text-xl mt-2">৳{product.base_price}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-bold uppercase text-sm mb-2">Select Size</p>
        <div className="flex gap-2 flex-wrap">
          {isLoading ? (
            <div className="animate-pulse h-10 bg-neutral w-full"></div>
          ) : (
            data?.skus.map(sku => {
              const isOutOfStock = sku.stock_available === 0;
              const isSelected = selectedSku?.sku_id === sku.sku_id;
              
              return (
                <button
                  key={sku._id}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSku({ sku_id: sku.sku_id, size: sku.size, stock: sku.stock_available })}
                  className={`border-2 border-black px-4 py-2 font-bold uppercase transition-colors
                    ${isOutOfStock ? 'opacity-30 cursor-not-allowed bg-neutral' : 'hover:bg-accent hover:text-white'}
                    ${isSelected ? 'bg-black text-white shadow-brutal' : 'bg-white'}
                  `}
                >
                  {sku.size}
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedSku && (
        <>
          <div className="mb-6">
            <p className="font-bold uppercase text-sm mb-2">Quantity (Max: {selectedSku.stock})</p>
            <input 
              type="number" 
              min="1" 
              max={selectedSku.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 font-bold"
            />
          </div>

          <div className="mb-6">
            <p className="font-bold uppercase text-sm mb-2">Special Instruction (Optional)</p>
            <input 
              type="text" 
              maxLength="300"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full p-3 font-bold"
              placeholder="e.g. Needs custom printing on back"
            />
          </div>
          
          <div className="mt-auto">
            <button 
              onClick={handleAdd}
              className="w-full bg-accent text-white py-4 text-xl hover:bg-black uppercase"
            >
              Add To Invoice
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const InvoiceBuilderPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // BLDR-02: Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        setDebouncedTerm(searchTerm);
      } else {
        setDebouncedTerm('');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useSearchProducts(debouncedTerm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-black shadow-brutal w-full max-w-2xl h-[80vh] flex flex-col relative overflow-hidden">
        
        {selectedProduct ? (
          <ProductSelector 
            product={selectedProduct} 
            onCancel={() => setSelectedProduct(null)} 
            onClose={onClose}
          />
        ) : (
          <>
            <div className="p-6 border-b-2 border-black flex items-center gap-4 bg-neutral">
              <Search className="w-6 h-6 text-muted" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search products by club or season..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-2xl font-heading uppercase placeholder-muted placeholder-opacity-50"
                style={{boxShadow: 'none', border: 'none'}}
              />
              <button onClick={onClose} className="p-2 hover:bg-black hover:text-white border-2 border-black ml-4 bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && <p className="font-bold uppercase text-muted text-center py-8">Searching...</p>}
              {!isLoading && data?.products?.length === 0 && debouncedTerm && (
                <p className="font-bold uppercase text-muted text-center py-8">No results found for "{debouncedTerm}"</p>
              )}
              {!isLoading && !debouncedTerm && (
                <div className="text-center py-12">
                  <p className="font-heading text-2xl uppercase text-muted mb-2">Build Invoice</p>
                  <p className="font-bold text-muted uppercase text-sm">Type at least 2 characters to search.</p>
                </div>
              )}
              {data?.products?.map(product => (
                <ProductResult 
                  key={product._id} 
                  product={product} 
                  onSelect={setSelectedProduct} 
                />
              ))}
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default InvoiceBuilderPopup;
