import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Download, Eye, Edit, Trash2 } from 'lucide-react';

const STATUSES = ['All', 'In-Process', 'Is-Disbursement', 'Completed', 'Rejected'];
const PER_PAGE = 8;

export default function LoanFiles() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState(() => store.get('crm_loans'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => loans.filter(l => {
    const matchS = statusFilter === 'All' || l.status === statusFilter;
    const q = search.toLowerCase();
    const matchQ = !q || l.customerName?.toLowerCase().includes(q) || l.id?.toLowerCase().includes(q) || l.loanType?.toLowerCase().includes(q);
    return matchS && matchQ;
  }), [loans, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    store.remove('crm_loans', id);
    setLoans(store.get('crm_loans'));
    setDelId(null);
  };

  const chipCount = (s) => s === 'All' ? loans.length : loans.filter(l => l.status === s).length;

  return (
    <Layout title="Loan Files">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Loan Files</h1>
          <p>{total} total loans</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={() => exportCSV(filtered)}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/create-loan')}>
            <Plus size={14} /> New Loan
          </button>
        </div>
      </div>

      {/* Status chips */}
      <div className="chip-row">
        {STATUSES.map(s => (
          <button key={s} className={`chip ${chipClass(s)}${statusFilter === s ? ' active' : ''}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s} ({chipCount(s)})
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by name, ID, type…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Loan ID</th><th>Customer</th><th>Type</th><th>Amount</th>
                <th>Bank</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No loans found</td></tr>
              ) : slice.map(l => (
                <tr key={l.id}>
                  <td><span className="td-mono">{l.id}</span></td>
                  <td><strong>{l.customerName}</strong></td>
                  <td>{l.loanType}</td>
                  <td><strong>₹{Number(l.amount).toLocaleString('en-IN')}</strong></td>
                  <td className="td-muted">{l.bankName}</td>
                  <td><Badge status={l.status} /></td>
                  <td className="td-muted">{l.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" title="View" onClick={() => navigate(`/admin/loan-files/${l.id}`)}><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => navigate(`/admin/edit-loan/${l.id}`)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDelId(l.id)}><Trash2 size={14} /></button>
                    </div>
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

      {/* Delete confirm */}
      {delId && (
        <div className="modal-backdrop" onClick={() => setDelId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Delete Loan?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This action cannot be undone. The loan file will be permanently removed.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setDelId(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(delId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function chipClass(s) {
  const m = { All: 'chip-all', 'In-Process': 'chip-blue', 'Is-Disbursement': 'chip-gold', Completed: 'chip-primary', Rejected: 'chip-red' };
  return m[s] || 'chip-all';
}

function exportCSV(data) {
  const headers = ['ID', 'Customer', 'Type', 'Amount', 'Bank', 'Status', 'Date'];
  const rows = data.map(l => [l.id, l.customerName, l.loanType, l.amount, l.bankName, l.status, l.createdAt]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'loans.csv'; a.click();
}
