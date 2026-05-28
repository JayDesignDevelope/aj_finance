import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Users, Building2, FileStack,
  DollarSign, UserCheck, BarChart3, Activity, LogOut,
  ChevronRight, Briefcase, Upload, TrendingUp, ClipboardList
} from 'lucide-react';

const adminNav = [
  { label: 'Overview', items: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { label: 'Loan Management', items: [
    { to: '/admin/loan-files', icon: FileText, label: 'Loan Files' },
    { to: '/admin/status', icon: Activity, label: 'Status' },
  ]},
  { label: 'People', items: [
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/users', icon: UserCheck, label: 'Users' },
  ]},
  { label: 'Operations', items: [
    { to: '/admin/banks', icon: Building2, label: 'Banks' },
    { to: '/admin/documents', icon: FileStack, label: 'Documents' },
    { to: '/admin/commission', icon: DollarSign, label: 'Commission' },
    { to: '/admin/executive-assignment', icon: Briefcase, label: 'Assignments' },
  ]},
  { label: 'Analytics', items: [
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ]},
];

const executiveNav = [
  { label: 'Overview', items: [
    { to: '/executive/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/executive/my-files', icon: FileText, label: 'My Files' },
    { to: '/executive/documents', icon: FileStack, label: 'Documents' },
  ]},
];

const operatorNav = [
  { label: 'Overview', items: [
    { to: '/operator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { label: 'Create', items: [
    { to: '/operator/create-customer', icon: Users, label: 'New Customer' },
    { to: '/operator/create-loan', icon: FileText, label: 'New Loan' },
    { to: '/operator/upload-document', icon: Upload, label: 'Upload Document' },
  ]},
  { label: 'Browse', items: [
    { to: '/operator/customers', icon: ClipboardList, label: 'All Customers' },
    { to: '/operator/loan-files', icon: FileStack, label: 'All Loans' },
  ]},
];

const marketingNav = [
  { label: 'Overview', items: [
    { to: '/marketing/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/marketing/leads', icon: Users, label: 'All Leads' },
    { to: '/marketing/converted', icon: TrendingUp, label: 'Converted' },
    { to: '/marketing/reports', icon: BarChart3, label: 'Reports' },
  ]},
];

function navByRole(role) {
  if (role === 'ADMIN') return adminNav;
  if (role === 'BANK_EXECUTIVE') return executiveNav;
  if (role === 'DATA_OPERATOR') return operatorNav;
  return marketingNav;
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = navByRole(user?.role);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <NavLink to="/" className="sidebar-logo">
        <div className="sidebar-logo-mark">AJ</div>
        <div className="sidebar-logo-text">AJ <span>Finance</span></div>
      </NavLink>

      {nav.map(section => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-section-label">{section.label}</div>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="nav-item" style={{ color: 'var(--red)', marginBottom: 0 }} onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </div>
      </div>
    </aside>
  );
}
