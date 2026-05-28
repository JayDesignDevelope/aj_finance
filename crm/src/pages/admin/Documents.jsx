import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';

const STATUSES = ['All', 'Pending', 'Submitted', 'Verified', 'Processing'];
const PER_PAGE = 8;

export default function Documents() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState(() => store.get('crm_documents'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => docs.filter(d => {
    const ms = statusFilter === 'All' || d.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || d.fileName?.toLowerCase().includes(q) || d.docType?.toLowerCase().includes(q) || d.customerName?.toLowerCase().includes(q);
    return ms && mq;
  }), [docs, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateStatus = (id, status) => {
    store.update('crm_documents', id, { status });
    setDocs(store.get('crm_documents'));
  };

  const handleDelete = (id) => {
    store.remove('crm_documents', id);
    setDocs(store.get('crm_documents'));
    setDelId(null);
  };

  return (
    <Layout title="Documents">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Documents</h1>
          <p>{total} records</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/upload-document')}>
            <Plus size={14} /> Upload Document
          </button>
        </div>
      </div>

      <div className="chip-row">
        {STATUSES.map(s => (
          <button key={s} className={`chip chip-all${statusFilter === s ? ' active' : ''}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s} ({s === 'All' ? docs.length : docs.filter(d => d.status === s).length})
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by file, type, customer…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>File</th><th>Type</th><th>Customer</th><th>Loan</th><th>Status</th><th>Uploaded</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No documents found</td></tr>
              ) : slice.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.fileName}</strong></td>
                  <td className="td-muted">{d.docType}</td>
                  <td>{d.customerName}</td>
                  <td><span className="td-mono">{d.loanId || '—'}</span></td>
                  <td><Badge status={d.status} /></td>
                  <td className="td-muted">{d.uploadedAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {d.status !== 'Verified' && (
                        <button className="btn btn-ghost btn-sm btn-icon" title="Verify" onClick={() => updateStatus(d.id, 'Verified')} style={{ color: 'var(--primary)' }}>
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {d.status === 'Verified' && (
                        <button className="btn btn-ghost btn-sm btn-icon" title="Revert" onClick={() => updateStatus(d.id, 'Submitted')} style={{ color: 'var(--gold)' }}>
                          <XCircle size={14} />
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDelId(d.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">Delete Document?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This will permanently remove the document record.</p>
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
