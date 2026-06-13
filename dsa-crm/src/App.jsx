import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllLeads from './pages/admin/AllLeads';
import AssignLeads from './pages/admin/AssignLeads';
import Agents from './pages/admin/Agents';
import ImportLeads from './pages/admin/ImportLeads';
import MyCalls from './pages/caller/MyCalls';
import LeadDetail from './pages/LeadDetail';

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/me'} replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/me'} replace /> : <Login />} />

      {/* Admin */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/leads" element={<RequireRole role="admin"><AllLeads /></RequireRole>} />
      <Route path="/admin/assign" element={<RequireRole role="admin"><AssignLeads /></RequireRole>} />
      <Route path="/admin/agents" element={<RequireRole role="admin"><Agents /></RequireRole>} />
      <Route path="/admin/import" element={<RequireRole role="admin"><ImportLeads /></RequireRole>} />

      {/* Telecaller */}
      <Route path="/me" element={<RequireRole role="caller"><MyCalls /></RequireRole>} />

      {/* Shared lead detail (RBAC enforced in data layer) */}
      <Route path="/leads/:id" element={<RequireRole><LeadDetail /></RequireRole>} />

      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/me') : '/login'} replace />} />
    </Routes>
  );
}
