import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];
const STATUSES = ['In-Process', 'Is-Disbursement', 'Completed', 'Rejected'];

export default function EditLoan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loan = store.get('crm_loans').find(l => l.id === id);
  const banks = store.get('crm_banks');

  const [form, setForm] = useState(loan ? {
    loanType: loan.loanType, amount: loan.amount,
    bankName: loan.bankName, status: loan.status, notes: loan.notes || '',
  } : null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!loan || !form) {
    return (
      <Layout title="Edit Loan">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          Loan not found. <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/loan-files')}>Back</button>
        </div>
      </Layout>
    );
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.bankName) e.bankName = 'Select a bank';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.update('crm_loans', id, { ...form, amount: Number(form.amount) });
    navigate('/admin/loan-files');
  };

  return (
    <Layout title="Edit Loan">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/loan-files')}><ArrowLeft size={16} /> Back</button>
          <h1>Edit Loan — {id}</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header">
            <span className="card-title">Loan Details</span>
            <span style={{ fontSize: 12, color: 'var(--gray)' }}>Customer: {loan.customerName}</span>
          </div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Loan Type</label>
              <select className="form-control" value={form.loanType} onChange={e => set('loanType', e.target.value)}>
                {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Loan Amount (₹) *</label>
              <input className={`form-control${errors.amount ? ' is-error' : ''}`} type="number" min="1"
                value={form.amount} onChange={e => set('amount', e.target.value)} />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Bank *</label>
              <select className={`form-control${errors.bankName ? ' is-error' : ''}`}
                value={form.bankName} onChange={e => set('bankName', e.target.value)}>
                <option value="">Select bank…</option>
                {banks.map(b => <option key={b.id}>{b.name}</option>)}
              </select>
              {errors.bankName && <span className="form-error">{errors.bankName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group form-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/loan-files')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
