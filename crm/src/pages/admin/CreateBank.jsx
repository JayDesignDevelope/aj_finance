import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const LOAN_TYPE_OPTIONS = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];

export default function CreateBank() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', ifscPrefix: '', contactEmail: '', contactPhone: '', status: 'Active', loanTypes: [] });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleLoanType = (t) => {
    setForm(f => ({
      ...f,
      loanTypes: f.loanTypes.includes(t) ? f.loanTypes.filter(x => x !== t) : [...f.loanTypes, t]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Bank name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.add('crm_banks', {
      id: 'BNK' + Date.now().toString().slice(-5),
      ...form, createdAt: new Date().toISOString().split('T')[0],
    });
    navigate('/admin/banks');
  };

  return (
    <Layout title="Add Bank">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/banks')}><ArrowLeft size={16} /> Back</button>
          <h1>Add Bank Partner</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Bank Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Bank Name *</label>
              <input className={`form-control${errors.name ? ' is-error' : ''}`} placeholder="HDFC Bank"
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Prefix</label>
              <input className="form-control" placeholder="HDFC" value={form.ifscPrefix} onChange={e => set('ifscPrefix', e.target.value)} />
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
              <Save size={14} /> {saving ? 'Saving…' : 'Add Bank'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
