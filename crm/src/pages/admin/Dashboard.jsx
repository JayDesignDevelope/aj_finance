import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { FileText, Users, Building2, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#5367ff', '#f5a623', '#00d09c', '#eb5b3c'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const loans = store.get('crm_loans');
  const customers = store.get('crm_customers');
  const users = store.get('crm_users');
  const banks = store.get('crm_banks');
  const commissions = store.get('crm_commissions');
  const docs = store.get('crm_documents');

  const stats = useMemo(() => {
    const inProcess = loans.filter(l => l.status === 'In-Process').length;
    const disbursement = loans.filter(l => l.status === 'Is-Disbursement').length;
    const completed = loans.filter(l => l.status === 'Completed').length;
    const rejected = loans.filter(l => l.status === 'Rejected').length;
    const totalComm = commissions.reduce((s, c) => s + c.commissionAmt, 0);
    const paidComm = commissions.filter(c => c.paymentStatus === 'Paid').reduce((s, c) => s + c.commissionAmt, 0);
    return { total: loans.length, inProcess, disbursement, completed, rejected, totalComm, paidComm };
  }, [loans, commissions]);

  const statusData = [
    { name: 'In-Process', value: stats.inProcess },
    { name: 'Disbursement', value: stats.disbursement },
    { name: 'Completed', value: stats.completed },
    { name: 'Rejected', value: stats.rejected },
  ];

  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    loans: [8, 12, 9, 15, 11, loans.length][i] || 0,
    revenue: [120000, 185000, 140000, 230000, 175000, 310000][i] || 0,
  }));

  const completionRate = stats.total ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  return (
    <Layout title="Dashboard">
      {/* KPI Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <StatCard icon={<FileText />} label="Total Loans" value={stats.total} color="var(--blue)" trend="+12%" />
        <StatCard icon={<Clock />} label="In-Process" value={stats.inProcess} color="var(--blue)" trend="+5%" />
        <StatCard icon={<Banknote />} label="Disbursement" value={stats.disbursement} color="var(--gold)" />
        <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} color="var(--primary)" trend="+8%" />
        <StatCard icon={<XCircle />} label="Rejected" value={stats.rejected} color="var(--red)" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Loan Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Status Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">6-Month Loan Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5367ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5367ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="loans" stroke="#5367ff" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Revenue Performance (₹)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--gray)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#00d09c" strokeWidth={2.5} dot={{ r: 4, fill: '#00d09c' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Key Insights */}
        <div className="card">
          <div className="card-header"><span className="card-title">Key Insights</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Metric label="Completion Rate" value={`${completionRate}%`} color="var(--primary)" />
            <Metric label="Active Customers" value={customers.filter(c => c.status === 'Active').length} color="var(--blue)" />
            <Metric label="Bank Partners" value={`${banks.filter(b => b.status === 'Active').length} / ${banks.length}`} color="var(--gold)" />
            <Metric label="Verified Docs" value={store.get('crm_documents').filter(d => d.status === 'Verified').length} color="var(--primary)" />
          </div>
        </div>

        {/* Team Overview */}
        <div className="card">
          <div className="card-header"><span className="card-title">Team Overview</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Metric label="Total Users" value={users.length} color="var(--blue)" />
            <Metric label="Admins" value={users.filter(u => u.role === 'ADMIN').length} color="var(--purple)" />
            <Metric label="Data Operators" value={users.filter(u => u.role === 'DATA_OPERATOR').length} color="var(--blue)" />
            <Metric label="Bank Executives" value={users.filter(u => u.role === 'BANK_EXECUTIVE').length} color="var(--primary)" />
          </div>
        </div>

        {/* Commission */}
        <div className="card">
          <div className="card-header"><span className="card-title">Commission</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Metric label="Total Commission" value={`₹${stats.totalComm.toLocaleString('en-IN')}`} color="var(--primary)" />
            <Metric label="Paid" value={`₹${stats.paidComm.toLocaleString('en-IN')}`} color="var(--primary)" />
            <Metric label="Pending" value={`₹${(stats.totalComm - stats.paidComm).toLocaleString('en-IN')}`} color="var(--gold)" />
            <Metric label="Records" value={commissions.length} color="var(--blue)" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: `${color}18` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && <span className="stat-trend up">{trend}</span>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--gray)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
