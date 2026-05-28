import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';

const ROLES = ['ADMIN', 'DATA_OPERATOR', 'MARKETING_EXECUTIVE', 'BANK_EXECUTIVE'];

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES[1], status: 'Active' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 4) e.password = 'Min 4 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.add('crm_users', {
      id: 'USR' + Date.now().toString().slice(-5),
      ...form, createdAt: new Date().toISOString().split('T')[0],
    });
    navigate('/admin/users');
  };

  const ROLE_LABELS = {
    ADMIN: 'Admin', DATA_OPERATOR: 'Data Operator',
    MARKETING_EXECUTIVE: 'Marketing Executive', BANK_EXECUTIVE: 'Bank Executive',
  };

  return (
    <Layout title="Add User">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/users')}><ArrowLeft size={16} /> Back</button>
          <h1>Add Team Member</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">User Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-control${errors.name ? ' is-error' : ''}`} placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-control${errors.email ? ' is-error' : ''}`} type="email"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input className={`form-control${errors.password ? ' is-error' : ''}`}
                  type={showPw ? 'text' : 'password'} style={{ paddingRight: 44 }}
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/users')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
