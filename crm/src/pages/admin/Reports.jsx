import { useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { Download, TrendingUp, FileText, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid, LineChart, Line } from 'recharts';

const COLORS = ['#5367ff', '#f5a623', '#00d09c', '#eb5b3c', '#8b5cf6'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function Reports() {
  const loans = store.get('crm_loans');
  const customers = store.get('crm_customers');
  const commissions = store.get('crm_commissions');

  const stats = useMemo(() => {
    const byType = {};
    loans.forEach(l => { byType[l.loanType] = (byType[l.loanType] || 0) + 1; });
    const loanTypeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

    const byStatus = [
      { name: 'In-Process', value: loans.filter(l => l.status === 'In-Process').length },
      { name: 'Disbursement', value: loans.filter(l => l.status === 'Is-Disbursement').length },
      { name: 'Completed', value: loans.filter(l => l.status === 'Completed').length },
      { name: 'Rejected', value: loans.filter(l => l.status === 'Rejected').length },
    ];

    const monthlyLoans = MONTHS.map((m, i) => ({ month: m, loans: [8, 12, 9, 15, 11, loans.length][i] || 0 }));

    const totalLoanAmt = loans.reduce((s, l) => s + Number(l.amount), 0);
    const totalComm = commissions.reduce((s, c) => s + c.commissionAmt, 0);
    const paidComm = commissions.filter(c => c.paymentStatus === 'Paid').reduce((s, c) => s + c.commissionAmt, 0);

    return { loanTypeData, byStatus, monthlyLoans, totalLoanAmt, totalComm, paidComm };
  }, [loans, commissions]);

  const exportReport = () => {
    const lines = [
      'AJ Finance CRM — Full Report',
      `Generated: ${new Date().toLocaleDateString('en-IN')}`,
      '',
      'LOAN SUMMARY',
      `Total Loans,${loans.length}`,
      `Total Loan Amount,₹${stats.totalLoanAmt.toLocaleString('en-IN')}`,
      `Completed,${loans.filter(l => l.status === 'Completed').length}`,
      `Rejected,${loans.filter(l => l.status === 'Rejected').length}`,
      '',
      'COMMISSION SUMMARY',
      `Total Commission,₹${stats.totalComm.toLocaleString('en-IN')}`,
      `Paid,₹${stats.paidComm.toLocaleString('en-IN')}`,
      `Pending,₹${(stats.totalComm - stats.paidComm).toLocaleString('en-IN')}`,
      '',
      'CUSTOMER SUMMARY',
      `Total Customers,${customers.length}`,
      `Active,${customers.filter(c => c.status === 'Active').length}`,
    ];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = 'aj_finance_report.csv'; a.click();
  };

  return (
    <Layout title="Reports">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports & Analytics</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={exportReport}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <KPI icon={<FileText />} label="Total Loans" value={loans.length} color="var(--blue)" />
        <KPI icon={<DollarSign />} label="Total Disbursed" value={`₹${(stats.totalLoanAmt / 100000).toFixed(1)}L`} color="var(--primary)" />
        <KPI icon={<TrendingUp />} label="Commission Earned" value={`₹${stats.totalComm.toLocaleString('en-IN')}`} color="var(--gold)" />
        <KPI icon={<Users />} label="Active Customers" value={customers.filter(c => c.status === 'Active').length} color="var(--purple)" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Loans by Type</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.loanTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {stats.loanTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Status Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.byStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {stats.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Monthly Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyLoans}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="loans" stroke="#5367ff" strokeWidth={2.5} dot={{ r: 4, fill: '#5367ff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Commission: Paid vs Pending</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[{ name: 'Paid', value: stats.paidComm }, { name: 'Pending', value: stats.totalComm - stats.paidComm }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--gray)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                <Cell fill="#00d09c" />
                <Cell fill="#f5a623" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}

function KPI({ icon, label, value, color }) {
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
