import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'];

export default function OpCreateLoan() {
  const navigate = useNavigate();
  const customers = store.get('crm_customers');
  const banks = store.get('crm_banks');

  const [form, setForm] = useState({ customerId: '', customerName: '', loanType: LOAN_TYPES[0], amount: '', bankName: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleCustomer = (id) => {
    const c = customers.find(c => c.id === id);
    set('customerId', id);
    if (c) set('customerName', c.name);
  };

  const validate = () => {
    const e = {};
    if (!form.customerId) e.customerId = 'Select a customer';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Valid amount required';
    if (!form.bankName) e.bankName = 'Select a bank';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.add('crm_loans', {
      id: 'LN' + Date.now().toString().slice(-6),
      customerId: form.customerId, customerName: form.customerName,
      loanType: form.loanType, amount: Number(form.amount),
      bankName: form.bankName, status: 'In-Process',
      notes: form.notes, createdAt: new Date().toISOString().split('T')[0],
    });
    navigate('/operator/loan-files');
  };

  return (
    <Layout title="Create Loan">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/operator/loan-files')}><ArrowLeft size={16} /> Back</button>
          <h1>Create Loan File</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Loan Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select className={`form-control${errors.customerId ? ' is-error' : ''}`}
                value={form.customerId} onChange={e => handleCustomer(e.target.value)}>
                <option value="">Select customer…</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.customerId && <span className="form-error">{errors.customerId}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Loan Type</label>
              <select className="form-control" value={form.loanType} onChange={e => set('loanType', e.target.value)}>
                {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className={`form-control${errors.amount ? ' is-error' : ''}`} type="number" min="1"
                value={form.amount} onChange={e => set('amount', e.target.value)} />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Bank *</label>
              <select className={`form-control${errors.bankName ? ' is-error' : ''}`}
                value={form.bankName} onChange={e => set('bankName', e.target.value)}>
                <option value="">Select bank…</option>
                {banks.filter(b => b.status === 'Active').map(b => <option key={b.id}>{b.name}</option>)}
              </select>
              {errors.bankName && <span className="form-error">{errors.bankName}</span>}
            </div>
            <div className="form-group form-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/operator/loan-files')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Create Loan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
