import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function AuthPage({ setToken }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const response = await api.post(endpoint, payload);
      const token = response.data.token;
      localStorage.setItem('sf_token', token);
      setToken(token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <div className="glass rounded-[2rem] p-8 sm:p-10 animate-slideIn">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Access</p>
          <h2 className="mt-4 text-4xl font-black text-white">{mode === 'login' ? 'Login to SF SMART FITNESS' : 'Create Admin Account'}</h2>
          <p className="mt-3 text-base leading-6 text-slate-300">Protected dashboard access for member management, fees, attendance, and reports.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === 'signup' && (
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Admin name"
                className="form-input w-full"
              />
            )}
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Admin email"
              type="email"
              className="form-input w-full"
            />
            <input
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              type="password"
              className="form-input w-full"
            />

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3.5 text-base font-semibold text-rose-200">{error}</p>}

            <button disabled={loading} className="btn-secondary w-full mt-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Signup'}
            </button>
          </form>

          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mt-6 text-base font-semibold text-slate-300 underline underline-offset-4 hover:text-white transition">
            {mode === 'login' ? 'Need admin account? Switch to signup' : 'Already have an account? Switch to login'}
          </button>

          <button onClick={() => navigate('/')} className="mt-4 text-base text-slate-400 underline underline-offset-4 hover:text-slate-300 transition">
            Back to public website
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-cover bg-center p-6 sm:p-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=1000&fit=crop')" }}>
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Mr Faisal Certified Gym Trainer</p>
            <h3 className="mt-4 text-3xl font-black text-white">Blue and red energy, premium gym visuals, and smooth mobile performance.</h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Once you log in, the dashboard will pull all backend APIs and show members, plans, payments, attendance, trainers, workout plans, diet plans, dashboard stats, and notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}