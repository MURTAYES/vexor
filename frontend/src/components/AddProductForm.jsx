import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadImage, useCreateProduct } from '../api/products';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const productSchema = z.object({
  club_country_name: z.string().min(1, 'Required'),
  season: z.string().min(1, 'Required'),
  kit_type: z.enum(['Home', 'Away', 'Third', 'Goalkeeper', 'Special']),
  version: z.enum(['General', 'Retro', 'Player Issue']),
  base_price: z.number().min(0, 'Must be positive'),
  initial_stock: z.record(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']), z.number().min(0)),
});

const AddProductForm = ({ onSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  const uploadImage = useUploadImage();
  const createProduct = useCreateProduct();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      kit_type: 'Home',
      version: 'General',
      initial_stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
    }
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    try {
      const url = await uploadImage.mutateAsync(file);
      setImageUrl(url);
    } catch {
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
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block font-headline uppercase mb-2 text-sm font-bold">Product Image</label>
        <div className="flex items-start gap-6">
          <div className="w-40 h-40 border-2 border-vexor-black border-dashed flex items-center justify-center bg-surface-neutral relative overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                {uploadImage.isPending ? (
                  <span className="material-symbols-outlined animate-spin text-border-muted">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-border-muted text-[32px]">upload</span>
                    <span className="block text-xs font-bold uppercase text-border-muted mt-1">Upload</span>
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
          {uploadError && <p className="text-error font-bold uppercase text-sm">{uploadError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-headline uppercase mb-1 text-sm font-bold">Club / Country</label>
          <input type="text" {...register('club_country_name')} className="w-full p-3" placeholder="e.g. Barcelona" />
          {errors.club_country_name && <p className="text-error text-xs font-bold uppercase mt-1">{errors.club_country_name.message}</p>}
        </div>

        <div>
          <label className="block font-headline uppercase mb-1 text-sm font-bold">Season</label>
          <input type="text" {...register('season')} className="w-full p-3" placeholder="e.g. 24/25" />
          {errors.season && <p className="text-error text-xs font-bold uppercase mt-1">{errors.season.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-headline uppercase mb-1 text-sm font-bold">Kit Type</label>
          <select {...register('kit_type')} className="w-full p-3 uppercase font-bold text-sm">
            <option value="Home">Home</option>
            <option value="Away">Away</option>
            <option value="Third">Third</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Special">Special</option>
          </select>
        </div>

        <div>
          <label className="block font-headline uppercase mb-1 text-sm font-bold">Version</label>
          <select {...register('version')} className="w-full p-3 uppercase font-bold text-sm">
            <option value="General">General</option>
            <option value="Player Issue">Player Issue</option>
            <option value="Retro">Retro</option>
          </select>
        </div>

        <div>
          <label className="block font-headline uppercase mb-1 text-sm font-bold">Base Price (৳)</label>
          <input type="number" {...register('base_price', { valueAsNumber: true })} className="w-full p-3" placeholder="1500" />
          {errors.base_price && <p className="text-error text-xs font-bold uppercase mt-1">{errors.base_price.message}</p>}
        </div>
      </div>

      {/* Initial Stock */}
      <div>
        <label className="block font-headline uppercase mb-3 text-sm font-bold border-b border-border-muted pb-2">Initial Stock</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {SIZES.map(size => (
            <div key={size}>
              <label className="block font-bold uppercase text-xs mb-1 text-center text-secondary">{size}</label>
              <input
                type="number"
                {...register(`initial_stock.${size}`, { valueAsNumber: true })}
                className="w-full p-2 text-center"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={createProduct.isPending || uploadImage.isPending}
        className="w-full bg-vexor-orange text-white py-4 font-headline text-lg italic uppercase font-bold hover:bg-vexor-black disabled:opacity-50 transition-colors border-2 border-vexor-black"
      >
        {createProduct.isPending ? 'SAVING...' : 'ADD PRODUCT TO CATALOG'}
      </button>
    </form>
  );
};

export default AddProductForm;
