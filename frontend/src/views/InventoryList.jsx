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
    <div className={`text-xs border-2 border-black font-bold px-2 py-1 ${colorClass}`}>
      {sku.size}: {sku.stock_available}
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

  return (
    <div className="bg-white border-2 border-black shadow-brutal p-4 flex flex-col">
      <div className="h-48 bg-neutral border-2 border-black mb-4 overflow-hidden relative group">
        <img src={product.image_url} alt={product.club_country_name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-heading uppercase text-xl mb-1 truncate" title={product.club_country_name}>
          {product.club_country_name}
        </h3>
        <p className="text-muted text-sm font-bold uppercase mb-2">
          {product.season} • {product.kit_type} • {product.version}
        </p>
        <p className="text-accent font-heading text-lg mb-4">৳{product.base_price}</p>
        
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

  if (isLoading) return <div className="p-8 font-heading uppercase text-2xl">Loading Catalog...</div>;
  if (error) return <div className="p-8 text-red-500 font-bold uppercase">Error loading catalog.</div>;

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-5xl text-accent uppercase mb-2">Inventory</h1>
            <p className="font-bold text-muted uppercase">Manage products and stock</p>
          </div>
          
          <Link to="/inventory/new">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-accent">
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </Link>
        </div>

        {data?.products?.length === 0 ? (
          <div className="text-center py-20 border-2 border-black border-dashed bg-white">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
            <h3 className="font-heading text-2xl uppercase mb-2">No Products Found</h3>
            <p className="font-bold text-muted uppercase">Add your first jersey to start selling.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
