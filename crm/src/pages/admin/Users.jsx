import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const ROLES = ['All', 'ADMIN', 'DATA_OPERATOR', 'MARKETING_EXECUTIVE', 'BANK_EXECUTIVE'];
const PER_PAGE = 8;

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => store.get('crm_users'));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(() => users.filter(u => {
    const mr = roleFilter === 'All' || u.role === roleFilter;
    const q = search.toLowerCase();
    const mq = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return mr && mq;
  }), [users, search, roleFilter]);

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    store.remove('crm_users', id);
    setUsers(store.get('crm_users'));
    setDelId(null);
  };

  const ROLE_LABELS = {
    ADMIN: 'Admin', DATA_OPERATOR: 'Data Operator',
    MARKETING_EXECUTIVE: 'Marketing', BANK_EXECUTIVE: 'Bank Executive',
  };

  return (
    <Layout title="Users">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Team Members</h1>
          <p>{total} users</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/create-user')}>
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search />
            <input className="search-input" placeholder="Search by name or email…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="filter-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No users found</td></tr>
              ) : slice.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar-sm">{u.name?.[0] || '?'}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td className="td-muted">{u.email}</td>
                  <td><Badge status={u.role} label={ROLE_LABELS[u.role] || u.role} /></td>
                  <td><Badge status={u.status || 'Active'} /></td>
                  <td className="td-muted">{u.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => navigate(`/admin/edit-user/${u.id}`)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDelId(u.id)}><Trash2 size={14} /></button>
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
              <span className="modal-title">Delete User?</span>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>This will permanently remove the user account.</p>
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
