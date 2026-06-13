import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { analytics } from '../../api/db';
import { PIPELINE, LABELS, labelOf, DAILY_TARGET } from '../../data/constants';
import { StatCard, money } from '../../components/ui';
import { IcLeads, IcCheck, IcChart, IcTarget, LabelIcon } from '../../components/icons';

export default function AdminDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const a = useMemo(() => analytics(), []);

  const stageData = PIPELINE.map((s) => ({ name: s.label, short: s.label.split(' ')[0], value: a.byStage[s.key] || 0, color: s.color }));
  const reasonData = Object.entries(a.byReason).map(([name, value]) => ({ name, value }));
  const sourceData = Object.entries(a.bySource).map(([name, value]) => ({ name, value }));
  const labelData = LABELS.map((l) => ({ name: l.label, value: a.byLabel[l.key] || 0, color: l.color })).filter((d) => d.value);

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#0ea5e9', '#10b981', '#00d09c', '#ec4899', '#64748b'];

  return (
    <Layout title="Dashboard" subtitle="Live overview of leads, pipeline & agent performance"
      actions={<button className="btn btn-green" onClick={() => nav('/admin/assign')}>Assign Leads</button>}>

      <div className="grid cols-4">
        <StatCard icon={<IcLeads />} value={a.total} label="Total Leads" accent="#1b3a6b"
          foot={`${a.byStage.captured || 0} new in pool`} footColor="var(--text-2)" />
        <StatCard icon={<IcCheck />} value={a.closed} label="Deals Closed / Disbursed" accent="#00d09c"
          foot={`${a.conversion}% conversion`} />
        <StatCard icon={<IcChart />} value={(a.byStage.processing || 0) + (a.byStage.submitted || 0) + (a.byStage.approved || 0)}
          label="In Bank Pipeline" accent="#f59e0b" foot="submitted → approved" footColor="var(--warn)" />
        <StatCard icon={<IcTarget />} value={a.agents.filter((g) => g.callsToday >= DAILY_TARGET).length + '/' + a.agents.length}
          label="Agents Hitting Target" accent="#8b5cf6" foot={`${DAILY_TARGET} calls/day each`} footColor="var(--text-2)" />
      </div>

      <div className="grid cols-2 mt-20">
        <div className="card">
          <div className="card-head"><span className="card-title">Leads by Pipeline Stage</span></div>
          <div className="card-pad" style={{ height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 6, right: 8, left: -18, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f7" />
                <XAxis dataKey="short" tick={{ fontSize: 10.5, fill: '#93a0b5' }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#93a0b5' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f4f6fb' }} contentStyle={{ borderRadius: 10, border: '1px solid #e6eaf2', fontSize: 12 }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {stageData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Leads Captured — Last 14 Days</span></div>
          <div className="card-pad" style={{ height: 290 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={a.overTime} margin={{ top: 6, right: 12, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f7" />
                <XAxis dataKey="day" tick={{ fontSize: 10.5, fill: '#93a0b5' }} />
                <YAxis tick={{ fontSize: 11, fill: '#93a0b5' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6eaf2', fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#00d09c" strokeWidth={2.5}
                  dot={{ r: 3, fill: '#00d09c' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid cols-3 mt-20">
        <div className="card">
          <div className="card-head"><span className="card-title">Rejection Reasons</span></div>
          <div className="card-pad" style={{ height: 240 }}>
            {reasonData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reasonData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78} innerRadius={44}>
                    {reasonData.map((d, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6eaf2', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="empty">No rejections yet</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Lead Source</span></div>
          <div className="card-pad" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78}>
                  {sourceData.map((d, i) => <Cell key={i} fill={PIE_COLORS[(i + 3) % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6eaf2', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Lead Temperature</span></div>
          <div className="card-pad">
            {labelData.length ? labelData.map((l) => {
              const lo = LABELS.find((x) => x.label === l.name);
              const pct = Math.round((l.value / a.total) * 100);
              return (
                <div key={l.name} style={{ marginBottom: 13 }}>
                  <div className="between" style={{ marginBottom: 5 }}>
                    <span className="flex" style={{ gap: 6, fontSize: 12.5, fontWeight: 700, color: l.color }}>
                      <LabelIcon label={lo?.key} /> <span style={{ color: 'var(--text)' }}>{l.name}</span></span>
                    <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 700 }}>{l.value}</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: pct + '%', background: l.color }} /></div>
                </div>
              );
            }) : <div className="empty">No labels yet</div>}
          </div>
        </div>
      </div>

      {/* Per-agent performance */}
      <div className="card mt-20">
        <div className="card-head"><span className="card-title">Telecaller Performance</span>
          <span className="muted">Daily target: {DAILY_TARGET} calls/agent</span></div>
        <div className="table-wrap">
          <table className="dt">
            <thead><tr><th>Telecaller</th><th>Assigned</th><th>Calls Today</th><th>Target Progress</th><th>Conversions</th><th>Status</th></tr></thead>
            <tbody>
              {a.agents.map((g) => {
                const pct = Math.min(100, Math.round((g.callsToday / g.target) * 100));
                return (
                  <tr key={g.id} onClick={() => nav('/admin/leads?assignedTo=' + g.id)}>
                    <td className="cell-name">{g.name}</td>
                    <td>{g.assigned}</td>
                    <td>{g.callsToday} / {g.target}</td>
                    <td style={{ minWidth: 160 }}>
                      <div className="progress-track"><div className="progress-fill"
                        style={{ width: pct + '%', background: g.callsToday >= g.target ? 'var(--green)' : 'var(--warn)' }} /></div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--green-600)' }}>{g.conversions}</td>
                    <td>{g.callsToday >= g.target
                      ? <span className="badge" style={{ background: 'rgba(0,208,156,.13)', color: 'var(--green-600)' }}>On target</span>
                      : <span className="badge" style={{ background: 'rgba(245,158,11,.13)', color: 'var(--warn)' }}>Below target</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
