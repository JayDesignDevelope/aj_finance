import { useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import { store } from '../../utils/mockData';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#5367ff', '#f5a623', '#00d09c', '#eb5b3c', '#8b5cf6'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function MktReports() {
  const customers = store.get('crm_customers');
  const loans = store.get('crm_loans');

  const stats = useMemo(() => {
    const byType = {};
    loans.forEach(l => { byType[l.loanType] = (byType[l.loanType] || 0) + 1; });
    const loanTypeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

    const statusData = [
      { name: 'In-Process', value: loans.filter(l => l.status === 'In-Process').length },
      { name: 'Disbursement', value: loans.filter(l => l.status === 'Is-Disbursement').length },
      { name: 'Completed', value: loans.filter(l => l.status === 'Completed').length },
      { name: 'Rejected', value: loans.filter(l => l.status === 'Rejected').length },
    ];

    const monthlyData = MONTHS.map((m, i) => ({
      month: m,
      customers: [3, 5, 4, 7, 5, customers.length][i] || 0,
      loans: [8, 12, 9, 15, 11, loans.length][i] || 0,
    }));

    const cityMap = {};
    customers.forEach(c => { if (c.city) cityMap[c.city] = (cityMap[c.city] || 0) + 1; });
    const cityData = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));

    return { loanTypeData, statusData, monthlyData, cityData };
  }, [customers, loans]);

  const exportReport = () => {
    const lines = [
      'AJ Finance CRM — Marketing Report',
      `Generated: ${new Date().toLocaleDateString('en-IN')}`,
      '',
      `Total Customers,${customers.length}`,
      `Active Customers,${customers.filter(c => c.status === 'Active').length}`,
      `Total Loans,${loans.length}`,
      `Completed Loans,${loans.filter(l => l.status === 'Completed').length}`,
    ];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = 'marketing_report.csv'; a.click();
  };

  return (
    <Layout title="Reports">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Marketing Reports</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={exportReport}><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Loans by Product</div>
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

        <div className="chart-card">
          <div className="chart-title">Loan Status Mix</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.statusData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {stats.statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Monthly Growth</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="loans" stroke="#5367ff" strokeWidth={2.5} name="Loans" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="customers" stroke="#00d09c" strokeWidth={2.5} name="Customers" dot={{ r: 3 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Customers by City</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.cityData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: 'var(--gray)' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {stats.cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
