import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';

const PER_PAGE = 8;

export default function Banks() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState(() => store.get('crm_banks'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => banks.filter(b => {
    const ms = statusFilter === 'All' || b.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || b.name?.toLowerCase().includes(q) || b.ifscPrefix?.toLowerCase().includes(q);
    return ms && mq;
  }), [banks, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    store.remove('crm_banks', id);
    setBanks(store.get('crm_banks'));
    setDelId(null);
  };

  return (
    <Layout title="Banks">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Bank Partners</h1>
          <p>{banks.filter(b => b.status === 'Active').length} active of {banks.length}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/create-bank')}>
            <Plus size={14} /> Add Bank
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search banks…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Bank</th><th>IFSC Prefix</th><th>Contact</th><th>Loan Types</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No banks found</td></tr>
              ) : slice.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="bank-icon"><Building2 size={14} /></div>
                      <strong>{b.name}</strong>
                    </div>
                  </td>
                  <td><span className="td-mono">{b.ifscPrefix}</span></td>
                  <td className="td-muted">{b.contactEmail || '—'}</td>
                  <td className="td-muted">{(b.loanTypes || []).join(', ') || '—'}</td>
                  <td><Badge status={b.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => navigate(`/admin/edit-bank/${b.id}`)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDelId(b.id)}><Trash2 size={14} /></button>
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

      {delId && (
        <div className="modal-backdrop" onClick={() => setDelId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Remove Bank Partner?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This will permanently remove this bank.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setDelId(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(delId)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
