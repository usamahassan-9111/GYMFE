import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useApiResource } from '../hooks/useApiResource';

export default function MemberPaymentPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    status: 'UNPAID',
    dueDate: '',
    paidAt: '',
    method: 'CASH',
    note: '',
  });
  const plans = useApiResource('/plans');
  const payments = useApiResource('/payments');
  const [memberPayments, setMemberPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    loadMember();
    loadMemberPayments();
  }, [memberId]);

  const loadMember = async () => {
    try {
      const response = await api.get(`/members/${memberId}`);
      setMember(response.data.data || response.data);
      setPaymentForm((prev) => ({
        ...prev,
        dueDate: member?.dueDate ? new Date(member.dueDate).toISOString().slice(0, 10) : '',
        amount: member?.planId?.price || '',
      }));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load member:', error);
      setLoading(false);
    }
  };

  const loadMemberPayments = async () => {
    try {
      const response = await api.get(`/payments?memberId=${memberId}`);
      setMemberPayments(response.data.data || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const handleAddPayment = async () => {
    try {
      setLoading(true);
      await api.post('/payments', {
        memberId,
        planId: member?.planId?._id || member?.planId,
        amount: Number(paymentForm.amount),
        status: paymentForm.status,
        dueDate: paymentForm.dueDate,
        paidAt: paymentForm.status === 'PAID' ? paymentForm.paidAt : null,
        method: paymentForm.method,
        note: paymentForm.note,
      });

      setPaymentForm({
        amount: '',
        status: 'UNPAID',
        dueDate: '',
        paidAt: '',
        method: 'CASH',
        note: '',
      });

      await loadMemberPayments();
      alert('Payment created successfully!');
    } catch (error) {
      alert('Failed to create payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (paymentId) => {
    navigate(`/admin/payment/${paymentId}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  if (!member) {
    return <div className="flex items-center justify-center min-h-screen text-white">Member not found</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/admin/dashboard" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
        ← Back to Dashboard
      </Link>

      {/* Member Info */}
      <div className="glass rounded-3xl p-8 sm:p-10 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Member Payment Management</p>
            <h1 className="mt-3 text-4xl font-black text-white">{member.name}</h1>
            <p className="mt-2 text-slate-300">{member.phone} | CNIC: {member.cnic}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plan</p>
            <p className="text-2xl font-bold text-sfBlue">{member.planId?.name || 'No Plan'}</p>
            <p className="text-xs text-slate-400 mt-1">Rs {member.planId?.price || 0}/-</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Add Payment Form */}
        <div className="glass rounded-3xl p-8 animate-scaleIn">
          <h3 className="text-2xl font-bold text-white mb-6">Add Fee Payment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Amount *</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Payment amount"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Status *</label>
              <select
                value={paymentForm.status}
                onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                className="form-select"
              >
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date</label>
              <input
                type="date"
                value={paymentForm.dueDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                className="form-input"
              />
            </div>

            {paymentForm.status === 'PAID' && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Paid On</label>
                <input
                  type="date"
                  value={paymentForm.paidAt}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidAt: e.target.value })}
                  className="form-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                className="form-select"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK">Bank Transfer</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Notes</label>
              <textarea
                value={paymentForm.note}
                onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                placeholder="Additional notes"
                className="form-input min-h-20 resize-none"
              />
            </div>

            <button
              onClick={handleAddPayment}
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Creating...' : '+ Add Payment'}
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="glass rounded-3xl p-8 animate-scaleIn">
          <h3 className="text-2xl font-bold text-white mb-6">Payment History</h3>

          {memberPayments.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No payments recorded yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {memberPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{payment.invoiceNo}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-sfRed">Rs {payment.amount}/-</p>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mt-1 ${
                          payment.status === 'PAID'
                            ? 'bg-green-500/20 text-green-200'
                            : 'bg-rose-500/20 text-rose-200'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {payment.method || 'N/A'} • {payment.planId?.name || 'Custom'}
                  </p>
                  <button
                    onClick={() => handleViewPayment(payment._id)}
                    className="mt-3 w-full px-4 py-2 bg-sfBlue/20 text-sfBlue hover:bg-sfBlue/30 rounded-lg text-sm font-semibold transition"
                  >
                    📥 View & Download Slip
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary w-full mt-6"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
