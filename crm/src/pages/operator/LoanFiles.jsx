import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search } from 'lucide-react';

const PER_PAGE = 8;

export default function OpLoanFiles() {
  const navigate = useNavigate();
  const [loans] = useState(() => store.get('crm_loans'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => loans.filter(l => {
    const ms = statusFilter === 'All' || l.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || l.id?.toLowerCase().includes(q) || l.customerName?.toLowerCase().includes(q) || l.loanType?.toLowerCase().includes(q);
    return ms && mq;
  }), [loans, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout title="Loan Files">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Loan Files</h1>
          <p>{total} loans</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/operator/create-loan')}>
            <Plus size={14} /> New Loan
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search loans…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option>All</option><option>In-Process</option><option>Is-Disbursement</option><option>Completed</option><option>Rejected</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Loan ID</th><th>Customer</th><th>Type</th><th>Amount</th><th>Bank</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No loans found</td></tr>
              ) : slice.map(l => (
                <tr key={l.id}>
                  <td><span className="td-mono">{l.id}</span></td>
                  <td><strong>{l.customerName}</strong></td>
                  <td>{l.loanType}</td>
                  <td><strong>₹{Number(l.amount).toLocaleString('en-IN')}</strong></td>
                  <td className="td-muted">{l.bankName}</td>
                  <td><Badge status={l.status} /></td>
                  <td className="td-muted">{l.createdAt}</td>
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
