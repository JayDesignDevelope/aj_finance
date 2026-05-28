import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Download, CheckCircle, DollarSign } from 'lucide-react';

const PER_PAGE = 8;

export default function Commission() {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState(() => store.get('crm_commissions'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => commissions.filter(c => {
    const ms = statusFilter === 'All' || c.paymentStatus === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || c.fileId?.toLowerCase().includes(q) || c.assignedTo?.toLowerCase().includes(q);
    return ms && mq;
  }), [commissions, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalAmt = commissions.reduce((s, c) => s + c.commissionAmt, 0);
  const paidAmt = commissions.filter(c => c.paymentStatus === 'Paid').reduce((s, c) => s + c.commissionAmt, 0);

  const markPaid = (id) => {
    store.update('crm_commissions', id, { paymentStatus: 'Paid', paymentDate: new Date().toISOString().split('T')[0] });
    setCommissions(store.get('crm_commissions'));
  };

  return (
    <Layout title="Commission">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Commission Tracker</h1>
          <p>{commissions.length} records</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={() => exportCSV(filtered)}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/add-commission')}>
            <Plus size={14} /> Add Commission
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <SummaryCard label="Total Commission" value={`₹${totalAmt.toLocaleString('en-IN')}`} color="var(--blue)" />
        <SummaryCard label="Paid" value={`₹${paidAmt.toLocaleString('en-IN')}`} color="var(--primary)" />
        <SummaryCard label="Pending" value={`₹${(totalAmt - paidAmt).toLocaleString('en-IN')}`} color="var(--gold)" />
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by loan ID or agent…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option>All</option><option>Paid</option><option>Pending</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Loan ID</th><th>Agent</th><th>Amount</th><th>Rate</th><th>Status</th><th>Paid On</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No records found</td></tr>
              ) : slice.map(c => (
                <tr key={c.id}>
                  <td><span className="td-mono">{c.fileId}</span></td>
                  <td><strong>{c.assignedTo}</strong></td>
                  <td><strong>₹{Number(c.commissionAmt).toLocaleString('en-IN')}</strong></td>
                  <td className="td-muted">{c.commissionPct}%</td>
                  <td><Badge status={c.paymentStatus} /></td>
                  <td className="td-muted">{c.paymentDate || '—'}</td>
                  <td>
                    {c.paymentStatus !== 'Paid' && (
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', gap: 4 }} onClick={() => markPaid(c.id)}>
                        <CheckCircle size={13} /> Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="pagination">
            <span className="pagination-info">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, total)} of {total}</span>
            <div className="pagination-btns">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p-1)}>‹</button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i+1} className={`page-btn${page === i+1 ? ' active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ textAlign: 'center' }}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function exportCSV(data) {
  const headers = ['Loan ID', 'Agent', 'Amount', 'Rate', 'Status', 'Paid On'];
  const rows = data.map(c => [c.fileId, c.assignedTo, c.commissionAmt, c.commissionPct + '%', c.paymentStatus, c.paymentDate || '']);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'commissions.csv'; a.click();
}
