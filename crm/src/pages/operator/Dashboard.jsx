import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Users, Upload, Plus } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function OpDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const loans = store.get('crm_loans');
  const customers = store.get('crm_customers');
  const docs = store.get('crm_documents');

  const recent = loans.slice(0, 5);

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome, {user?.name?.split(' ')[0] || 'Operator'}</h1>
          <p>Data entry & loan management</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard icon={<Users />} label="Total Customers" value={customers.length} color="var(--blue)" />
        <StatCard icon={<FileText />} label="Total Loans" value={loans.length} color="var(--primary)" />
        <StatCard icon={<Upload />} label="Documents" value={docs.length} color="var(--gold)" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '20px 0' }}>
        <QuickAction label="Add Customer" icon={<Users size={20} />} color="var(--blue)" onClick={() => navigate('/operator/create-customer')} />
        <QuickAction label="Create Loan" icon={<FileText size={20} />} color="var(--primary)" onClick={() => navigate('/operator/create-loan')} />
        <QuickAction label="Upload Document" icon={<Upload size={20} />} color="var(--gold)" onClick={() => navigate('/operator/upload-document')} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Loans</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/operator/loan-files')}>View All</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Loan ID</th><th>Customer</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(l => (
                <tr key={l.id}>
                  <td><span className="td-mono">{l.id}</span></td>
                  <td><strong>{l.customerName}</strong></td>
                  <td>{l.loanType}</td>
                  <td><strong>₹{Number(l.amount).toLocaleString('en-IN')}</strong></td>
                  <td><Badge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: `${color}18` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function QuickAction({ label, icon, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
      cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
    </button>
  );
}
