import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddCommission() {
  const navigate = useNavigate();
  const loans = store.get('crm_loans').filter(l => l.status === 'Completed' || l.status === 'Is-Disbursement');
  const users = store.get('crm_users');

  const [form, setForm] = useState({ loanId: '', agentId: '', agentName: '', rate: '', commissionAmt: '', paymentStatus: 'Pending' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLoan = (id) => {
    const loan = loans.find(l => l.id === id);
    set('loanId', id);
    if (loan && form.rate) {
      set('commissionAmt', Math.round(loan.amount * parseFloat(form.rate) / 100));
    }
  };

  const handleRate = (rate) => {
    set('rate', rate);
    if (form.loanId && rate) {
      const loan = loans.find(l => l.id === form.loanId);
      if (loan) set('commissionAmt', Math.round(loan.amount * parseFloat(rate) / 100));
    }
  };

  const handleAgent = (id) => {
    const user = users.find(u => u.id === id);
    set('agentId', id);
    if (user) set('agentName', user.name);
  };

  const validate = () => {
    const e = {};
    if (!form.loanId) e.loanId = 'Select a loan';
    if (!form.agentId) e.agentId = 'Select an agent';
    if (!form.rate || isNaN(form.rate)) e.rate = 'Valid rate required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    store.add('crm_commissions', {
      id: 'COM' + Date.now().toString().slice(-5),
      loanId: form.loanId, agentId: form.agentId, agentName: form.agentName,
      rate: parseFloat(form.rate), commissionAmt: Number(form.commissionAmt),
      paymentStatus: form.paymentStatus, paidAt: null,
      createdAt: new Date().toISOString().split('T')[0],
    });
    navigate('/admin/commission');
  };

  return (
    <Layout title="Add Commission">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/commission')}><ArrowLeft size={16} /> Back</button>
          <h1>Add Commission Record</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Commission Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Loan *</label>
              <select className={`form-control${errors.loanId ? ' is-error' : ''}`}
                value={form.loanId} onChange={e => handleLoan(e.target.value)}>
                <option value="">Select loan…</option>
                {loans.map(l => <option key={l.id} value={l.id}>{l.id} — {l.customerName} (₹{Number(l.amount).toLocaleString('en-IN')})</option>)}
              </select>
              {errors.loanId && <span className="form-error">{errors.loanId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Agent *</label>
              <select className={`form-control${errors.agentId ? ' is-error' : ''}`}
                value={form.agentId} onChange={e => handleAgent(e.target.value)}>
                <option value="">Select agent…</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              {errors.agentId && <span className="form-error">{errors.agentId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Rate (%) *</label>
              <input className={`form-control${errors.rate ? ' is-error' : ''}`} type="number" step="0.01" min="0" max="100"
                placeholder="e.g. 1.5" value={form.rate} onChange={e => handleRate(e.target.value)} />
              {errors.rate && <span className="form-error">{errors.rate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Commission Amount (₹)</label>
              <input className="form-control" type="number" value={form.commissionAmt}
                onChange={e => set('commissionAmt', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select className="form-control" value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value)}>
                <option>Pending</option><option>Paid</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/commission')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
