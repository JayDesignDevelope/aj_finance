import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { initials } from './ui';
import { callerProgress, unassignedPool } from '../api/db';
import {
  IcGrid, IcLeads, IcAssign, IcAgents, IcImport, IcPhone, IcTarget,
} from './icons';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: <IcGrid />, end: true },
  { to: '/admin/leads', label: 'All Leads', icon: <IcLeads /> },
  { to: '/admin/assign', label: 'Assign Leads', icon: <IcAssign />, badgeKey: 'pool' },
  { to: '/admin/agents', label: 'Telecallers', icon: <IcAgents /> },
  { to: '/admin/import', label: 'Import Excel', icon: <IcImport /> },
];
const CALLER_NAV = [
  { to: '/me', label: 'My Calls Today', icon: <IcPhone />, end: true },
];

export default function Layout({ children, title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  const nav = user.role === 'admin' ? ADMIN_NAV : CALLER_NAV;
  const pool = user.role === 'admin' ? unassignedPool(user).length : 0;
  const prog = user.role === 'caller' ? callerProgress(user) : null;

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  }, [loc.pathname]);

  return (
    <div className="shell">
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <div className="brand">
          <div className="brand-mark">D</div>
          <div>
            <div className="brand-name">DSA Finance</div>
            <div className="brand-sub">CRM</div>
          </div>
        </div>

        <div className="nav-group-label">{user.role === 'admin' ? 'Management' : 'My Workspace'}</div>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            {n.icon}<span>{n.label}</span>
            {n.badgeKey === 'pool' && pool > 0 && <span className="nav-badge">{pool}</span>}
          </NavLink>
        ))}

        {prog && (
          <div style={{ margin: '18px 12px 0', padding: 14, background: 'rgba(255,255,255,.06)', borderRadius: 12 }}>
            <div className="flex" style={{ gap: 7, marginBottom: 9 }}>
              <IcTarget width={15} height={15} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#cdd7ea' }}>Today's Target</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
              {prog.done}<span style={{ fontSize: 14, color: '#8294b8' }}> / {prog.target}</span>
            </div>
            <div className="progress-track" style={{ marginTop: 8, background: 'rgba(255,255,255,.12)' }}>
              <div className="progress-fill" style={{ width: Math.min(100, (prog.done / prog.target) * 100) + '%' }} />
            </div>
            <div style={{ fontSize: 10.5, color: prog.done >= prog.target ? 'var(--green)' : '#8294b8', marginTop: 7, fontWeight: 700 }}>
              {prog.done >= prog.target ? '✓ Target met!' : `${prog.target - prog.done} calls to go`}
            </div>
          </div>
        )}

        <div className="sidebar-foot">
          <div className="side-user">
            <div className="avatar">{initials(user.name)}</div>
            <div>
              <div className="side-user-name">{user.name}</div>
              <div className="side-user-role">{user.role === 'admin' ? 'Admin / Manager' : 'Telecaller'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" style={{ display: 'none' }} onClick={() => setOpen((o) => !o)}>☰</button>
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          <div className="topbar-right">{actions}</div>
        </div>
        <div className="content" ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
