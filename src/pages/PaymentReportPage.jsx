import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useApiResource } from '../hooks/useApiResource';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import ApiTable from '../components/ApiTable';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function currentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

function getDateRangeFor(monthString) {
  const [year, month] = monthString.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start, end };
}

export default function PaymentReportPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [report, setReport] = useState({ 
    data: [], 
    total: 0, 
    paid: 0, 
    unpaid: 0, 
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    month: currentMonthValue() 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PAID, UNPAID

  const members = useApiResource('/members');
  const memberOptions = useMemo(() => members.data || [], [members.data]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/report?month=${month}&status=${statusFilter === 'ALL' ? '' : statusFilter}`);
      setReport(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load payment report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReport();
  }, [month, statusFilter]);

  const getMemberName = (memberId) => {
    if (!memberId) return '-';
    if (typeof memberId === 'object') return memberId.name || '-';
    const member = memberOptions.find(m => m._id === memberId);
    return member?.name || '-';
  };

  const getPlanName = (planId) => {
    if (!planId) return '-';
    if (typeof planId === 'object') return planId.name || '-';
    return '-';
  };

  const exportReport = () => {
    if (report.data.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = 'Payment Report\n';
    csvContent += `Month: ${month}\n`;
    csvContent += `Status Filter: ${statusFilter}\n\n`;
    csvContent += 'Member,Plan,Amount,Status,Due Date,Paid Date,Method\n';

    report.data.forEach((payment) => {
      const memberName = getMemberName(payment.memberId);
      const planName = getPlanName(payment.planId);
      const amount = payment.amount || 0;
      const status = payment.status || '-';
      const dueDate = formatDate(payment.dueDate);
      const paidDate = formatDate(payment.paidAt);
      const method = payment.method || '-';

      csvContent += `"${memberName}","${planName}",${amount},"${status}","${dueDate}","${paidDate}","${method}"\n`;
    });

    csvContent += `\n\nSummary\n`;
    csvContent += `Total Records,${report.total}\n`;
    csvContent += `Paid Records,${report.paid}\n`;
    csvContent += `Unpaid Records,${report.unpaid}\n`;
    csvContent += `Total Amount,${report.totalAmount}\n`;
    csvContent += `Paid Amount,${report.paidAmount}\n`;
    csvContent += `Unpaid Amount,${report.unpaidAmount}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `payment-report-${month}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const columns = [
    { key: 'memberId', label: 'Member', render: (row) => getMemberName(row.memberId) },
    { key: 'planId', label: 'Plan', render: (row) => getPlanName(row.planId) },
    { key: 'amount', label: 'Amount (Rs)', render: (row) => row.amount?.toFixed(2) || '0' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.status === 'PAID' 
            ? 'bg-green-900/30 text-green-400' 
            : 'bg-red-900/30 text-red-400'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
    { key: 'paidAt', label: 'Paid Date', render: (row) => formatDate(row.paidAt) },
    { key: 'method', label: 'Method', render: (row) => row.method || '-' },
  ];

  // Show loading state
  if (loading && report.data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sfBlue"></div>
          <p className="mt-4 text-slate-400">Loading payment report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link 
              to="/admin/dashboard" 
              className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Payment Report</h1>
            <p className="text-slate-400 mt-2">Track and analyze member payments by month</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Select Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select w-full"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid Only</option>
                <option value="UNPAID">Unpaid Only</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={exportReport}
                disabled={loading}
                className="flex-1 btn-secondary"
              >
                📥 Export CSV
              </button>
              <button
                onClick={loadReport}
                disabled={loading}
                className="flex-1 btn-secondary"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Records"
            value={report.total}
            icon="📊"
            trend=""
          />
          <StatCard
            title="Paid"
            value={report.paid}
            icon="✅"
            trend={`Rs ${report.paidAmount?.toFixed(2) || '0'}`}
          />
          <StatCard
            title="Unpaid"
            value={report.unpaid}
            icon="⏳"
            trend={`Rs ${report.unpaidAmount?.toFixed(2) || '0'}`}
          />
          <StatCard
            title="Total Amount"
            value={`Rs ${report.totalAmount?.toFixed(2) || '0'}`}
            icon="💰"
            trend=""
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 rounded-2xl p-4 ${
            message.includes('Failed') 
              ? 'bg-red-900/20 text-red-400 border border-red-900/50' 
              : 'bg-green-900/20 text-green-400 border border-green-900/50'
          }`}>
            {message}
          </div>
        )}

        {/* Table */}
        <div className="glass rounded-3xl overflow-hidden">
          <ApiTable 
            title="Payment Details"
            columns={columns}
            rows={report.data || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
