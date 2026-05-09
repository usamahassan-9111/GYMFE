import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import AttendanceReportPage from './pages/AttendanceReportPage';
import PaymentReportPage from './pages/PaymentReportPage';
import DashboardPage from './pages/DashboardPage';
import MemberReportPage from './pages/MemberReportPage';
import PaymentDetailPage from './pages/PaymentDetailPage';
import MemberPaymentPage from './pages/MemberPaymentPage';
import PublicHomePage from './pages/PublicHomePage';

function PublicShell() {
  return (
    <div>
      <Navbar mode="public" />
      <PublicHomePage />
    </div>
  );
}

function AdminShell({ token, setToken, children }) {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar
        token={token}
        mode="admin"
        onLogout={() => {
          localStorage.removeItem('sf_token');
          setToken('');
          navigate('/admin/login');
        }}
      />
      {children}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('sf_token') || '');

  return (
    <Routes>
      <Route path="/" element={<PublicShell />} />
      <Route
        path="/admin/login"
        element={token ? <Navigate to="/admin/dashboard" replace /> : <AuthPage setToken={setToken} />}
      />
      <Route
        path="/admin/dashboard"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <DashboardPage token={token} />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route
        path="/admin/reports/members"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <MemberReportPage />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route
        path="/admin/reports/attendance"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <AttendanceReportPage />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route
        path="/admin/reports/payments"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <PaymentReportPage />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route
        path="/admin/payment/:paymentId"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <PaymentDetailPage />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route
        path="/admin/payment-member/:memberId"
        element={
          token ? (
            <AdminShell token={token} setToken={setToken}>
              <MemberPaymentPage />
            </AdminShell>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}