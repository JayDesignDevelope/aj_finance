import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Users, TrendingUp, Target, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#5367ff', '#f5a623', '#00d09c', '#eb5b3c', '#8b5cf6'];

export default function MktDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const customers = store.get('crm_customers');
  const loans = store.get('crm_loans');

  const stats = useMemo(() => {
    const byType = {};
    loans.forEach(l => { byType[l.loanType] = (byType[l.loanType] || 0) + 1; });
    const loanTypeData = Object.entries(byType).map(([name, value]) => ({ name, value }));
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const conversionRate = customers.length ? ((loans.filter(l => l.status === 'Completed').length / customers.length) * 100).toFixed(1) : 0;
    return { loanTypeData, activeCustomers, conversionRate, totalCustomers: customers.length };
  }, [customers, loans]);

  return (
    <Layout title="Dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Marketing Dashboard</h1>
          <p>Performance overview & analytics</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard icon={<Users />} label="Total Customers" value={stats.totalCustomers} color="var(--blue)" />
        <StatCard icon={<TrendingUp />} label="Active Customers" value={stats.activeCustomers} color="var(--primary)" />
        <StatCard icon={<Target />} label="Conversion Rate" value={`${stats.conversionRate}%`} color="var(--gold)" />
        <StatCard icon={<BarChart2 />} label="Loan Products" value={stats.loanTypeData.length} color="var(--purple)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <div className="chart-card">
          <div className="chart-title">Loans by Product Type</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.loanTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {stats.loanTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Quick Links</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <NavLink label="View All Leads" sub="Customer database" onClick={() => navigate('/marketing/leads')} />
            <NavLink label="Reports" sub="Analytics & insights" onClick={() => navigate('/marketing/reports')} />
          </div>
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

function NavLink({ label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px',
      background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', width: '100%',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--gray)' }}>{sub}</span>
    </button>
  );
}
