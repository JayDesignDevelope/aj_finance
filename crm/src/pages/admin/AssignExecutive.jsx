import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save } from 'lucide-react';

export default function AssignExecutive() {
  const navigate = useNavigate();
  const loans = store.get('crm_loans');
  const executives = store.get('crm_users').filter(u => u.role === 'BANK_EXECUTIVE');
  const banks = store.get('crm_banks');

  const [form, setForm] = useState({ loanId: '', executiveId: '', bankId: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.loanId) e.loanId = 'Select a loan';
    if (!form.executiveId) e.executiveId = 'Select an executive';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    const loan = loans.find(l => l.id === form.loanId);
    const exec = executives.find(u => u.id === form.executiveId);
    const bank = banks.find(b => b.id === form.bankId);
    store.add('crm_assignments', {
      id: 'ASN' + Date.now().toString().slice(-5),
      fileId: form.loanId,
      customerName: loan?.customerName || '',
      executiveId: form.executiveId,
      executiveName: exec?.name || '',
      bankId: form.bankId,
      bankName: bank?.name || loan?.bankName || '',
      notes: form.notes,
      status: 'Active',
      assignedDate: new Date().toISOString().split('T')[0],
    });
    navigate('/admin/executive-assignment');
  };

  return (
    <Layout title="Assign Executive">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/executive-assignment')}><ArrowLeft size={16} /> Back</button>
          <h1>Assign Bank Executive</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Assignment Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Loan *</label>
              <select className={`form-control${errors.loanId ? ' is-error' : ''}`}
                value={form.loanId} onChange={e => set('loanId', e.target.value)}>
                <option value="">Select loan…</option>
                {loans.map(l => <option key={l.id} value={l.id}>{l.id} — {l.customerName}</option>)}
              </select>
              {errors.loanId && <span className="form-error">{errors.loanId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Bank Executive *</label>
              <select className={`form-control${errors.executiveId ? ' is-error' : ''}`}
                value={form.executiveId} onChange={e => set('executiveId', e.target.value)}>
                <option value="">Select executive…</option>
                {executives.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              {errors.executiveId && <span className="form-error">{errors.executiveId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Bank (optional)</label>
              <select className="form-control" value={form.bankId} onChange={e => set('bankId', e.target.value)}>
                <option value="">Select bank…</option>
                {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div className="form-group form-span-2">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/executive-assignment')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
