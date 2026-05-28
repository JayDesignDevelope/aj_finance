import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const LOAN_TYPE_OPTIONS = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];

export default function EditBank() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bank = store.get('crm_banks').find(b => b.id === id);

  const [form, setForm] = useState(bank ? {
    name: bank.name, ifscPrefix: bank.ifscPrefix || '', contactEmail: bank.contactEmail || '',
    contactPhone: bank.contactPhone || '', status: bank.status, loanTypes: bank.loanTypes || [],
  } : null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!bank || !form) {
    return (
      <Layout title="Edit Bank">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          Bank not found. <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/banks')}>Back</button>
        </div>
      </Layout>
    );
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleLoanType = (t) => setForm(f => ({
    ...f, loanTypes: f.loanTypes.includes(t) ? f.loanTypes.filter(x => x !== t) : [...f.loanTypes, t]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErrors({ name: 'Required' }); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.update('crm_banks', id, form);
    navigate('/admin/banks');
  };

  return (
    <Layout title="Edit Bank">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/banks')}><ArrowLeft size={16} /> Back</button>
          <h1>Edit Bank — {bank.name}</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Bank Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Bank Name *</label>
              <input className={`form-control${errors.name ? ' is-error' : ''}`}
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Prefix</label>
              <input className="form-control" value={form.ifscPrefix} onChange={e => set('ifscPrefix', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-control" type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input className="form-control" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>

            <div className="form-group form-span-2">
              <label className="form-label">Loan Types Offered</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                {LOAN_TYPE_OPTIONS.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={form.loanTypes.includes(t)} onChange={() => toggleLoanType(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/banks')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
