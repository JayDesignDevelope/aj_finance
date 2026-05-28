import { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react';

const PER_PAGE = 8;

export default function ExecDocuments() {
  const { user } = useAuth();
  const assignments = store.get('crm_assignments').filter(a => a.executiveEmail === user?.email);
  const assignedLoanIds = assignments.map(a => a.fileId);
  const allDocs = store.get('crm_documents').filter(d => assignedLoanIds.includes(d.fileId));

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => allDocs.filter(d => {
    const q = search.toLowerCase();
    return !q || d.docName?.toLowerCase().includes(q) || d.docType?.toLowerCase().includes(q) || d.customerName?.toLowerCase().includes(q);
  }), [allDocs, search]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <Layout title="Documents">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Loan Documents</h1>
          <p>{total} documents</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search documents…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>File Name</th><th>Type</th><th>Customer</th><th>Loan</th><th>Status</th><th>Uploaded</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No documents found</td></tr>
              ) : slice.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.docName}</strong></td>
                  <td className="td-muted">{d.docType}</td>
                  <td>{d.customerName}</td>
                  <td><span className="td-mono">{d.fileId || '—'}</span></td>
                  <td><Badge status={d.status} /></td>
                  <td className="td-muted">{d.uploadDate}</td>
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
