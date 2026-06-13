import { useState } from 'react';
import * as XLSX from 'xlsx';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { importLeads } from '../../api/db';
import { Toast } from '../../components/ui';
import { IcImport, IcCheck } from '../../components/icons';

// maps a variety of spreadsheet header names → CRM fields (spec §5.2)
const FIELD_ALIASES = {
  name: ['name', 'full name', 'customer', 'customer name', 'client'],
  phone: ['phone', 'mobile', 'mobile number', 'contact', 'number', 'phone number'],
  email: ['email', 'e-mail', 'mail'],
  city: ['city', 'location', 'town'],
  product: ['product', 'loan type', 'product type', 'loan'],
  amount: ['amount', 'loan amount', 'requirement', 'loan amount required'],
  income: ['income', 'monthly income', 'salary'],
  employment: ['employment', 'employment type', 'occupation'],
};

function mapRow(raw) {
  const out = {};
  const keys = Object.keys(raw);
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const hit = keys.find((k) => aliases.includes(k.trim().toLowerCase()));
    if (hit) out[field] = raw[hit];
  }
  return out;
}

export default function ImportLeads() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState('');

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name); setResult(null);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    setRows(json.map(mapRow));
  };

  const loadSample = () => {
    setFileName('sample_leads.csv');
    setResult(null);
    setRows([
      { name: 'ramesh  kumar', phone: '9876543210', email: 'RAMESH@GMAIL.COM', city: 'pune', product: 'Home Loan', amount: '4500000', income: '85000', employment: 'Salaried' },
      { name: 'sunita rao', phone: '+91 88990 11223', email: 'sunita@x.com', city: 'hyderabad', product: 'Personal Loan', amount: '800000', income: '60000', employment: 'Self-Employed' },
      { name: 'imran shaikh', phone: '7012345678', email: '', city: 'mumbai', product: 'Business Loan', amount: '2500000', income: '150000', employment: 'Business Owner' },
      { name: 'no phone person', phone: '', email: 'bad@x.com', city: 'delhi', product: 'Auto Loan', amount: '600000', income: '40000', employment: 'Salaried' },
      { name: 'ramesh kumar', phone: '98765 43210', email: 'dup@gmail.com', city: 'Pune', product: 'Home Loan', amount: '4500000', income: '85000', employment: 'Salaried' },
    ]);
  };

  const doImport = () => {
    const res = importLeads(user, rows);
    setResult(res);
    setToast(`Imported ${res.imported} clean leads`);
    setTimeout(() => setToast(''), 2800);
    setRows([]); setFileName('');
  };

  const valid = rows.filter((r) => r.name && String(r.phone).replace(/\D/g, '').length >= 10).length;

  return (
    <Layout title="Import Excel Leads" subtitle="Upload, auto-clean, de-duplicate, then commit to the database">
      <Toast msg={toast} />

      <div className="grid cols-2">
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 6 }}>1. Upload spreadsheet</div>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 14 }}>
            Accepts .xlsx / .xls / .csv. Columns are auto-mapped (Name, Mobile, Email, City, Product, Amount, Income, Employment).
            Cleaning trims whitespace, standardizes phones to +91, title-cases names &amp; cities, and de-duplicates on mobile.
          </p>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <IcImport width={16} height={16} /> Choose file
            <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={onFile} />
          </label>
          <button className="btn btn-ghost" style={{ marginLeft: 10 }} onClick={loadSample}>Load sample data</button>
          {fileName && <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>📄 {fileName}</div>}
        </div>

        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 6 }}>2. Preview &amp; commit</div>
          {rows.length === 0 && !result && <div className="empty" style={{ padding: 28 }}>No file loaded yet</div>}
          {rows.length > 0 && (
            <>
              <div className="grid cols-3" style={{ gap: 10, textAlign: 'center', margin: '6px 0 14px' }}>
                <div><div style={{ fontSize: 22, fontWeight: 800 }}>{rows.length}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Rows</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-600)' }}>{valid}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Valid</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)' }}>{rows.length - valid}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Errors</div></div>
              </div>
              <button className="btn btn-green" style={{ width: '100%' }} onClick={doImport}><IcCheck width={16} height={16} /> Clean &amp; import {valid} leads</button>
            </>
          )}
          {result && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--green-600)' }}>✓ Import complete</div>
              <div className="demo-row"><span>Imported (clean)</span><strong>{result.imported}</strong></div>
              <div className="demo-row"><span>Duplicates skipped</span><strong>{result.duplicates}</strong></div>
              <div className="demo-row"><span>Errors quarantined</span><strong>{result.errors}</strong></div>
            </div>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="card mt-16">
          <div className="card-head"><span className="card-title">Preview (cleaned)</span></div>
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Product</th><th>Status</th></tr></thead>
              <tbody>
                {rows.slice(0, 30).map((r, i) => {
                  const ok = r.name && String(r.phone).replace(/\D/g, '').length >= 10;
                  return (
                    <tr key={i}>
                      <td className="cell-name" style={{ textTransform: 'capitalize' }}>{r.name || '—'}</td>
                      <td>{r.phone || '—'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{r.city || '—'}</td>
                      <td>{r.product || '—'}</td>
                      <td>{ok ? <span className="badge" style={{ background: 'rgba(0,208,156,.13)', color: 'var(--green-600)' }}>Valid</span>
                        : <span className="badge" style={{ background: 'rgba(239,68,68,.13)', color: 'var(--danger)' }}>Missing mobile</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
