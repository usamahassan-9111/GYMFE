import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useApiResource } from '../hooks/useApiResource';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function PaymentDetailPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const plans = useApiResource('/plans');
  const members = useApiResource('/members');

  useEffect(() => {
    loadPayment();
  }, [paymentId]);

  const loadPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/${paymentId}/invoice`);
      setPayment(response.data);
    } catch (error) {
      console.error('Failed to load payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSlip = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/payments/${paymentId}/slip/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payment-slip-${payment.invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show WhatsApp share option
      shareViaWhatsApp();
    } catch (error) {
      alert('Failed to download slip: ' + (error.response?.data?.message || error.message));
    } finally {
      setDownloading(false);
    }
  };

  const shareViaWhatsApp = () => {
    const whatsappNumber = '03242952477';
    const text = `Hi, I have completed my payment. Invoice No: ${payment.invoiceNo}. Amount: Rs ${payment.amount}/-`;
    const url = `https://wa.me/${whatsappNumber.replace(/^0/, '92')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const markAsPaid = async () => {
    try {
      setLoading(true);
      await api.patch(`/payments/${paymentId}/mark-paid`);
      loadPayment();
      alert('Payment marked as paid');
    } catch (error) {
      alert('Failed to mark as paid: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  if (!payment) {
    return <div className="flex items-center justify-center min-h-screen text-white">Payment not found</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/admin/dashboard" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
        ← Back to Dashboard
      </Link>

      <div className="glass rounded-3xl p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Payment Invoice</p>
          <h1 className="mt-3 text-4xl font-black text-white">{payment.invoiceNo}</h1>
          <p className="mt-2 text-slate-300">Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Member Details */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Member Information</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-400">Name</dt>
                <dd className="font-semibold text-white">{payment.member?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-semibold text-white">{payment.member?.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">CNIC</dt>
                <dd className="font-semibold text-white">{payment.member?.cnic || '-'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Payment Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-400">Plan</dt>
                <dd className="font-semibold text-white">{payment.plan?.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Amount</dt>
                <dd className="text-xl font-bold text-sfRed">Rs {payment.amount}/-</dd>
              </div>
              <div>
                <dt className="text-slate-400">Status</dt>
                <dd>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    payment.status === 'PAID' 
                      ? 'bg-green-500/20 text-green-200' 
                      : 'bg-rose-500/20 text-rose-200'
                  }`}>
                    {payment.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Dates and Method */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Transaction Information</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-sm">
            <div>
              <dt className="text-slate-400">Due Date</dt>
              <dd className="font-semibold text-white">{formatDate(payment.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Paid On</dt>
              <dd className="font-semibold text-white">{payment.paidAt ? formatDate(payment.paidAt) : 'Pending'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Payment Method</dt>
              <dd className="font-semibold text-white">{payment.method || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Notes</dt>
              <dd className="font-semibold text-white">{payment.note || '-'}</dd>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {payment.status === 'UNPAID' && (
            <button
              onClick={markAsPaid}
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              ✓ Mark as Paid
            </button>
          )}
          
          <button
            onClick={downloadSlip}
            disabled={downloading}
            className="rounded-2xl bg-gradient-to-r from-sfBlue to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {downloading ? 'Downloading...' : '📥 Download Slip'}
          </button>

          <button
            onClick={shareViaWhatsApp}
            className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition"
          >
            💬 Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
