import { useState } from 'react';
import { useProducts, useProductSkus, useRestockSku } from '../api/products';
import { Package, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestockModal = ({ sku, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState(sku.cost_price !== undefined ? sku.cost_price : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) return;
    
    onRestock({ 
      skuId: sku._id, 
      quantity: qty, 
      cost_price: costPrice === '' ? undefined : Number(costPrice) 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white border-4 border-black p-6 w-full max-w-md shadow-brutal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-heading uppercase text-2xl font-[900] italic">RESTOCK: {sku.size}</h2>
            <p className="font-body text-xs font-bold text-secondary uppercase mt-1">Current Stock: {sku.stock_available}</p>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-bold uppercase text-sm mb-2 text-secondary tracking-widest">Quantity to Add</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)}
              className="w-full border-2 border-black p-3 font-mono text-xl font-bold focus:border-accent focus:shadow-[4px_4px_0px_#FF5500] outline-none transition-all"
              min="1"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-sm mb-2 text-secondary tracking-widest">New Cost Price (৳)</label>
            <input 
              type="number" 
              value={costPrice} 
              onChange={e => setCostPrice(e.target.value)}
              className="w-full border-2 border-black p-3 font-mono text-xl font-bold focus:border-accent focus:shadow-[4px_4px_0px_#FF5500] outline-none transition-all"
              min="0"
            />
            <p className="text-xs text-secondary mt-2 font-bold uppercase">Leave unchanged to keep current cost (৳{sku.cost_price || 0})</p>
          </div>
          
          <button type="submit" className="w-full bg-accent text-white py-4 font-heading uppercase text-xl font-[900] italic tracking-wider shadow-[4px_4px_0px_#0A0A0A] hover:bg-black hover:shadow-[4px_4px_0px_#FF5500] hover:-translate-y-0.5 transition-all mt-4">
            CONFIRM RESTOCK ↗
          </button>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({ product, onClose, onDelete }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    onDelete(password, (errMessage) => setError(errMessage));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#FF5500] p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-accent">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="font-headline text-3xl italic font-[900] uppercase text-black mb-2">Delete Product</h2>
        <p className="font-bold text-sm uppercase text-secondary mb-6">
          Removing <span className="text-accent">{product.club_country_name}</span>. This action cannot be undone. Enter master password to confirm.
        </p>

        {error && <p className="text-red-600 font-bold text-xs uppercase mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-heading text-xs uppercase font-bold tracking-widest text-secondary mb-2">Master Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 font-mono text-xl font-bold focus:border-accent focus:shadow-[4px_4px_0px_#FF5500] outline-none transition-all"
            />
          </div>
          
          <button type="submit" className="w-full bg-red-600 text-white py-4 font-heading uppercase text-xl font-[900] italic tracking-wider shadow-[4px_4px_0px_#0A0A0A] hover:bg-black hover:shadow-[4px_4px_0px_#DC2626] hover:-translate-y-0.5 transition-all mt-4">
            CONFIRM DELETE ✕
          </button>
        </form>
      </div>
    </div>
  );
};

const SkuBadge = ({ sku }) => {
  const isLowStock = sku.stock_available > 0 && sku.stock_available <= 3;
  const isOutOfStock = sku.stock_available === 0;
  
  let colorClass = "bg-neutral text-black";
  if (isOutOfStock) colorClass = "bg-red-100 text-red-700 border-red-500";
  else if (isLowStock) colorClass = "bg-yellow-100 text-yellow-700 border-yellow-500";
  
  return (
    <div className={`text-xs border-2 border-black font-bold px-2 py-1 flex items-center justify-between ${colorClass}`}>
      <div className="flex flex-col">
        <span>{sku.size}</span>
        {sku.cost_price !== undefined && <span className="text-[9px] opacity-80">৳{sku.cost_price}</span>}
      </div>
      <span className="ml-2 text-right">
        {isOutOfStock ? 'OUT OF STOCK' : `${sku.stock_available}${isLowStock ? ' (LOW)' : ''}`}
      </span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { data: skuData, isLoading } = useProductSkus(product._id);
  const restock = useRestockSku();
  const deleteProd = useDeleteProduct();
  const [restockSkuTarget, setRestockSkuTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleRestock = ({ skuId, quantity, cost_price }) => {
    restock.mutate({ skuId, data: { quantity, cost_price } }, {
      onSuccess: () => setRestockSkuTarget(null)
    });
  };

  const handleDelete = (password, setError) => {
    deleteProd.mutate({ productId: product._id, password }, {
      onSuccess: () => setShowDelete(false),
      onError: (err) => {
        const msg = err.response?.data?.error || 'Failed to delete product';
        setError(msg);
      }
    });
  };

  let priceDisplay = `৳${product.base_price || 0}`;
  if (skuData?.skus?.length > 0) {
    const prices = skuData.skus.map(s => s.cost_price).filter(p => p !== undefined && p !== null);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      priceDisplay = minPrice === maxPrice ? `৳${minPrice}` : `৳${minPrice} - ৳${maxPrice}`;
    }
  }

  return (
    <div className="bg-white border-2 border-black shadow-brutal p-4 flex flex-col">
      <div className="aspect-[4/5] bg-neutral border-2 border-black mb-4 overflow-hidden relative group">
        <img src={product.image_url} alt={product.club_country_name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading uppercase text-xl truncate pr-2" title={product.club_country_name}>
            {product.club_country_name}
          </h3>
          <button onClick={() => setShowDelete(true)} className="text-muted hover:text-red-600 transition-colors" title="Delete Product">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted text-sm font-bold uppercase mb-2">
          {product.season} • {product.kit_type} • {product.version}
        </p>
        <p className="text-accent font-heading text-lg mb-4">{isLoading ? '...' : priceDisplay}</p>
        
        <div className="space-y-2">
          <p className="font-bold uppercase text-xs">Inventory (Click to restock)</p>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <span className="text-xs text-muted uppercase font-bold">Loading SKUs...</span>
            ) : (
              skuData?.skus.map((sku) => (
                <button key={sku._id} onClick={() => setRestockSkuTarget(sku)} title="Restock" className="hover:-translate-y-0.5 transition-transform">
                  <SkuBadge sku={sku} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {restockSkuTarget && (
        <RestockModal 
          sku={restockSkuTarget} 
          onClose={() => setRestockSkuTarget(null)} 
          onRestock={handleRestock} 
        />
      )}
      {showDelete && (
        <DeleteModal 
          product={product} 
          onClose={() => setShowDelete(false)} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

const InventoryList = () => {
  const { data, isLoading, error } = useProducts(1, 100); // simplify pagination for MVP
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKitType, setFilterKitType] = useState('All');
  const [filterSeason, setFilterSeason] = useState('All');

  if (isLoading) return <div className="p-8 font-heading uppercase text-2xl">Loading Catalog...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold uppercase">Error loading catalog.</div>;

  const uniqueSeasons = Array.from(new Set(data?.products?.map(p => p.season) || [])).sort();

  const filteredProducts = data?.products?.filter(product => {
    const matchesSearch = product.club_country_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.kit_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.season.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKitType = filterKitType === 'All' || product.kit_type === filterKitType;
    const matchesSeason = filterSeason === 'All' || product.season === filterSeason;
    return matchesSearch && matchesKitType && matchesSeason;
  }) || [];

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b-4 border-black pb-4 gap-4">
          <div>
            <h1 className="text-5xl text-accent uppercase mb-2">Inventory</h1>
            <p className="font-bold text-muted uppercase">Manage products and stock</p>
          </div>
          
          <Link to="/inventory/new">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-accent w-full sm:w-auto justify-center">
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 border-2 border-black shadow-brutal">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by team, type, or season..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:border-accent font-bold uppercase"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={filterKitType} 
              onChange={(e) => setFilterKitType(e.target.value)}
              className="p-3 border-2 border-black bg-white font-bold uppercase outline-none focus:border-accent"
            >
              <option value="All">All Kit Types</option>
              <option value="Home">Home</option>
              <option value="Away">Away</option>
              <option value="Third">Third</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Special">Special</option>
            </select>

            <select 
              value={filterSeason} 
              onChange={(e) => setFilterSeason(e.target.value)}
              className="p-3 border-2 border-black bg-white font-bold uppercase outline-none focus:border-accent"
            >
              <option value="All">All Seasons</option>
              {uniqueSeasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border-2 border-black border-dashed bg-white">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
            <h3 className="font-heading text-2xl uppercase mb-2">No Products Found</h3>
            <p className="font-bold text-muted uppercase">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
