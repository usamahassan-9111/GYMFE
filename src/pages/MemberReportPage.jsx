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

function getCurrentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

export default function MemberReportPage() {
  const members = useApiResource('/members');
  const stats = useApiResource('/dashboard/stats', { cards: {} });
  const [search, setSearch] = useState('');
  const [memberPaymentStatus, setMemberPaymentStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch payment status for all members
  useEffect(() => {
    const loadPaymentStatus = async () => {
      try {
        setLoading(true);
        const currentMonth = getCurrentMonthValue();
        
        // Get all payments
        const response = await api.get('/payments');
        const payments = response.data.data || [];
        
        // Build payment status map
        const statusMap = {};
        members.data?.forEach(member => {
          const memberPayments = payments.filter(p => {
            const paymentMonth = new Date(p.createdAt).toISOString().slice(0, 7);
            return p.memberId?._id === member._id && paymentMonth === currentMonth;
          });
          
          const paidPayment = memberPayments.find(p => p.status === 'PAID');
          statusMap[member._id] = paidPayment ? 'PAID' : 'UNPAID';
        });
        
        setMemberPaymentStatus(statusMap);
      } catch (error) {
        console.error('Failed to load payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (members.data?.length > 0) {
      loadPaymentStatus();
    }
  }, [members.data]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members.data || [];
    return (members.data || []).filter((member) => {
      const text = [
        member.name,
        member.phone,
        member.cnic,
        member.gender,
        member.planId?.name,
        member.trainerId?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return text.includes(query);
    });
  }, [members.data, search]);

  const paidCount = members.data?.filter(m => memberPaymentStatus[m._id] === 'PAID').length || 0;
  const unpaidCount = members.data?.filter(m => memberPaymentStatus[m._id] === 'UNPAID').length || 0;

  // Show loading state
  if (loading && members.data?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sfBlue"></div>
          <p className="mt-4 text-slate-400">Loading member report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/dashboard" className="mb-6 inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Member Report</h1>
          <p className="text-slate-400 mt-2">View all members with current month fee status</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Members" value={members.data?.length ?? 0} icon="👥" trend="" />
          <StatCard label="Fee Paid (This Month)" value={paidCount} icon="✅" trend={`${Math.round((paidCount / (members.data?.length || 1)) * 100)}%`} />
          <StatCard label="Fee Pending" value={unpaidCount} icon="⏳" trend={`${Math.round((unpaidCount / (members.data?.length || 1)) * 100)}%`} />
          <StatCard label="Active Members" value={stats.data?.cards?.activeMembers ?? 0} icon="🏋️" trend="" />
        </div>

        {/* Search Bar */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Search Members</h3>
              <p className="mt-1 text-sm text-slate-400">Filter by name, phone, CNIC, plan, or trainer</p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search member..."
              className="form-input w-full md:max-w-sm"
            />
          </div>
        </div>

        {/* Members Grid with Fee Status */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-8">
          {filteredMembers.map((member) => {
            const feeStatus = memberPaymentStatus[member._id] || 'UNPAID';
            const isPaid = feeStatus === 'PAID';
            
            return (
              <div
                key={member._id}
                className="glass rounded-3xl p-6 hover:scale-105 transition-transform animate-scaleIn border border-white/10"
              >
                {/* Header with Name and Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white">{member.name}</h4>
                    <p className="text-sm text-slate-400">{member.phone}</p>
                  </div>
                  <div className={`px-3 py-2 rounded-full text-center ${
                    isPaid 
                      ? 'bg-green-900/30 border border-green-500/50' 
                      : 'bg-red-900/30 border border-red-500/50'
                  }`}>
                    <div className="text-2xl">{isPaid ? '✅' : '❌'}</div>
                    <p className={`text-xs font-semibold mt-1 ${isPaid ? 'text-green-400' : 'text-red-400'}`}>
                      {isPaid ? 'PAID' : 'PENDING'}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <dl className="space-y-2 text-sm text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">CNIC:</dt>
                    <dd className="font-medium text-white">{member.cnic}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Age:</dt>
                    <dd className="font-medium text-white">{member.age}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Joining:</dt>
                    <dd className="font-medium text-white">{formatDate(member.joiningDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Due Date:</dt>
                    <dd className="font-medium text-white">{formatDate(member.dueDate)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Plan:</dt>
                    <dd className="font-medium text-sfBlue">{member.planId?.name || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Trainer:</dt>
                    <dd className="font-medium text-white">{member.trainerId?.name || '-'}</dd>
                  </div>
                </dl>

                {member.notes && (
                  <div className="rounded-2xl bg-white/5 p-3 border border-white/10 text-xs text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">Notes:</p>
                    <p>{member.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fallback Message */}
        {filteredMembers.length === 0 && (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-slate-400">No members found matching your search</p>
          </div>
        )}

        {/* Table View */}
        <div className="glass rounded-3xl overflow-hidden">
          <ApiTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'cnic', label: 'CNIC' },
              { key: 'planId', label: 'Plan', render: (row) => row.planId?.name || '-' },
              { key: 'trainerId', label: 'Trainer', render: (row) => row.trainerId?.name || '-' },
              { 
                key: 'feeStatus', 
                label: 'This Month Fee', 
                render: (row) => {
                  const status = memberPaymentStatus[row._id] || 'UNPAID';
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'PAID'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {status === 'PAID' ? '✅ Paid' : '❌ Pending'}
                    </span>
                  );
                }
              },
            ]}
            rows={filteredMembers}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
