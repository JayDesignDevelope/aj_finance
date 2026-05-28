import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const ROLES = ['ADMIN', 'DATA_OPERATOR', 'MARKETING_EXECUTIVE', 'BANK_EXECUTIVE'];
const ROLE_LABELS = { ADMIN: 'Admin', DATA_OPERATOR: 'Data Operator', MARKETING_EXECUTIVE: 'Marketing Executive', BANK_EXECUTIVE: 'Bank Executive' };

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = store.get('crm_users').find(u => u.id === id);

  const [form, setForm] = useState(user ? {
    name: user.name, email: user.email, role: user.role, status: user.status || 'Active',
  } : null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!user || !form) {
    return (
      <Layout title="Edit User">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          User not found. <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/users')}>Back</button>
        </div>
      </Layout>
    );
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.update('crm_users', id, form);
    navigate('/admin/users');
  };

  return (
    <Layout title="Edit User">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/users')}><ArrowLeft size={16} /> Back</button>
          <h1>Edit User</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">User Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-control${errors.name ? ' is-error' : ''}`}
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
              <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
