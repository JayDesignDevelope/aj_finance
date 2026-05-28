import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const DOC_TYPES = ['Aadhar Card', 'PAN Card', 'Bank Statement', 'Salary Slip', 'ITR', 'Property Documents', 'Photo', 'Signature', 'Other'];

export default function OpUploadDocument() {
  const navigate = useNavigate();
  const customers = store.get('crm_customers');
  const loans = store.get('crm_loans');

  const [form, setForm] = useState({ customerId: '', loanId: '', docType: DOC_TYPES[0], fileName: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const customerLoans = form.customerId ? loans.filter(l => l.customerId === form.customerId) : [];

  const validate = () => {
    const e = {};
    if (!form.customerId) e.customerId = 'Select a customer';
    if (!form.fileName.trim()) e.fileName = 'File name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    const customer = customers.find(c => c.id === form.customerId);
    store.add('crm_documents', {
      id: 'DOC' + Date.now().toString().slice(-5),
      customerId: form.customerId, customerName: customer?.name || '',
      loanId: form.loanId || null, docType: form.docType,
      fileName: form.fileName, status: 'Submitted',
      uploadedAt: new Date().toISOString().split('T')[0],
    });
    navigate('/operator/loan-files');
  };

  return (
    <Layout title="Upload Document">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/operator/loan-files')}><ArrowLeft size={16} /> Back</button>
          <h1>Upload Document</h1>
        </div>
      </div>

      <div className="form-page-wrap">
        <form onSubmit={handleSubmit} className="card form-card">
          <div className="card-header"><span className="card-title">Document Details</span></div>
          <div className="card-body form-grid">
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select className={`form-control${errors.customerId ? ' is-error' : ''}`}
                value={form.customerId} onChange={e => { set('customerId', e.target.value); set('loanId', ''); }}>
                <option value="">Select customer…</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.customerId && <span className="form-error">{errors.customerId}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Linked Loan</label>
              <select className="form-control" value={form.loanId} onChange={e => set('loanId', e.target.value)}>
                <option value="">None</option>
                {customerLoans.map(l => <option key={l.id} value={l.id}>{l.id} — {l.loanType}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Document Type</label>
              <select className="form-control" value={form.docType} onChange={e => set('docType', e.target.value)}>
                {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group form-span-2">
              <label className="form-label">File Name *</label>
              <input className={`form-control${errors.fileName ? ' is-error' : ''}`} placeholder="e.g. aadhar_card.pdf"
                value={form.fileName} onChange={e => set('fileName', e.target.value)} />
              {errors.fileName && <span className="form-error">{errors.fileName}</span>}
              <div style={{ marginTop: 12, border: '2px dashed var(--border)', borderRadius: 10, padding: '24px', textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>
                <Upload size={24} style={{ marginBottom: 8, color: 'var(--blue)' }} />
                <p>Drag & drop or click to select file</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/operator/loan-files')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={14} /> {saving ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
