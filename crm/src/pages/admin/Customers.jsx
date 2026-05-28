import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Eye, Edit, Trash2, Download } from 'lucide-react';

const PER_PAGE = 8;

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(() => store.get('crm_customers'));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => customers.filter(c => {
    const ms = statusFilter === 'All' || c.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.contact?.includes(q) || c.id?.toLowerCase().includes(q);
    return ms && mq;
  }), [customers, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    store.remove('crm_customers', id);
    setCustomers(store.get('crm_customers'));
    setDelId(null);
  };

  return (
    <Layout title="Customers">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Customers</h1>
          <p>{total} total</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={() => exportCSV(filtered)}>
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/create-customer')}>
            <Plus size={14} /> New Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by name, email, phone…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No customers found</td></tr>
              ) : slice.map(c => (
                <tr key={c.id}>
                  <td><span className="td-mono">{c.id}</span></td>
                  <td><strong>{c.name}</strong></td>
                  <td className="td-muted">{c.email}</td>
                  <td className="td-muted">{c.contact}</td>
                  <td className="td-muted">{c.district}</td>
                  <td><Badge status={c.status} /></td>
                  <td className="td-muted">{c.registeredAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" title="View" onClick={() => navigate(`/admin/customers/${c.id}`)}><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => navigate(`/admin/edit-customer/${c.id}`)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDelId(c.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">Delete Customer?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This will permanently remove the customer record.</p>
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

function exportCSV(data) {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Status', 'Joined'];
  const rows = data.map(c => [c.id, c.name, c.email, c.contact, c.district, c.status, c.registeredAt]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'customers.csv'; a.click();
}
