import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useUploadImage, useCreateProduct } from '../api/products';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const productSchema = z.object({
  club_country_name: z.string().min(1, 'Required'),
  season: z.string().min(1, 'Required'),
  kit_type: z.enum(['Home', 'Away', 'Third', 'Goalkeeper', 'Special']),
  version: z.enum(['General', 'Retro', 'Player Issue']),
  base_price: z.number().min(0, 'Must be positive').optional(),
  initial_stock: z.record(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']), z.object({
    stock: z.number().min(0).default(0),
    cost_price: z.number().min(0).default(0)
  })),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  const uploadImage = useUploadImage();
  const createProduct = useCreateProduct();
  const [globalCost, setGlobalCost] = useState('');

  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      kit_type: 'Home',
      version: 'General',
      initial_stock: { 
        XS: { stock: 0, cost_price: 0 }, 
        S: { stock: 0, cost_price: 0 }, 
        M: { stock: 0, cost_price: 0 }, 
        L: { stock: 0, cost_price: 0 }, 
        XL: { stock: 0, cost_price: 0 }, 
        XXL: { stock: 0, cost_price: 0 } 
      }
    }
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const clubCountry = getValues('club_country_name');
    const season = getValues('season');
    const kitType = getValues('kit_type');

    if (!clubCountry || !season) {
      setUploadError('Please fill out Club/Country and Season first');
      e.target.value = '';
      return;
    }
    
    setUploadError('');
    try {
      const url = await uploadImage.mutateAsync({
        file,
        jerseyName: clubCountry,
        category: kitType,
        year: season
      });
      setImageUrl(url);
    } catch (err) {
      setUploadError('Failed to upload image');
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      setUploadError('Image is required');
      return;
    }

    try {
      await createProduct.mutateAsync({ ...data, image_url: imageUrl });
      navigate('/inventory');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
          <Link to="/inventory">
            <button className="p-2 border-2 border-black hover:bg-black hover:text-white bg-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="text-4xl text-accent uppercase">Add New Product</h1>
        </div>

        <div className="bg-white border-2 border-black shadow-brutal p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Image Upload Section */}
            <div>
              <label className="block font-heading uppercase mb-2">Product Image</label>
              <div className="flex items-start gap-6">
                <div className="w-48 h-48 border-2 border-black border-dashed flex items-center justify-center bg-neutral relative overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      {uploadImage.isPending ? (
                         <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted" />
                          <span className="text-sm font-bold uppercase text-muted">Upload Image</span>
                        </>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadImage.isPending}
                  />
                </div>
                {uploadError && <p className="text-red-500 font-bold uppercase">{uploadError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-heading uppercase mb-2">Club / Country</label>
                <input type="text" {...register('club_country_name')} className="w-full p-3" placeholder="e.g. Barcelona" />
                {errors.club_country_name && <p className="text-red-500 text-sm font-bold uppercase mt-1">{errors.club_country_name.message}</p>}
              </div>
              
              <div>
                <label className="block font-heading uppercase mb-2">Season</label>
                <input type="text" {...register('season')} className="w-full p-3" placeholder="e.g. 24/25" />
                {errors.season && <p className="text-red-500 text-sm font-bold uppercase mt-1">{errors.season.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block font-heading uppercase mb-2">Kit Type</label>
                <select {...register('kit_type')} className="w-full p-3 uppercase font-bold text-sm">
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                  <option value="Third">Third</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Special">Special</option>
                </select>
              </div>

              <div>
                <label className="block font-heading uppercase mb-2">Version</label>
                <select {...register('version')} className="w-full p-3 uppercase font-bold text-sm">
                  <option value="General">General</option>
                  <option value="Player Issue">Player Issue</option>
                  <option value="Retro">Retro</option>
                </select>
              </div>
            </div>

            {/* Initial Stock */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 border-b-2 border-black pb-2 gap-4">
                <label className="block font-heading text-xl uppercase">Initial Stock (Optional)</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase">Cost (Apply All):</span>
                  <input 
                    type="number" 
                    value={globalCost}
                    onChange={(e) => setGlobalCost(e.target.value)}
                    className="border-2 border-black p-1 w-24 text-sm"
                    placeholder="e.g. 1000"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      if (globalCost) {
                        SIZES.forEach(s => setValue(`initial_stock.${s}.cost_price`, Number(globalCost)));
                      }
                    }}
                    className="bg-black text-white px-3 py-1 font-bold text-xs uppercase hover:bg-accent"
                  >
                    Apply All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {SIZES.map(size => (
                  <div key={size} className="flex flex-col gap-1">
                    <label className="block font-bold uppercase text-xs mb-1 text-center bg-black text-white py-1">{size}</label>
                    <input 
                      type="number" 
                      placeholder="Qty"
                      {...register(`initial_stock.${size}.stock`, { valueAsNumber: true })} 
                      className="w-full p-2 text-center text-sm border-2 border-black" 
                      min="0"
                    />
                    <span className="text-[10px] font-bold uppercase text-center mt-2">Ind. Cost ৳</span>
                    <input 
                      type="number" 
                      placeholder="0"
                      {...register(`initial_stock.${size}.cost_price`, { valueAsNumber: true })} 
                      className="w-full p-2 text-center text-sm border-2 border-black" 
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={createProduct.isPending || uploadImage.isPending}
              className="w-full bg-accent text-white py-4 text-xl hover:bg-black disabled:bg-muted"
            >
              {createProduct.isPending ? 'Saving...' : 'Add Product to Catalog'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
