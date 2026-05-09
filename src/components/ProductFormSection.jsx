import { useState } from 'react';
import api from '../lib/api';

export default function ProductFormSection({ products, plans, onRefresh, busy, message, setBusy, setMessage }) {
  const [productForm, setProductForm] = useState({ name: '', category: 'PROTEIN', price: '', details: '', description: '', stock: '', image: null });
  const [productEditId, setProductEditId] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({ ...productForm, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
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

      if (productEditId) {
        await api.put(`/products/${productEditId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setProductForm({ name: '', category: 'PROTEIN', price: '', details: '', description: '', stock: '', image: null });
      setProductEditId('');
      setImagePreview('');
      setMessage('Product saved successfully');
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
    if (product.image) {
      setImagePreview(product.image);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      setBusy('product');
      await api.delete(`/products/${id}`);
      setMessage('Product deleted');
      await onRefresh();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    } finally {
      setBusy('');
    }
  };

  return {
    productForm,
    setProductForm,
    productEditId,
    setProductEditId,
    imagePreview,
    setImagePreview,
    handleImageChange,
    submitProduct,
    startEditProduct,
    deleteProduct,
  };
}
