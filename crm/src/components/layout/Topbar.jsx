import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  DATA_OPERATOR: 'Data Operator',
  MARKETING_EXECUTIVE: 'Marketing Executive',
  BANK_EXECUTIVE: 'Bank Executive',
};

export default function Topbar({ title, sidebarOpen, onToggleSidebar }) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="topbar">
      <button
        className="topbar-icon-btn"
        onClick={onToggleSidebar}
        style={{ display: 'none' }}
        id="sidebar-toggle"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="topbar-title">{title}</div>

      <div className="topbar-right">
        <div className="topbar-icon-btn">
          <Bell size={17} color="var(--gray)" />
          <span className="notif-dot" />
        </div>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user?.name}</div>
            <div className="topbar-user-role">{ROLE_LABELS[user?.role] || user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
