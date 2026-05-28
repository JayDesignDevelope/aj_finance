import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, CheckCircle, Clock, UserCheck } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function ExecDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allLoans = store.get('crm_loans');
  const assignments = store.get('crm_assignments').filter(a => a.executiveEmail === user?.email);
  const assignedLoanIds = assignments.map(a => a.fileId);
  const myLoans = allLoans.filter(l => assignedLoanIds.includes(l.id));

  const stats = useMemo(() => ({
    total: myLoans.length,
    inProcess: myLoans.filter(l => l.status === 'In-Process').length,
    disbursement: myLoans.filter(l => l.status === 'Is-Disbursement').length,
    completed: myLoans.filter(l => l.status === 'Completed').length,
  }), [myLoans]);

  const recent = myLoans.slice(0, 5);

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome, {user?.name?.split(' ')[0] || 'Executive'}</h1>
          <p>Here's your loan portfolio overview</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={<FileText />} label="My Files" value={stats.total} color="var(--blue)" />
        <StatCard icon={<Clock />} label="In-Process" value={stats.inProcess} color="var(--blue)" />
        <StatCard icon={<UserCheck />} label="Disbursement" value={stats.disbursement} color="var(--gold)" />
        <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} color="var(--primary)" />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Recent Assignments</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/executive/my-files')}>View All</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {recent.length === 0 ? (
            <p style={{ padding: '24px', textAlign: 'center', color: 'var(--gray)' }}>No loans assigned yet.</p>
          ) : (
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
          )}
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
