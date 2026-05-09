import { useState } from 'react';
import api from '../lib/api';

export default function ProductManagementSection({ products, onRefresh, busy, message, setBusy, setMessage }) {
  const [productForm, setProductForm] = useState({ 
    name: '', 
    category: 'PROTEIN', 
    price: '', 
    details: '', 
    description: '', 
    stock: '',
    image: null 
  });
  const [productEditId, setProductEditId] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setMessage('File size must be less than 5MB');
        return;
      }

      setProductForm({ ...productForm, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.onerror = () => setMessage('Failed to read image file');
      reader.readAsDataURL(file);
    }
  };

  const submitProduct = async () => {
    try {
      setBusy('product');
      setMessage('');

      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('category', productForm.category);
      formData.append('price', productForm.price);
      formData.append('details', productForm.details);
      formData.append('description', productForm.description);
      formData.append('stock', productForm.stock);
      
      if (productForm.image && productForm.image instanceof File) {
        formData.append('image', productForm.image);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      if (productEditId) {
        await api.put(`/products/${productEditId}`, formData, config);
      } else {
        await api.post('/products', formData, config);
      }

      setProductForm({ name: '', category: 'PROTEIN', price: '', details: '', description: '', stock: '', image: null });
      setProductEditId('');
      setImagePreview('');
      setUploadProgress(0);
      setMessage('Product saved successfully!');
      await onRefresh();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to save product');
    } finally {
      setBusy('');
    }
  };

  const startEditProduct = (product) => {
    setProductEditId(product._id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'PROTEIN',
      price: product.price ? String(product.price) : '',
      details: product.details || '',
      description: product.description || '',
      stock: product.stock ? String(product.stock) : '',
      image: null,
    });
    setImagePreview(product.image || '');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      setBusy('product');
      await api.delete(`/products/${id}`);
      setMessage('Product deleted successfully');
      await onRefresh();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div className={`rounded-2xl p-4 ${
          message.includes('Failed') || message.includes('failed') || message.includes('Please')
            ? 'bg-red-900/20 text-red-400 border border-red-900/50' 
            : 'bg-green-900/20 text-green-400 border border-green-900/50'
        }`}>
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}

      {/* Product Form */}
      <div className="glass rounded-3xl p-8 animate-scaleIn">
        <h4 className="text-2xl font-bold text-white mb-2">Add/Edit Product</h4>
        <p className="text-slate-400 mb-6 text-sm">Create or modify supplement products with images</p>
        
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Image Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Product Image</label>
            <div className="rounded-2xl border-2 border-dashed border-white/20 p-6 text-center hover:border-sfBlue/50 transition cursor-pointer bg-white/5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
                id="product-image"
              />
              <label htmlFor="product-image" className="cursor-pointer block">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" className="h-40 w-40 mx-auto rounded-lg object-cover mb-3 border border-white/20" />
                    <p className="text-xs text-slate-400">Click to change image</p>
                    <p className="text-xs text-slate-500 mt-1">{productForm.image?.name || 'Image selected'}</p>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-slate-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm text-white font-semibold">📤 Click or drag to upload image</p>
                    <p className="text-xs text-slate-400 mt-2">JPG, PNG, WebP or GIF up to 5MB</p>
                    <p className="text-xs text-slate-500 mt-2">✅ Auto-uploads to Cloudinary</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <input
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            placeholder="Product name"
            className="form-input"
          />
          <select
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            className="form-select"
          >
            <option value="PROTEIN">Protein</option>
            <option value="SUPPLEMENT">Supplement</option>
            <option value="VITAMIN">Vitamin</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            placeholder="Price (Rs)"
            type="number"
            className="form-input"
          />
          <input
            value={productForm.stock}
            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
            placeholder="Stock quantity"
            type="number"
            className="form-input"
          />
          <input
            value={productForm.details}
            onChange={(e) => setProductForm({ ...productForm, details: e.target.value })}
            placeholder="Short details"
            className="form-input"
          />
          <textarea
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            placeholder="Full description"
            className="form-input min-h-28 sm:col-span-2 resize-none"
          />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-400">Uploading image...</p>
              <p className="text-xs font-semibold text-sfBlue">{uploadProgress}%</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-sfBlue h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadProgress === 100 && (
          <div className="mt-4 text-xs text-green-400 flex items-center gap-2">
            <span>✅</span> Image uploaded successfully!
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={submitProduct}
            disabled={busy === 'product'}
            className="btn-secondary flex-1"
          >
            {busy === 'product' ? 'Saving...' : productEditId ? 'Update Product' : 'Save Product'}
          </button>
          {productEditId && (
            <button
              onClick={() => {
                setProductEditId('');
                setProductForm({ name: '', category: 'PROTEIN', price: '', details: '', description: '', stock: '', image: null });
                setImagePreview('');
              }}
              className="rounded-2xl border border-white/15 px-5 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Products Grid with Images */}
      <div className="glass rounded-3xl p-8 animate-scaleIn">
        <h4 className="text-2xl font-bold text-white mb-2">All Products</h4>
        <p className="text-slate-400 mb-6 text-sm">View and manage all products with images</p>

        {products.data && products.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.data.map((product, idx) => (
              <div
                key={product._id}
                className="glass rounded-3xl overflow-hidden animate-slideIn hover:scale-105 transition-transform group"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Product Image */}
                <div className="relative h-48 w-full bg-gradient-to-br from-sfBlue/20 to-sfRed/20 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="font-bold text-white">{product.name}</h5>
                      <p className="text-xs text-slate-400 mt-1">{product.category}</p>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                    {product.details || product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between mb-4">
                    <p className="text-2xl font-black text-sfRed">Rs {product.price}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-sfBlue/20 text-sfBlue">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditProduct(product)}
                      className="flex-1 rounded-lg bg-sfBlue/20 text-sfBlue font-semibold text-sm py-2 hover:bg-sfBlue/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 rounded-lg bg-rose-500/20 text-rose-200 font-semibold text-sm py-2 hover:bg-rose-500/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No products yet. Create your first product above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
