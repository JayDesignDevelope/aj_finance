import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { initials } from './ui';
import { callerProgress, unassignedPool, dueCallbacks } from '../api/db';
import {
  IcGrid, IcLeads, IcAssign, IcAgents, IcImport, IcPhone, IcTarget, IcCheck, IcMenu,
  IcGlobe, IcBank, IcList, IcSettings, IcBell, IcClock,
} from './icons';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: <IcGrid />, end: true },
  { to: '/admin/leads', label: 'All Leads', icon: <IcLeads /> },
  { to: '/admin/website', label: 'Website Leads', icon: <IcGlobe /> },
  { to: '/admin/assign', label: 'Assign Leads', icon: <IcAssign />, badgeKey: 'pool' },
  { to: '/admin/agents', label: 'Telecallers', icon: <IcAgents /> },
  { to: '/admin/import', label: 'Import Excel', icon: <IcImport /> },
  { to: '/admin/catalog', label: 'Bank Catalog', icon: <IcBank /> },
  { to: '/admin/audit', label: 'Audit Log', icon: <IcList /> },
  { to: '/admin/settings', label: 'Settings', icon: <IcSettings /> },
];
const CALLER_NAV = [
  { to: '/me', label: 'My Calls Today', icon: <IcPhone />, end: true },
];

// Follow-up reminder bell — surfaces due/overdue callbacks (spec §9)
function RemindersBell({ user }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const items = dueCallbacks(user);
  const due = items.filter((i) => i.due);
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-ghost btn-sm" style={{ position: 'relative', padding: 9 }} onClick={() => setOpen((o) => !o)}>
        <IcBell width={17} height={17} />
        {due.length > 0 && <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, padding: '0 4px', background: 'var(--danger)', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{due.length}</span>}
      </button>
      {open && (
        <div className="card" style={{ position: 'absolute', right: 0, top: 44, width: 300, zIndex: 40, boxShadow: 'var(--shadow-lg)' }}>
          <div className="card-head"><span className="card-title">Follow-up Reminders</span></div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {items.length === 0 && <div className="empty" style={{ padding: 24, fontSize: 13 }}>No callbacks scheduled</div>}
            {items.slice(0, 12).map((i) => (
              <div key={i.id} className="tl-item" style={{ padding: '10px 16px', cursor: 'pointer' }}
                onClick={() => { setOpen(false); nav('/leads/' + i.id); }}>
                <div className="tl-dot" style={{ background: i.due ? 'rgba(239,68,68,.13)' : 'var(--bg)', color: i.due ? 'var(--danger)' : 'var(--navy)' }}><IcClock width={14} height={14} /></div>
                <div style={{ flex: 1 }}>
                  <div className="tl-text">{i.name} <span className="muted" style={{ fontWeight: 500 }}>· {i.product}</span></div>
                  <div className="tl-meta" style={{ color: i.due ? 'var(--danger)' : 'var(--text-3)', fontWeight: i.due ? 700 : 500 }}>
                    {i.due ? 'Due now · ' : ''}{new Date(i.callback).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            <div className="flex" style={{ fontSize: 10.5, color: prog.done >= prog.target ? 'var(--green)' : '#8294b8', marginTop: 7, fontWeight: 700, gap: 5 }}>
              {prog.done >= prog.target ? <><IcCheck width={12} height={12} /> Target met!</> : `${prog.target - prog.done} calls to go`}
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
          <button className="btn btn-ghost btn-sm" style={{ display: 'none' }} onClick={() => setOpen((o) => !o)}><IcMenu width={16} height={16} /></button>
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          <div className="topbar-right"><RemindersBell user={user} />{actions}</div>
        </div>
        <div className="content" ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
