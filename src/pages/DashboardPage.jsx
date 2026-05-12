import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useApiResource } from '../hooks/useApiResource';
import MarqueeBar from '../components/MarqueeBar';
import Hero from '../components/Hero';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import ApiTable from '../components/ApiTable';
import ProductManagementSection from '../components/ProductManagementSection';

// Icon components
const IconUser = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 13H9m6 0h.01M9 13h.01M16 17c0 1.1-1.8 2-4 2s-4-.9-4-2" />
  </svg>
);

const IconDumbbell = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 5h2v14H6V5zm10 0h2v14h-2V5zM3 7h2v10H3V7zm16 0h2v10h-2V7z" />
  </svg>
);

const IconTrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconTarget = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconApple = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCreditCard = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconBell = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0018 14.2V11a6 6 0 00-12 0v3.2a2 2 0 00-.6 1.4L4 17h5m5 4v1a3 3 0 11-6 0v-1m6-1v-1a3 3 0 00-6 0v1" />
  </svg>
);

const IconShoppingCart = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-6 9a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function emptyMemberForm() {
  return {
    name: '',
    phone: '',
    cnic: '',
    age: '',
    gender: 'male',
    joiningDate: '',
    dueDate: '',
    notes: '',
    active: true,
    planId: '',
    trainerId: '',
    workoutPlanId: '',
    dietPlanId: '',
  };
}

function emptyPaymentForm() {
  return {
    memberId: '',
    planId: '',
    amount: '',
    status: 'UNPAID',
    dueDate: '',
    paidAt: '',
    method: '',
    note: '',
  };
}

function emptyAttendanceForm() {
  return { memberId: '', date: '', status: 'PRESENT' };
}

function emptyResourceForm(fields) {
  return fields.reduce((acc, field) => {
    acc[field] = '';
    return acc;
  }, {});
}

export default function DashboardPage({ token }) {
  const navigate = useNavigate();
  const stats = useApiResource('/dashboard/stats', { cards: {} });
  const members = useApiResource('/members');
  const plans = useApiResource('/plans');
  const trainers = useApiResource('/trainers');
  const workoutPlans = useApiResource('/workout-plans');
  const dietPlans = useApiResource('/diet-plans');
  const products = useApiResource('/products');
  const payments = useApiResource('/payments');
  const attendance = useApiResource('/attendance/daily');
  const notifications = useApiResource('/notifications');
  const alerts = useApiResource('/notifications/alerts', { membershipExpiringSoon: [], paymentDueReminders: [] });
  const inquiries = useApiResource('/product-inquiries');
  const inquiryCount = useApiResource('/product-inquiries/new/count', { count: 0 });

  const [memberForm, setMemberForm] = useState(emptyMemberForm());
  const [planForm, setPlanForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [trainerForm, setTrainerForm] = useState({ name: '', phone: '', specialization: '', salary: '' });
  const [workoutForm, setWorkoutForm] = useState({ title: '', category: '', description: '' });
  const [dietForm, setDietForm] = useState({ title: '', goal: '', description: '' });
  const [productForm, setProductForm] = useState({ name: '', category: 'PROTEIN', price: '', details: '', description: '', image: '', stock: '' });
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm());
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendanceForm());
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', type: '' });
  const [inquiryStatusForm, setInquiryStatusForm] = useState({ status: 'CONTACTED', notes: '' });
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [memberEditId, setMemberEditId] = useState('');
  const [planEditId, setPlanEditId] = useState('');
  const [trainerEditId, setTrainerEditId] = useState('');
  const [workoutEditId, setWorkoutEditId] = useState('');
  const [dietEditId, setDietEditId] = useState('');
  const [productEditId, setProductEditId] = useState('');
  const [paymentEditId, setPaymentEditId] = useState('');
  const [notificationEditId, setNotificationEditId] = useState('');
  const [attendanceEditId, setAttendanceEditId] = useState('');
  const [inquiryEditId, setInquiryEditId] = useState('');

  const memberOptions = useMemo(() => members.data || [], [members.data]);

  const submit = async (path, payload, refreshList, resetForm, loadingKey, method = 'post') => {
    try {
      setBusy(loadingKey);
      setMessage('');
      await api.request({ method, url: path, data: payload });
      resetForm();
      await Promise.all(refreshList.map((fn) => fn()));
      setMessage('Saved successfully');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Request failed');
    } finally {
      setBusy('');
    }
  };

  const submitCrud = async (path, payload, refreshList, resetForm, loadingKey) => {
    await submit(path, payload, refreshList, resetForm, loadingKey);
  };

  const startMemberEdit = (member) => {
    setMemberEditId(member._id);
    setMemberForm({
      name: member.name || '',
      phone: member.phone || '',
      cnic: member.cnic || '',
      age: member.age ? String(member.age) : '',
      gender: member.gender || 'male',
      joiningDate: member.joiningDate ? String(member.joiningDate).slice(0, 10) : '',
      dueDate: member.dueDate ? String(member.dueDate).slice(0, 10) : '',
      notes: member.notes || '',
      active: member.active ?? true,
      planId: member.planId?._id || member.planId || '',
      trainerId: member.trainerId?._id || member.trainerId || '',
      workoutPlanId: member.workoutPlanId?._id || member.workoutPlanId || '',
      dietPlanId: member.dietPlanId?._id || member.dietPlanId || '',
    });
  };

  const startPlanEdit = (plan) => {
    setPlanEditId(plan._id);
    setPlanForm({
      name: plan.name || '',
      price: plan.price ? String(plan.price) : '',
      duration: plan.duration ? String(plan.duration) : '',
      description: plan.description || '',
    });
  };

  const startTrainerEdit = (trainer) => {
    setTrainerEditId(trainer._id);
    setTrainerForm({
      name: trainer.name || '',
      phone: trainer.phone || '',
      specialization: trainer.specialization || '',
      salary: trainer.salary ? String(trainer.salary) : '',
    });
  };

  const startWorkoutEdit = (plan) => {
    setWorkoutEditId(plan._id);
    setWorkoutForm({
      title: plan.title || '',
      category: plan.category || '',
      description: plan.description || '',
    });
  };

  const startDietEdit = (plan) => {
    setDietEditId(plan._id);
    setDietForm({
      title: plan.title || '',
      goal: plan.goal || '',
      description: plan.description || '',
    });
  };

  const startPaymentEdit = (payment) => {
    setPaymentEditId(payment._id);
    setPaymentForm({
      memberId: payment.memberId?._id || payment.memberId || '',
      planId: payment.planId?._id || payment.planId || '',
      amount: payment.amount ? String(payment.amount) : '',
      status: payment.status || 'UNPAID',
      dueDate: payment.dueDate ? String(payment.dueDate).slice(0, 10) : '',
      paidAt: payment.paidAt ? String(payment.paidAt).slice(0, 10) : '',
      method: payment.method || '',
      note: payment.note || '',
    });
  };

  const startNotificationEdit = (notification) => {
    setNotificationEditId(notification._id);
    setNotificationForm({
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || '',
    });
  };

  const startAttendanceEdit = (attendanceRow) => {
    setAttendanceEditId(attendanceRow._id);
    setAttendanceForm({
      memberId: attendanceRow.memberId?._id || attendanceRow.memberId || '',
      date: attendanceRow.date ? String(attendanceRow.date).slice(0, 10) : '',
      status: attendanceRow.status || 'PRESENT',
    });
  };

  const clearEditStates = () => {
    setMemberEditId('');
    setPlanEditId('');
    setTrainerEditId('');
    setWorkoutEditId('');
    setDietEditId('');
    setProductEditId('');
    setPaymentEditId('');
    setNotificationEditId('');
    setAttendanceEditId('');
    setInquiryEditId('');
  };

  const removeRecord = async (path, refreshList, loadingKey) => {
    try {
      setBusy(loadingKey);
      setMessage('');
      await api.delete(path);
      await Promise.all(refreshList.map((fn) => fn()));
      setMessage('Deleted successfully');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    } finally {
      setBusy('');
    }
  };

  return (
    <div>
      <Hero onExplore={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })} />
      <MarqueeBar />

      <SectionCard 
        id="dashboard"
        title="Dashboard Overview"
        subtitle="Live cards and charts from backend APIs. Everything is optimized for mobile screens and smooth admin use."
        icon={IconTrendingUp}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Members" value={stats.data?.cards?.totalMembers ?? 0} accent="blue" />
          <StatCard label="Active Members" value={stats.data?.cards?.activeMembers ?? 0} accent="red" />
          <StatCard label="Fees Due" value={stats.data?.cards?.feesDue ?? 0} accent="blue" />
          <StatCard label="Today Attendance" value={stats.data?.cards?.todayAttendance ?? 0} accent="red" />
          <StatCard label="Trainers Count" value={stats.data?.cards?.trainersCount ?? 0} accent="blue" />
        </div>
      </SectionCard>

      <SectionCard 
        id="members" 
        title="Member Management" 
        subtitle="Add, edit, delete, search, and view all members with full plan and trainer assignment."
        icon={IconUser}
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Member</h4>
            <p className="text-slate-400 mb-6 text-sm">Fill in member details below</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['name', 'Name'],
                ['phone', 'Phone'],
                ['cnic', 'CNIC'],
                ['age', 'Age'],
                ['joiningDate', 'Joining Date'],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  value={memberForm[key]}
                  onChange={(event) => setMemberForm({ ...memberForm, [key]: event.target.value })}
                  placeholder={placeholder}
                  type={key.includes('Date') ? 'date' : key === 'age' ? 'number' : 'text'}
                  className="form-input"
                />
              ))}
              <select value={memberForm.gender} onChange={(event) => setMemberForm({ ...memberForm, gender: event.target.value })} className="form-select">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select value={memberForm.planId} onChange={(event) => setMemberForm({ ...memberForm, planId: event.target.value })} className="form-select">
                <option value="">Select Plan</option>
                {plans.data?.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
              </select>
              <select value={memberForm.trainerId} onChange={(event) => setMemberForm({ ...memberForm, trainerId: event.target.value })} className="form-select">
                <option value="">Select Trainer</option>
                {trainers.data?.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                ))}
              </select>
              <select value={memberForm.workoutPlanId} onChange={(event) => setMemberForm({ ...memberForm, workoutPlanId: event.target.value })} className="form-select">
                <option value="">Select Workout Plan</option>
                {workoutPlans.data?.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.title}</option>
                ))}
              </select>
              <select value={memberForm.dietPlanId} onChange={(event) => setMemberForm({ ...memberForm, dietPlanId: event.target.value })} className="form-select">
                <option value="">Select Diet Plan</option>
                {dietPlans.data?.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.title}</option>
                ))}
              </select>
              <textarea value={memberForm.notes} onChange={(event) => setMemberForm({ ...memberForm, notes: event.target.value })} placeholder="Notes" className="form-input min-h-28 sm:col-span-2 resize-none" />
            </div>
            <button
              onClick={() => {
                // Calculate due date from joining date and plan duration
                let calculatedDueDate = memberForm.dueDate;
                if (memberForm.joiningDate && memberForm.planId) {
                  const selectedPlan = (plans.data || []).find(p => p._id === memberForm.planId);
                  if (selectedPlan?.duration) {
                    const joiningDate = new Date(memberForm.joiningDate);
                    const dueDate = new Date(joiningDate);
                    dueDate.setMonth(dueDate.getMonth() + Number(selectedPlan.duration));
                    // Format as YYYY-MM-DD for API
                    calculatedDueDate = dueDate.toISOString().split('T')[0];
                  }
                }
                
                submit(
                  memberEditId ? `/members/${memberEditId}` : '/members',
                  { 
                    ...memberForm, 
                    age: Number(memberForm.age),
                    dueDate: calculatedDueDate || null
                  },
                  [members.refresh, stats.refresh],
                  () => {
                    setMemberForm(emptyMemberForm());
                    setMemberEditId('');
                  },
                  'member',
                  memberEditId ? 'put' : 'post'
                );
              }}
              disabled={busy === 'member'}
              className="btn-secondary mt-6 w-full"
            >
              {busy === 'member' ? (memberEditId ? 'Updating...' : 'Saving...') : memberEditId ? 'Update Member' : 'Save Member'}
            </button>
          </div>

          <ApiTable
            title="All Members"
            rows={members.data || []}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'cnic', label: 'CNIC' },
              { key: 'gender', label: 'Gender' },
              { key: 'joiningDate', label: 'Joining', render: (row) => formatDate(row.joiningDate) },
              { key: 'planId', label: 'Plan', render: (row) => row.planId?.name || '-' },
              { key: 'trainerId', label: 'Trainer', render: (row) => row.trainerId?.name || '-' },
            ]}
            customActions={[
              {
                id: 'fee',
                label: '💳 Fee',
                className: 'border-sfRed/40 bg-sfRed/10 text-rose-200 hover:bg-sfRed/25',
                onClick: (row) => navigate(`/admin/payment-member/${row._id}`),
              },
            ]}
            onEdit={startMemberEdit}
            onDelete={(row) => removeRecord(`/members/${row._id}`, [members.refresh, stats.refresh], 'member')}
          />
        </div>
      </SectionCard>

      <SectionCard 
        id="plans" 
        title="Plans & Membership Fees" 
        subtitle="Manage plan names, prices, and durations. The frontend pulls the backend plan API directly."
        icon={IconDumbbell}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Plan</h4>
            <p className="text-slate-400 mb-6 text-sm">Create new membership plans</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="Plan name" className="form-input" />
              <input value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} placeholder="Price" type="number" className="form-input" />
              <input value={planForm.duration} onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })} placeholder="Duration in months" type="number" className="form-input" />
              <input value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} placeholder="Description" className="form-input" />
            </div>
            <button onClick={() => submit(
              planEditId ? `/plans/${planEditId}` : '/plans',
              { ...planForm, price: Number(planForm.price), duration: Number(planForm.duration) },
              [plans.refresh],
              () => {
                setPlanForm({ name: '', price: '', duration: '', description: '' });
                setPlanEditId('');
              },
              'plan',
              planEditId ? 'put' : 'post'
            )} disabled={busy === 'plan'} className="btn-primary mt-6 w-full">
              {busy === 'plan' ? (planEditId ? 'Updating...' : 'Saving...') : planEditId ? 'Update Plan' : 'Save Plan'}
            </button>
          </div>

          <ApiTable
            title="Plans"
            rows={plans.data || []}
            columns={[
              { key: 'name', label: 'Plan' },
              { key: 'price', label: 'Price' },
              { key: 'duration', label: 'Duration' },
              { key: 'description', label: 'Description' },
            ]}
            onEdit={startPlanEdit}
            onDelete={(row) => removeRecord(`/plans/${row._id}`, [plans.refresh], 'plan')}
          />
        </div>
      </SectionCard>

      <SectionCard 
        id="trainers" 
        title="Trainers Management" 
        subtitle="Add trainers, assign members, and store salary records."
        icon={IconUser}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Trainer</h4>
            <p className="text-slate-400 mb-6 text-sm">Hire new trainers for the gym</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={trainerForm.name} onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })} placeholder="Trainer name" className="form-input" />
              <input value={trainerForm.phone} onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })} placeholder="Phone" className="form-input" />
              <input value={trainerForm.specialization} onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })} placeholder="Specialization" className="form-input" />
              <input value={trainerForm.salary} onChange={(e) => setTrainerForm({ ...trainerForm, salary: e.target.value })} placeholder="Salary" type="number" className="form-input" />
            </div>
            <button onClick={() => submit(
              trainerEditId ? `/trainers/${trainerEditId}` : '/trainers',
              { ...trainerForm, salary: Number(trainerForm.salary) },
              [trainers.refresh, members.refresh],
              () => {
                setTrainerForm({ name: '', phone: '', specialization: '', salary: '' });
                setTrainerEditId('');
              },
              'trainer',
              trainerEditId ? 'put' : 'post'
            )} disabled={busy === 'trainer'} className="btn-secondary mt-6 w-full">
              {busy === 'trainer' ? (trainerEditId ? 'Updating...' : 'Saving...') : trainerEditId ? 'Update Trainer' : 'Save Trainer'}
            </button>
          </div>

          <ApiTable
            title="Trainers"
            rows={trainers.data || []}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'specialization', label: 'Specialization' },
              { key: 'salary', label: 'Salary' },
              { key: 'members', label: 'Members', render: (row) => row.members?.length || 0 },
            ]}
            onEdit={startTrainerEdit}
            onDelete={(row) => removeRecord(`/trainers/${row._id}`, [trainers.refresh, members.refresh], 'trainer')}
          />
        </div>
      </SectionCard>

      <SectionCard 
        id="workout" 
        title="Workout Plans" 
        subtitle="Chest day, cardio, weight loss, muscle gain, and custom training templates."
        icon={IconTarget}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Workout Plan</h4>
            <p className="text-slate-400 mb-6 text-sm">Create workout training programs</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={workoutForm.title} onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })} placeholder="Title" className="form-input" />
              <input value={workoutForm.category} onChange={(e) => setWorkoutForm({ ...workoutForm, category: e.target.value })} placeholder="Category" className="form-input" />
              <textarea value={workoutForm.description} onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })} placeholder="Description" className="form-input min-h-28 sm:col-span-2 resize-none" />
            </div>
            <button onClick={() => submit(
              workoutEditId ? `/workout-plans/${workoutEditId}` : '/workout-plans',
              workoutForm,
              [workoutPlans.refresh],
              () => {
                setWorkoutForm({ title: '', category: '', description: '' });
                setWorkoutEditId('');
              },
              'workout',
              workoutEditId ? 'put' : 'post'
            )} disabled={busy === 'workout'} className="btn-primary mt-6 w-full">
              {busy === 'workout' ? (workoutEditId ? 'Updating...' : 'Saving...') : workoutEditId ? 'Update Workout Plan' : 'Save Workout Plan'}
            </button>
          </div>

          <ApiTable title="Workout Plans" rows={workoutPlans.data || []} columns={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' }]} onEdit={startWorkoutEdit} onDelete={(row) => removeRecord(`/workout-plans/${row._id}`, [workoutPlans.refresh], 'workout')} />
        </div>
      </SectionCard>

      <SectionCard 
        id="diet" 
        title="Diet Plans" 
        subtitle="Bulk diet, fat loss diet, protein suggestions, and member-specific nutrition plans."
        icon={IconApple}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Diet Plan</h4>
            <p className="text-slate-400 mb-6 text-sm">Create nutrition programs</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={dietForm.title} onChange={(e) => setDietForm({ ...dietForm, title: e.target.value })} placeholder="Title" className="form-input" />
              <input value={dietForm.goal} onChange={(e) => setDietForm({ ...dietForm, goal: e.target.value })} placeholder="Goal" className="form-input" />
              <textarea value={dietForm.description} onChange={(e) => setDietForm({ ...dietForm, description: e.target.value })} placeholder="Description" className="form-input min-h-28 sm:col-span-2 resize-none" />
            </div>
            <button onClick={() => submit(
              dietEditId ? `/diet-plans/${dietEditId}` : '/diet-plans',
              dietForm,
              [dietPlans.refresh],
              () => {
                setDietForm({ title: '', goal: '', description: '' });
                setDietEditId('');
              },
              'diet',
              dietEditId ? 'put' : 'post'
            )} disabled={busy === 'diet'} className="btn-secondary mt-6 w-full">
              {busy === 'diet' ? (dietEditId ? 'Updating...' : 'Saving...') : dietEditId ? 'Update Diet Plan' : 'Save Diet Plan'}
            </button>
          </div>

          <ApiTable title="Diet Plans" rows={dietPlans.data || []} columns={[{ key: 'title', label: 'Title' }, { key: 'goal', label: 'Goal' }, { key: 'description', label: 'Description' }]} onEdit={startDietEdit} onDelete={(row) => removeRecord(`/diet-plans/${row._id}`, [dietPlans.refresh], 'diet')} />
        </div>
      </SectionCard>

      <SectionCard 
        id="payments" 
        title="Fee / Payment Management" 
        subtitle="Track paid, unpaid, due dates, payment history, and invoice receipts."
        icon={IconCreditCard}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Payment</h4>
            <p className="text-slate-400 mb-6 text-sm">Record member payments</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select value={paymentForm.memberId} onChange={(e) => setPaymentForm({ ...paymentForm, memberId: e.target.value })} className="form-select">
                <option value="">Select Member</option>
                {memberOptions.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <select value={paymentForm.planId} onChange={(e) => setPaymentForm({ ...paymentForm, planId: e.target.value })} className="form-select">
                <option value="">Select Plan</option>
                {plans.data?.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
              </select>
              <input value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="Amount" type="number" className="form-input" />
              <select value={paymentForm.status} onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })} className="form-select">
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
              </select>
              <input value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} type="date" placeholder="Due Date (DD/MM/YYYY)" className="form-input" />
              <input value={paymentForm.paidAt} onChange={(e) => setPaymentForm({ ...paymentForm, paidAt: e.target.value })} type="date" placeholder="Paid At (DD/MM/YYYY)" className="form-input" />
              <input value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} placeholder="Method (Cash/Card/Bank)" className="form-input" />
              <input value={paymentForm.note} onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })} placeholder="Note" className="form-input" />
            </div>
            <button onClick={() => submit(
              paymentEditId ? `/payments/${paymentEditId}` : '/payments',
              { ...paymentForm, amount: Number(paymentForm.amount) },
              [payments.refresh, alerts.refresh],
              () => {
                setPaymentForm(emptyPaymentForm());
                setPaymentEditId('');
              },
              'payment',
              paymentEditId ? 'put' : 'post'
            )} disabled={busy === 'payment'} className="btn-primary mt-6 w-full">
              {busy === 'payment' ? (paymentEditId ? 'Updating...' : 'Saving...') : paymentEditId ? 'Update Payment' : 'Save Payment'}
            </button>
          </div>

          <ApiTable
            title="Payment History"
            rows={payments.data || []}
            columns={[
              { key: 'memberId', label: 'Member', render: (row) => row.memberId?.name || '-' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
              { key: 'dueDate', label: 'Due', render: (row) => formatDate(row.dueDate) },
              { key: 'invoiceNo', label: 'Invoice' },
            ]}
            onEdit={startPaymentEdit}
            onDelete={(row) => removeRecord(`/payments/${row._id}`, [payments.refresh, alerts.refresh], 'payment')}
          />
        </div>
      </SectionCard>

      <SectionCard 
        id="attendance" 
        title="Attendance System" 
        subtitle="Daily check-in plus monthly attendance reporting for members."
        icon={IconCalendar}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Check In Member</h4>
            <p className="text-slate-400 mb-6 text-sm">Daily attendance tracking</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select value={attendanceForm.memberId} onChange={(e) => setAttendanceForm({ ...attendanceForm, memberId: e.target.value })} className="form-select">
                <option value="">Select Member</option>
                {memberOptions.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <input value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} type="date" placeholder="Date (DD/MM/YYYY)" className="form-input" />
              <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })} className="form-select sm:col-span-2">
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
            <button onClick={() => submit(
              attendanceEditId ? `/attendance/${attendanceEditId}` : '/attendance/check-in',
              attendanceForm,
              [attendance.refresh, stats.refresh],
              () => {
                setAttendanceForm(emptyAttendanceForm());
                setAttendanceEditId('');
              },
              'attendance',
              attendanceEditId ? 'put' : 'post'
            )} disabled={busy === 'attendance'} className="btn-secondary mt-6 w-full">
              {busy === 'attendance' ? (attendanceEditId ? 'Updating...' : 'Saving...') : attendanceEditId ? 'Update Attendance' : 'Save Attendance'}
            </button>
          </div>

          <ApiTable title="Today Attendance" rows={attendance.data || []} columns={[{ key: 'memberId', label: 'Member', render: (row) => row.memberId?.name || '-' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date', render: (row) => formatDate(row.date) }]} onEdit={startAttendanceEdit} onDelete={(row) => removeRecord(`/attendance/${row._id}`, [attendance.refresh, stats.refresh], 'attendance')} />
        </div>
      </SectionCard>

      <SectionCard 
        id="reports" 
        title="Reports & Analytics" 
        subtitle="View member details, attendance tracking, and payment analysis."
        icon={IconTrendingUp}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/admin/reports/members')}
            className="glass rounded-3xl p-8 hover:bg-white/10 transition text-center animate-scaleIn"
          >
            <IconUser className="w-12 h-12 mx-auto text-sfBlue mb-3" />
            <h4 className="text-xl font-bold text-white mb-2">Member Report</h4>
            <p className="text-slate-400 text-sm mb-4">All members with current month fee status</p>
            <span className="inline-block px-4 py-2 bg-sfBlue/20 text-sfBlue rounded-full text-xs font-semibold">View Report →</span>
          </button>

          <button
            onClick={() => navigate('/admin/reports/attendance')}
            className="glass rounded-3xl p-8 hover:bg-white/10 transition text-center animate-scaleIn"
          >
            <IconCalendar className="w-12 h-12 mx-auto text-sfBlue mb-3" />
            <h4 className="text-xl font-bold text-white mb-2">Attendance Report</h4>
            <p className="text-slate-400 text-sm mb-4">Monthly attendance tracking and analytics</p>
            <span className="inline-block px-4 py-2 bg-sfBlue/20 text-sfBlue rounded-full text-xs font-semibold">View Report →</span>
          </button>

          <button
            onClick={() => navigate('/admin/reports/payments')}
            className="glass rounded-3xl p-8 hover:bg-white/10 transition text-center animate-scaleIn"
          >
            <IconCreditCard className="w-12 h-12 mx-auto text-sfBlue mb-3" />
            <h4 className="text-xl font-bold text-white mb-2">Payment Report</h4>
            <p className="text-slate-400 text-sm mb-4">Track paid/unpaid fees and export data</p>
            <span className="inline-block px-4 py-2 bg-sfBlue/20 text-sfBlue rounded-full text-xs font-semibold">View Report →</span>
          </button>
        </div>
      </SectionCard>

      <SectionCard 
        id="notifications"
        title="Notifications" 
        subtitle="Membership expiring soon and payment due reminders are already generated from the backend."
        icon={IconBell}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Send Notification</h4>
            <p className="text-slate-400 mb-6 text-sm">Send alerts to members</p>
            <div className="mt-4 grid gap-4">
              <input value={notificationForm.title} onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} placeholder="Notification Title" className="form-input" />
              <textarea value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} placeholder="Message" className="form-input min-h-32 resize-none" />
              <input value={notificationForm.type} onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })} placeholder="Type (e.g., alert, reminder)" className="form-input" />
            </div>
            <button onClick={() => submit(
              notificationEditId ? `/notifications/${notificationEditId}` : '/notifications',
              notificationForm,
              [notifications.refresh],
              () => {
                setNotificationForm({ title: '', message: '', type: '' });
                setNotificationEditId('');
              },
              'notification',
              notificationEditId ? 'put' : 'post'
            )} disabled={busy === 'notification'} className="btn-primary mt-6 w-full">
              {busy === 'notification' ? (notificationEditId ? 'Updating...' : 'Sending...') : notificationEditId ? 'Update Notification' : 'Send Notification'}
            </button>
          </div>

          <div className="space-y-4">
            <ApiTable title="Saved Notifications" rows={notifications.data || []} columns={[{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'read', label: 'Read', render: (row) => (row.read ? 'Yes' : 'No') }]} onEdit={startNotificationEdit} onDelete={(row) => removeRecord(`/notifications/${row._id}`, [notifications.refresh], 'notification')} />
            <ApiTable title="Auto Alerts" rows={[...(alerts.data?.membershipExpiringSoon || []), ...(alerts.data?.paymentDueReminders || [])]} columns={[{ key: 'title', label: 'Title' }, { key: 'message', label: 'Message' }]} />
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        id="products"
        title="Supplements & Products"
        subtitle="Manage protein powders, vitamins, and fitness supplements for sale"
        icon={IconApple}
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div className="glass rounded-3xl p-8 animate-scaleIn">
            <h4 className="text-2xl font-bold text-white mb-2">Add Product</h4>
            <p className="text-slate-400 mb-6 text-sm">Create new supplements or fitness products</p>
            <div className="mt-4 grid gap-4">
              <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product Name" className="form-input" />
              <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="form-select">
                <option value="PROTEIN">Protein Powder</option>
                <option value="SUPPLEMENT">Supplement</option>
                <option value="VITAMIN">Vitamin</option>
                <option value="OTHER">Other</option>
              </select>
              <input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price (Rs)" type="number" className="form-input" />
              <input value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock Quantity" type="number" className="form-input" />
              <input value={productForm.details} onChange={(e) => setProductForm({ ...productForm, details: e.target.value })} placeholder="Details (e.g., 1kg, 100 capsules)" className="form-input" />
              <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" className="form-input min-h-20 resize-none" />
              <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="Image URL (Cloudinary)" className="form-input text-xs" />
              <button
                onClick={() => submit(
                  productEditId ? `/products/${productEditId}` : '/products',
                  productForm,
                  [products.refresh],
                  () => {
                    setProductForm({ name: '', category: 'PROTEIN', price: '', details: '', description: '', image: '', stock: '' });
                    setProductEditId('');
                  },
                  'product',
                  productEditId ? 'put' : 'post'
                )} disabled={busy === 'product'} className="btn-primary mt-6 w-full">
                {busy === 'product' ? (productEditId ? 'Updating...' : 'Adding...') : productEditId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <ApiTable 
              title="Products Inventory" 
              rows={products.data || []} 
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
                { key: 'price', label: 'Price (Rs)' },
                { key: 'stock', label: 'Stock' },
              ]} 
              onEdit={(row) => {
                setProductEditId(row._id);
                setProductForm(row);
              }}
              onDelete={(row) => removeRecord(`/products/${row._id}`, [products.refresh], 'product')}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard 
        id="inquiries"
        title={`Customer Product Inquiries ${inquiryCount.data?.count > 0 ? `(${inquiryCount.data.count} new)` : ''}`}
        subtitle="Manage customer purchase inquiries and quotes"
        icon={IconShoppingCart}
      >
        <div className="space-y-4">
          {inquiryCount.data?.count > 0 && (
            <div className="rounded-2xl border border-sfRed/30 bg-sfRed/10 px-4 py-3">
              <p className="text-sm font-semibold text-sfRed">🔴 {inquiryCount.data.count} new inquiry(ies) awaiting response</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-semibold text-white">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Qty</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.data && inquiries.data.length > 0 ? (
                  inquiries.data.map((inquiry) => (
                    <tr key={inquiry._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-white font-medium">{inquiry.customerName}</td>
                      <td className="px-4 py-3 text-slate-300">
                        <a href={`tel:${inquiry.customerPhone}`} className="hover:text-sfBlue">
                          {inquiry.customerPhone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{inquiry.productName}</td>
                      <td className="px-4 py-3 text-slate-300">{inquiry.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          inquiry.status === 'NEW' ? 'bg-sfRed/20 text-sfRed' :
                          inquiry.status === 'CONTACTED' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {inquiryEditId === inquiry._id ? (
                            <div className="flex gap-2">
                              <select
                                value={inquiryStatusForm.status}
                                onChange={(e) => setInquiryStatusForm({ ...inquiryStatusForm, status: e.target.value })}
                                className="form-select text-xs py-1 px-2"
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                              <button
                                onClick={() => submit(
                                  `/product-inquiries/${inquiry._id}`,
                                  inquiryStatusForm,
                                  [inquiries.refresh, inquiryCount.refresh],
                                  () => {
                                    setInquiryEditId('');
                                    setInquiryStatusForm({ status: 'CONTACTED', notes: '' });
                                  },
                                  'inquiry',
                                  'put'
                                )}
                                disabled={busy === 'inquiry'}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setInquiryEditId('');
                                  setInquiryStatusForm({ status: 'CONTACTED', notes: '' });
                                }}
                                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setInquiryEditId(inquiry._id);
                                  setInquiryStatusForm({ status: inquiry.status, notes: inquiry.notes || '' });
                                }}
                                className="px-3 py-1 bg-sfBlue/30 hover:bg-sfBlue/50 rounded text-xs font-semibold text-sfBlue"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => removeRecord(`/product-inquiries/${inquiry._id}`, [inquiries.refresh, inquiryCount.refresh], 'inquiry')}
                                disabled={busy === 'inquiry'}
                                className="px-3 py-1 bg-sfRed/30 hover:bg-sfRed/50 rounded text-xs font-semibold text-sfRed"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                      No inquiries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {message && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-center text-sm text-white shadow-2xl">
          {message}
        </div>
      )}
    </div>
  );
}