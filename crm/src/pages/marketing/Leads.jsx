import { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Search, Download } from 'lucide-react';

const PER_PAGE = 10;

export default function MktLeads() {
  const [customers] = useState(() => store.get('crm_customers'));
  const loans = store.get('crm_loans');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const enriched = useMemo(() => customers.map(c => ({
    ...c,
    loanCount: loans.filter(l => l.customerId === c.id).length,
  })), [customers, loans]);

  const filtered = useMemo(() => enriched.filter(c => {
    const ms = statusFilter === 'All' || c.status === statusFilter;
    const q = search.toLowerCase();
    const mq = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.district?.toLowerCase().includes(q);
    return ms && mq;
  }), [enriched, search, statusFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Status', 'Loans', 'Joined'];
    const rows = filtered.map(c => [c.name, c.email, c.contact, c.district, c.status, c.loanCount, c.registeredAt]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'leads.csv'; a.click();
  };

  return (
    <Layout title="Leads">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Customer Leads</h1>
          <p>{total} records</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={exportCSV}><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by name, email, city…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Loans</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No leads found</td></tr>
              ) : slice.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td className="td-muted">{c.email}</td>
                  <td className="td-muted">{c.contact}</td>
                  <td className="td-muted">{c.district}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ background: 'var(--blue-light)', color: 'var(--blue)', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {c.loanCount}
                    </span>
                  </td>
                  <td><Badge status={c.status} /></td>
                  <td className="td-muted">{c.registeredAt}</td>
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
