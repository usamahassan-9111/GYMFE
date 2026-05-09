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

function emptyAttendanceForm() {
  return { memberId: '', date: '', status: 'PRESENT' };
}

export default function AttendanceReportPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [report, setReport] = useState({ data: [], total: 0, present: 0, absent: 0, month: currentMonthValue() });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyAttendanceForm());

  const members = useApiResource('/members');
  const memberOptions = useMemo(() => members.data || [], [members.data]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/attendance/monthly?month=${month}`);
      setReport(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load attendance report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReport();
  }, [month]);

  const resetForm = () => {
    setEditingId('');
    setForm(emptyAttendanceForm());
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({
      memberId: row.memberId?._id || '',
      date: row.date ? String(row.date).slice(0, 10) : '',
      status: row.status || 'PRESENT',
    });
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      setMessage('');
      if (editingId) {
        await api.put(`/attendance/${editingId}`, form);
      } else {
        await api.post('/attendance/check-in', form);
      }
      resetForm();
      await loadReport();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Attendance save failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (row) => {
    const confirmed = window.confirm(`Delete attendance for ${row.memberId?.name || 'this member'}?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      setMessage('');
      await api.delete(`/attendance/${row._id}`);
      if (editingId === row._id) {
        resetForm();
      }
      await loadReport();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Attendance delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionCard
        id="attendance-report"
        title="Monthly Attendance Report"
        subtitle="Extract monthly attendance, edit a record, or delete an entry when needed."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Records" value={report.total || 0} accent="blue" />
          <StatCard label="Present" value={report.present || 0} accent="red" />
          <StatCard label="Absent" value={report.absent || 0} accent="blue" />
          <StatCard label="Selected Month" value={month} accent="red" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/admin/dashboard" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            Back to Dashboard
          </Link>
          <Link to="/admin/reports/members" className="rounded-full border border-sfBlue/40 bg-sfBlue/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sfBlue/20">
            Member Report
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="glass rounded-3xl p-6 sm:p-8 animate-scaleIn">
            <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Attendance' : 'Add Attendance'}</h3>
            <p className="mt-1 text-sm text-slate-400">Use this form to update monthly entries or mark a new check-in.</p>
            <div className="mt-6 grid gap-4">
              <select value={form.memberId} onChange={(event) => setForm({ ...form, memberId: event.target.value })} className="form-select">
                <option value="">Select Member</option>
                {memberOptions.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                type="date"
                className="form-input"
              />
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="form-select">
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveAttendance} disabled={loading} className="btn-primary">
                {editingId ? 'Update Attendance' : 'Save Attendance'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-2xl border border-white/15 px-5 py-3.5 text-base font-bold text-white transition hover:bg-white/10">
                  Cancel
                </button>
              )}
            </div>
            {message && <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p>}
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 animate-scaleIn">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Monthly Extract</h3>
                <p className="mt-1 text-sm text-slate-400">Pick a month to load the report.</p>
              </div>
              <input value={month} onChange={(event) => setMonth(event.target.value)} type="month" className="form-input w-full sm:w-56" />
            </div>

            <div className="mt-6">
              <ApiTable
                title={loading ? 'Loading...' : `Attendance for ${report.month || month}`}
                rows={report.data || []}
                columns={[
                  { key: 'memberId', label: 'Member', render: (row) => row.memberId?.name || '-' },
                  { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
                  { key: 'status', label: 'Status' },
                ]}
                onEdit={startEdit}
                onDelete={deleteAttendance}
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
