import { useState } from 'react';
import api from '../lib/api';

export default function ProductInquiryModal({ isOpen, product, onClose, onSubmit }) {
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    quantity: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.customerName || !form.customerPhone || !form.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/product-inquiries', {
        productId: product._id,
        productName: product.name,
        ...form,
      });
      alert('✅ Inquiry submitted! Admin will contact you on WhatsApp/Phone soon.');
      setForm({ customerName: '', customerPhone: '', quantity: '', description: '' });
      onClose();
      onSubmit?.();
    } catch (error) {
      alert('❌ Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Inquiry for {product.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-sfBlue/10 rounded-xl border border-sfBlue/20">
          <p className="text-sm text-slate-400">Price: <span className="text-sfRed font-bold">Rs {product.price}</span></p>
          <p className="text-sm text-slate-400">Stock: <span className="text-sfBlue font-bold">{product.stock} units</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name *</label>
            <input
              type="text"
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Enter your name"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="03xxxxxxxxx"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity Needed *</label>
            <input
              type="number"
              required
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="How much?"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Additional Notes</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Any special requests or notes..."
              className="form-input min-h-20 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-sfRed to-rose-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
