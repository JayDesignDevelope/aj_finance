import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { auditLog } from '../../api/db';
import { ActivityIcon, IcList } from '../../components/icons';

// Role-based audit log (spec §9): who changed what, when — across all leads.
export default function AuditLog() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const rows = useMemo(() => auditLog(user, 400), [user]);
  const view = q ? rows.filter((r) => (r.text + r.who + r.leadName).toLowerCase().includes(q.toLowerCase())) : rows;

  return (
    <Layout title="Audit Log" subtitle="Every change across the system — actor, action, and timestamp">
      <div className="card">
        <div className="card-head"><IcList width={16} height={16} /><span className="card-title">Activity Trail</span>
          <input className="input" style={{ marginLeft: 'auto', maxWidth: 260 }} placeholder="Filter by lead, agent, action…"
            value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="table-wrap">
          <table className="dt">
            <thead><tr><th></th><th>Action</th><th>Lead</th><th>By</th><th>When</th></tr></thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id} onClick={() => nav('/leads/' + r.leadId)}>
                  <td style={{ width: 36, color: 'var(--navy)' }}><ActivityIcon type={r.type} /></td>
                  <td style={{ fontWeight: 600 }}>{r.text}</td>
                  <td className="cell-sub">{r.leadName}</td>
                  <td><span className="chip">{r.who}</span></td>
                  <td className="cell-sub">{new Date(r.at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
