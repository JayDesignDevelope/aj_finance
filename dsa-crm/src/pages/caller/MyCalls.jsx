import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { listLeads, callerProgress } from '../../api/db';
import { StageBadge, LabelChip, money, StatCard } from '../../components/ui';
import { ACTIVITY, DAILY_TARGET } from '../../data/constants';
import { IcPhone, IcCheck, IcClock, IcInbox } from '../../components/icons';

const calledToday = (l) => (l.activity || []).some(
  (a) => a.type === ACTIVITY.OUTCOME && a.at.slice(0, 10) === new Date().toISOString().slice(0, 10));

export default function MyCalls() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all'); // all | pending | done | callback
  const leads = useMemo(() => listLeads(user), [user]);
  const prog = useMemo(() => callerProgress(user), [user]);

  const pending = leads.filter((l) => !calledToday(l));
  const done = leads.filter((l) => calledToday(l));
  const callbacks = leads.filter((l) => l.callback);

  const view = filter === 'pending' ? pending : filter === 'done' ? done : filter === 'callback' ? callbacks : leads;

  return (
    <Layout title="My Calls Today" subtitle="Only the leads assigned to you — work through your daily batch">
      <div className="grid cols-4">
        <StatCard icon={<IcPhone />} value={leads.length} label="Assigned to me" accent="#1b3a6b" />
        <StatCard icon={<IcCheck />} value={prog.done} label="Called today" accent="#00d09c"
          foot={prog.done >= DAILY_TARGET ? '✓ Target met' : `${DAILY_TARGET - prog.done} to target`}
          footColor={prog.done >= DAILY_TARGET ? 'var(--green-600)' : 'var(--warn)'} />
        <StatCard icon={<IcClock />} value={pending.length} label="Still to call" accent="#f59e0b" />
        <StatCard icon={<IcClock />} value={callbacks.length} label="Callbacks set" accent="#8b5cf6" />
      </div>

      <div className="card mt-20">
        <div className="card-head" style={{ gap: 8 }}>
          {[['all', 'All'], ['pending', `To Call (${pending.length})`], ['done', `Done (${done.length})`], ['callback', `Callbacks (${callbacks.length})`]].map(([k, lbl]) => (
            <button key={k} className={'btn btn-sm ' + (filter === k ? 'btn-primary' : 'btn-ghost')} onClick={() => setFilter(k)}>{lbl}</button>
          ))}
        </div>
        {view.length === 0 ? (
          <div className="empty"><IcInbox /><div>{leads.length === 0
            ? 'No leads assigned yet. Your manager will assign your daily batch.'
            : 'Nothing here in this filter.'}</div></div>
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Lead</th><th>Product</th><th>Amount</th><th>Stage</th><th>Label</th><th>Callback</th><th></th></tr></thead>
              <tbody>
                {view.map((l) => (
                  <tr key={l.id} onClick={() => nav('/leads/' + l.id)}>
                    <td>
                      <div className="cell-name">{calledToday(l) && <span style={{ color: 'var(--green)' }}>✓ </span>}{l.name}</div>
                      <div className="cell-sub">{l.phone} · {l.city}</div>
                    </td>
                    <td>{l.product}</td>
                    <td style={{ fontWeight: 700 }}>{money(l.amount)}</td>
                    <td><StageBadge stage={l.stage} /></td>
                    <td><LabelChip label={l.label} /></td>
                    <td>{l.callback ? <span className="chip">{new Date(l.callback).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span> : <span className="muted" style={{ fontSize: 12 }}>—</span>}</td>
                    <td><button className="btn btn-green btn-sm" onClick={(e) => { e.stopPropagation(); nav('/leads/' + l.id); }}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
