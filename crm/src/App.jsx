import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import LoanFiles from './pages/admin/LoanFiles';
import LoanDetail from './pages/admin/LoanDetail';
import CreateLoan from './pages/admin/CreateLoan';
import EditLoan from './pages/admin/EditLoan';
import Customers from './pages/admin/Customers';
import CustomerDetail from './pages/admin/CustomerDetail';
import CreateCustomer from './pages/admin/CreateCustomer';
import EditCustomer from './pages/admin/EditCustomer';
import Users from './pages/admin/Users';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import Banks from './pages/admin/Banks';
import CreateBank from './pages/admin/CreateBank';
import EditBank from './pages/admin/EditBank';
import Documents from './pages/admin/Documents';
import UploadDocument from './pages/admin/UploadDocument';
import Commission from './pages/admin/Commission';
import AddCommission from './pages/admin/AddCommission';
import ExecutiveAssignment from './pages/admin/ExecutiveAssignment';
import AssignExecutive from './pages/admin/AssignExecutive';
import Reports from './pages/admin/Reports';
import Status from './pages/admin/Status';

// Executive
import ExecDashboard from './pages/executive/Dashboard';
import ExecMyFiles from './pages/executive/MyFiles';
import ExecDocuments from './pages/executive/Documents';

// Operator
import OpDashboard from './pages/operator/Dashboard';
import OpCustomers from './pages/operator/Customers';
import OpCreateCustomer from './pages/operator/CreateCustomer';
import OpCreateLoan from './pages/operator/CreateLoan';
import OpUploadDocument from './pages/operator/UploadDocument';
import OpLoanFiles from './pages/operator/LoanFiles';

// Marketing
import MktDashboard from './pages/marketing/Dashboard';
import MktLeads from './pages/marketing/Leads';
import MktReports from './pages/marketing/Reports';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultRedirect(user.role)} replace /> : <Login />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/loan-files" element={<ProtectedRoute roles={['ADMIN']}><LoanFiles /></ProtectedRoute>} />
      <Route path="/admin/loan-files/:id" element={<ProtectedRoute roles={['ADMIN']}><LoanDetail /></ProtectedRoute>} />
      <Route path="/admin/create-loan" element={<ProtectedRoute roles={['ADMIN']}><CreateLoan /></ProtectedRoute>} />
      <Route path="/admin/edit-loan/:id" element={<ProtectedRoute roles={['ADMIN']}><EditLoan /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute roles={['ADMIN']}><Customers /></ProtectedRoute>} />
      <Route path="/admin/customers/:id" element={<ProtectedRoute roles={['ADMIN']}><CustomerDetail /></ProtectedRoute>} />
      <Route path="/admin/create-customer" element={<ProtectedRoute roles={['ADMIN']}><CreateCustomer /></ProtectedRoute>} />
      <Route path="/admin/edit-customer/:id" element={<ProtectedRoute roles={['ADMIN']}><EditCustomer /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><Users /></ProtectedRoute>} />
      <Route path="/admin/create-user" element={<ProtectedRoute roles={['ADMIN']}><CreateUser /></ProtectedRoute>} />
      <Route path="/admin/edit-user/:id" element={<ProtectedRoute roles={['ADMIN']}><EditUser /></ProtectedRoute>} />
      <Route path="/admin/banks" element={<ProtectedRoute roles={['ADMIN']}><Banks /></ProtectedRoute>} />
      <Route path="/admin/create-bank" element={<ProtectedRoute roles={['ADMIN']}><CreateBank /></ProtectedRoute>} />
      <Route path="/admin/edit-bank/:id" element={<ProtectedRoute roles={['ADMIN']}><EditBank /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute roles={['ADMIN']}><Documents /></ProtectedRoute>} />
      <Route path="/admin/upload-document" element={<ProtectedRoute roles={['ADMIN']}><UploadDocument /></ProtectedRoute>} />
      <Route path="/admin/commission" element={<ProtectedRoute roles={['ADMIN']}><Commission /></ProtectedRoute>} />
      <Route path="/admin/add-commission" element={<ProtectedRoute roles={['ADMIN']}><AddCommission /></ProtectedRoute>} />
      <Route path="/admin/executive-assignment" element={<ProtectedRoute roles={['ADMIN']}><ExecutiveAssignment /></ProtectedRoute>} />
      <Route path="/admin/assign-executive" element={<ProtectedRoute roles={['ADMIN']}><AssignExecutive /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />
      <Route path="/admin/status" element={<ProtectedRoute roles={['ADMIN']}><Status /></ProtectedRoute>} />

      {/* Bank Executive */}
      <Route path="/executive/dashboard" element={<ProtectedRoute roles={['BANK_EXECUTIVE']}><ExecDashboard /></ProtectedRoute>} />
      <Route path="/executive/my-files" element={<ProtectedRoute roles={['BANK_EXECUTIVE']}><ExecMyFiles /></ProtectedRoute>} />
      <Route path="/executive/documents" element={<ProtectedRoute roles={['BANK_EXECUTIVE']}><ExecDocuments /></ProtectedRoute>} />

      {/* Data Operator */}
      <Route path="/operator/dashboard" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpDashboard /></ProtectedRoute>} />
      <Route path="/operator/customers" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpCustomers /></ProtectedRoute>} />
      <Route path="/operator/create-customer" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpCreateCustomer /></ProtectedRoute>} />
      <Route path="/operator/create-loan" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpCreateLoan /></ProtectedRoute>} />
      <Route path="/operator/upload-document" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpUploadDocument /></ProtectedRoute>} />
      <Route path="/operator/loan-files" element={<ProtectedRoute roles={['DATA_OPERATOR']}><OpLoanFiles /></ProtectedRoute>} />

      {/* Marketing */}
      <Route path="/marketing/dashboard" element={<ProtectedRoute roles={['MARKETING_EXECUTIVE']}><MktDashboard /></ProtectedRoute>} />
      <Route path="/marketing/leads" element={<ProtectedRoute roles={['MARKETING_EXECUTIVE']}><MktLeads /></ProtectedRoute>} />
      <Route path="/marketing/reports" element={<ProtectedRoute roles={['MARKETING_EXECUTIVE']}><MktReports /></ProtectedRoute>} />

      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function defaultRedirect(role) {
  const map = {
    ADMIN: '/admin/dashboard',
    DATA_OPERATOR: '/operator/dashboard',
    MARKETING_EXECUTIVE: '/marketing/dashboard',
    BANK_EXECUTIVE: '/executive/dashboard',
  };
  return map[role] || '/login';
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
