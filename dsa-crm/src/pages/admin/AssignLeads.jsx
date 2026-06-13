import { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { unassignedPool, getAgents, assignLeads } from '../../api/db';
import { money, Toast, StageBadge } from '../../components/ui';
import { IcAssign, IcInbox } from '../../components/icons';

export default function AssignLeads() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const pool = useMemo(() => unassignedPool(user), [user, version]);
  const agents = useMemo(() => getAgents().filter((a) => a.active), []);

  const [picked, setPicked] = useState(() => new Set());
  const [target, setTarget] = useState(agents[0]?.id || '');
  const [toast, setToast] = useState('');

  const toggle = (id) => {
    setPicked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const pickFirst = (n) => setPicked(new Set(pool.slice(0, n).map((l) => l.id)));
  const clear = () => setPicked(new Set());

  const assign = () => {
    if (!picked.size || !target) return;
    const ids = [...picked];
    assignLeads(user, ids, target);
    const name = agents.find((a) => a.id === target)?.name;
    setToast(`Assigned ${ids.length} lead${ids.length > 1 ? 's' : ''} to ${name}`);
    setPicked(new Set());
    setVersion((v) => v + 1);
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <Layout title="Assign Leads" subtitle="Distribute a controlled daily batch (10–20 numbers) to each telecaller">
      <Toast msg={toast} />

      <div className="card" style={{ position: 'sticky', top: 70, zIndex: 10 }}>
        <div className="card-pad">
          <div className="between" style={{ flexWrap: 'wrap', gap: 14 }}>
            <div className="wrap-gap" style={{ alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>{picked.size}</span>
              <span className="muted" style={{ fontSize: 13 }}>selected</span>
              <button className="btn btn-ghost btn-sm" onClick={() => pickFirst(10)}>Pick 10</button>
              <button className="btn btn-ghost btn-sm" onClick={() => pickFirst(20)}>Pick 20</button>
              {picked.size > 0 && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>}
            </div>
            <div className="wrap-gap" style={{ alignItems: 'center' }}>
              <select className="select" style={{ width: 200 }} value={target} onChange={(e) => setTarget(e.target.value)}>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <button className="btn btn-green" disabled={!picked.size || !target} onClick={assign}>
                <IcAssign width={16} height={16} /> Assign batch
              </button>
            </div>
          </div>
          {picked.size > 20 && <div style={{ fontSize: 12, color: 'var(--warn)', fontWeight: 700, marginTop: 10 }}>
            Tip: the spec recommends 10–20 numbers per telecaller per day.</div>}
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-head"><span className="card-title">Unassigned Pool</span>
          <span className="muted">{pool.length} available leads</span></div>
        {pool.length === 0 ? (
          <div className="empty"><IcInbox /><div>Pool is empty — every lead is assigned. Import more or capture from the website.</div></div>
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr>
                <th style={{ width: 40 }}><input type="checkbox"
                  checked={picked.size === pool.length && pool.length > 0}
                  onChange={(e) => setPicked(e.target.checked ? new Set(pool.map((l) => l.id)) : new Set())} /></th>
                <th>Lead</th><th>Product</th><th>Amount</th><th>City</th><th>Stage</th><th>Source</th>
              </tr></thead>
              <tbody>
                {pool.map((l) => (
                  <tr key={l.id} onClick={() => toggle(l.id)} style={picked.has(l.id) ? { background: 'rgba(0,208,156,.07)' } : {}}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={picked.has(l.id)} onChange={() => toggle(l.id)} /></td>
                    <td><div className="cell-name">{l.name}</div><div className="cell-sub">{l.phone}</div></td>
                    <td>{l.product}</td>
                    <td style={{ fontWeight: 700 }}>{money(l.amount)}</td>
                    <td>{l.city}</td>
                    <td><StageBadge stage={l.stage} /></td>
                    <td><span className="cell-sub">{l.source}</span></td>
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
