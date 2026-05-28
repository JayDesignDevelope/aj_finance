import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', contact: '', district: '', status: 'Active', notes: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.contact.trim()) e.contact = 'Phone is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.add('crm_customers', {
      id: 'CUST' + Date.now().toString().slice(-5),
      ...form, registeredAt: new Date().toISOString().split('T')[0],
    });
    navigate('/admin/customers');
  };

  return (
    <Layout title="New Customer">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/customers')}><ArrowLeft size={16} /> Back</button>
          <h1>New Customer</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Customer Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-control${errors.name ? ' is-error' : ''}`} placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-control${errors.email ? ' is-error' : ''}`} type="email" placeholder="john@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className={`form-control${errors.contact ? ' is-error' : ''}`} placeholder="+91 98765 43210"
                value={form.contact} onChange={e => set('contact', e.target.value)} />
              {errors.contact && <span className="form-error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-control" placeholder="Mumbai"
                value={form.district} onChange={e => set('district', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>

            <div className="form-group form-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3} placeholder="Additional notes…"
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/customers')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
