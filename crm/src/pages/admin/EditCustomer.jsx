import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = store.get('crm_customers').find(c => String(c.id) === id);

  const [form, setForm] = useState(customer ? {
    name: customer.name, email: customer.email, contact: customer.contact,
    district: customer.district, status: customer.status, notes: customer.notes || '',
  } : null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!customer || !form) {
    return (
      <Layout title="Edit Customer">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          Customer not found. <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/customers')}>Back</button>
        </div>
      </Layout>
    );
  }

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
    store.update('crm_customers', id, form);
    navigate('/admin/customers');
  };

  return (
    <Layout title="Edit Customer">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/customers')}><ArrowLeft size={16} /> Back</button>
          <h1>Edit Customer</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Customer Details</span></div>
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
              <label className="form-label">Phone *</label>
              <input className={`form-control${errors.contact ? ' is-error' : ''}`}
                value={form.contact} onChange={e => set('contact', e.target.value)} />
              {errors.contact && <span className="form-error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City / District</label>
              <input className="form-control" value={form.district} onChange={e => set('district', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>

            <div className="form-group form-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3}
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/customers')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
