import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Trash2, UserCheck } from 'lucide-react';

const PER_PAGE = 8;

export default function ExecutiveAssignment() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(() => store.get('crm_assignments'));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => assignments.filter(a => {
    const q = search.toLowerCase();
    return !q || a.executiveName?.toLowerCase().includes(q) || a.fileId?.toLowerCase().includes(q) || a.customerName?.toLowerCase().includes(q);
  }), [assignments, search]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    store.remove('crm_assignments', id);
    setAssignments(store.get('crm_assignments'));
    setDelId(null);
  };

  return (
    <Layout title="Executive Assignment">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Executive Assignments</h1>
          <p>{total} assignments</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/assign-executive')}>
            <Plus size={14} /> New Assignment
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by executive, loan, customer…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Loan ID</th><th>Customer</th><th>Bank Executive</th><th>Bank</th><th>Assigned On</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No assignments found</td></tr>
              ) : slice.map(a => (
                <tr key={a.id}>
                  <td><span className="td-mono">{a.fileId}</span></td>
                  <td><strong>{a.customerName}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar-sm">{a.executiveName?.[0] || '?'}</div>
                      {a.executiveName}
                    </div>
                  </td>
                  <td className="td-muted">{a.bankName}</td>
                  <td className="td-muted">{a.assignedDate}</td>
                  <td><Badge status={a.status || 'Active'} /></td>
                  <td>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDelId(a.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">Remove Assignment?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This will remove the executive assignment.</p>
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
