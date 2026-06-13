import { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getAgents, createAgent, toggleAgent, resetAgentPassword, analytics } from '../../api/db';
import { initials, Toast } from '../../components/ui';
import { IcPlus } from '../../components/icons';

export default function Agents() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const agents = useMemo(() => getAgents(), [version]);
  const perf = useMemo(() => analytics().agents, [version]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState('');

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2400); };

  const add = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    createAgent(form);
    setForm({ name: '', email: '', password: '' });
    setShowForm(false);
    setVersion((v) => v + 1);
    flash('Telecaller account created');
  };

  const stat = (id) => perf.find((p) => p.id === id) || { assigned: 0, conversions: 0, callsToday: 0 };

  return (
    <Layout title="Telecallers" subtitle="Create logins, reset passwords, enable/disable accounts"
      actions={<button className="btn btn-green" onClick={() => setShowForm((s) => !s)}><IcPlus width={16} height={16} /> Add Telecaller</button>}>
      <Toast msg={toast} />

      {showForm && (
        <div className="card mt-16">
          <div className="card-head"><span className="card-title">New Telecaller Login</span></div>
          <form className="card-pad" onSubmit={add}>
            <div className="row">
              <div className="field"><label>Full Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Telecaller Four" /></div>
              <div className="field"><label>Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="caller4@dsacrm.in" /></div>
              <div className="field"><label>Password</label>
                <input className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="default: call123" /></div>
            </div>
            <button className="btn btn-primary" type="submit">Create account</button>
          </form>
        </div>
      )}

      <div className="grid cols-3 mt-16">
        {agents.map((a) => {
          const s = stat(a.id);
          return (
            <div className="card card-pad" key={a.id}>
              <div className="between">
                <div className="flex">
                  <div className="avatar" style={{ background: a.active ? 'var(--navy)' : 'var(--text-3)' }}>{initials(a.name)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.email}</div>
                  </div>
                </div>
                <span className="badge" style={{ background: a.active ? 'rgba(0,208,156,.13)' : 'rgba(148,163,184,.18)', color: a.active ? 'var(--green-600)' : 'var(--text-2)' }}>
                  {a.active ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="grid cols-3 mt-16" style={{ gap: 8, textAlign: 'center' }}>
                <div><div style={{ fontSize: 19, fontWeight: 800 }}>{s.assigned}</div><div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600 }}>Assigned</div></div>
                <div><div style={{ fontSize: 19, fontWeight: 800 }}>{s.callsToday}</div><div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600 }}>Calls Today</div></div>
                <div><div style={{ fontSize: 19, fontWeight: 800, color: 'var(--green-600)' }}>{s.conversions}</div><div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600 }}>Closed</div></div>
              </div>
              <div className="wrap-gap mt-16">
                <button className="btn btn-ghost btn-sm" onClick={() => { toggleAgent(a.id); setVersion((v) => v + 1); flash(a.active ? 'Account disabled' : 'Account enabled'); }}>
                  {a.active ? 'Disable' : 'Enable'}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  const p = prompt('New password for ' + a.name, 'call123');
                  if (p) { resetAgentPassword(a.id, p); flash('Password reset'); }
                }}>Reset password</button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
