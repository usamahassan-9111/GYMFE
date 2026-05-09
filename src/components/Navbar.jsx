import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApiResource } from '../hooks/useApiResource';

const adminNavItems = [
  { label: 'Home', href: '#home' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Members', href: '#members' },
  { label: 'Payments', href: '#payments' },
  { label: 'Attendance', href: '#attendance' },
];

const publicNavItems = [
  { label: 'Home', href: '#home' },
  { label: 'Timings', href: '#timings' },
  { label: 'Plans', href: '#plans' },
  { label: 'Trainer', href: '#trainer' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ token, onLogout, mode = 'admin' }) {
  const navItems = mode === 'public' ? publicNavItems : adminNavItems;
  const [openAlerts, setOpenAlerts] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const alerts = useApiResource('/notifications/alerts', { membershipExpiringSoon: [], paymentDueReminders: [] }, mode === 'admin');
  const alertItems = useMemo(
    () => [...(alerts.data?.membershipExpiringSoon || []), ...(alerts.data?.paymentDueReminders || [])],
    [alerts.data]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sfBlue to-sfRed">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400">SF SMART FITNESS</h3>
            <h1 className="text-sm font-extrabold tracking-wide text-white"></h1>
          </div>
        </Link>

        <nav className={`${isMobile && openMenu ? 'absolute top-14 left-0 right-0 flex flex-col bg-slate-950 border-b border-white/10 p-4 gap-2' : 'hidden md:flex gap-5'}`}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpenMenu(false)} className="text-sm text-slate-300 transition hover:text-white py-2 md:py-0">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {mode === 'public' ? (
            <>
              <a href="#supplements" className="animate-pulse rounded-full bg-gradient-to-r from-sfRed to-rose-600 px-3 py-2 text-xs sm:px-4 sm:text-sm font-bold text-white shadow-lg hover:shadow-xl transition">
                💊 Supplements
              </a>
              <Link to="/admin/login" className="hidden sm:inline-block rounded-full bg-sfBlue px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700">
                Admin Panel
              </Link>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenAlerts((value) => !value)}
                  className="relative flex items-center justify-center rounded-full border border-white/15 px-2 py-2 text-white transition hover:bg-white/10 sm:px-3"
                  aria-label="Open alerts"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a3 3 0 0 0 6 0" />
                  </svg>
                  {alertItems.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sfRed px-1 text-[10px] font-bold text-white">
                      {alertItems.length}
                    </span>
                  )}
                </button>

                {openAlerts && (
                  <div className="absolute right-0 top-12 w-[22rem] max-w-[90vw] rounded-3xl border border-white/10 bg-slate-950 p-4 shadow-2xl">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Due Alerts</h3>
                      <button type="button" onClick={() => setOpenAlerts(false)} className="text-xs text-slate-400 transition hover:text-white font-semibold">
                        Close
                      </button>
                    </div>
                    <div className="max-h-80 space-y-3 overflow-auto pr-1">
                      {alertItems.length === 0 ? (
                        <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">No due alerts right now.</p>
                      ) : (
                        alertItems.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-300">{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {!token ? (
                <Link to="/admin/login" className="rounded-full bg-sfRed px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold text-white transition hover:bg-rose-600">
                  Admin Login
                </Link>
              ) : (
                <>
                  <Link to="/" className="hidden sm:inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                    Public
                  </Link>
                  <button onClick={onLogout} className="rounded-full border border-white/15 px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold text-white transition hover:bg-white/10">
                    Logout
                  </button>
                </>
              )}
            </>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMenu((v) => !v)}
              className="md:hidden flex items-center justify-center rounded-full border border-white/15 px-2 py-2 text-white transition hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {openMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}