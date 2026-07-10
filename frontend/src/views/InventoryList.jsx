import { useState } from 'react';
import { useProducts, useProductSkus, useRestockSku } from '../api/products';
import { Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const handleRestock = (skuId) => {
    const qty = window.prompt('Enter quantity to restock:');
    if (qty && !isNaN(qty) && Number(qty) > 0) {
      restock.mutate({ skuId, quantity: Number(qty) });
    }
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
        <h3 className="font-heading uppercase text-xl mb-1 truncate" title={product.club_country_name}>
          {product.club_country_name}
        </h3>
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
                <button key={sku._id} onClick={() => handleRestock(sku._id)} title="Restock">
                  <SkuBadge sku={sku} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
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
