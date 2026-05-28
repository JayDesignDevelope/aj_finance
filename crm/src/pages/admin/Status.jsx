import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Save, RefreshCw } from 'lucide-react';

const STATUSES = ['In-Process', 'Is-Disbursement', 'Completed', 'Rejected'];

export default function Status() {
  const [loans, setLoans] = useState(() => store.get('crm_loans'));
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState({});

  const filtered = loans.filter(l => {
    const q = search.toLowerCase();
    return !q || l.id?.toLowerCase().includes(q) || l.customerName?.toLowerCase().includes(q);
  });

  const updateStatus = (id, status) => {
    store.update('crm_loans', id, { status });
    setLoans(store.get('crm_loans'));
    setSaved(s => ({ ...s, [id]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [id]: false })), 1500);
  };

  return (
    <Layout title="Status Manager">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Loan Status Manager</h1>
          <p>Update loan statuses in bulk</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <input className="search-input" style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
            placeholder="Filter by loan ID or customer name…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Loan ID</th><th>Customer</th><th>Type</th><th>Amount</th><th>Current Status</th><th>Update To</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td><span className="td-mono">{l.id}</span></td>
                  <td><strong>{l.customerName}</strong></td>
                  <td className="td-muted">{l.loanType}</td>
                  <td><strong>₹{Number(l.amount).toLocaleString('en-IN')}</strong></td>
                  <td><Badge status={l.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <select className="filter-select" value={l.status}
                        onChange={e => updateStatus(l.id, e.target.value)}
                        style={{ minWidth: 140 }}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {saved[l.id] && (
                        <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Saved ✓</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
