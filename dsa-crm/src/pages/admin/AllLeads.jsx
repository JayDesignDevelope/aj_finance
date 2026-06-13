import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import LeadsTable from '../../components/LeadsTable';
import { useAuth } from '../../context/AuthContext';
import { listLeads, getAgents } from '../../api/db';
import { PIPELINE, LABELS } from '../../data/constants';
import { IcSearch } from '../../components/icons';

export default function AllLeads() {
  const { user } = useAuth();
  const [sp, setSp] = useSearchParams();
  const agents = useMemo(() => getAgents(), []);

  const [q, setQ] = useState('');
  const [stage, setStage] = useState('');
  const [label, setLabel] = useState('');
  const [assignedTo, setAssignedTo] = useState(sp.get('assignedTo') || '');

  const leads = useMemo(() => {
    const f = {};
    if (q) f.q = q;
    if (stage) f.stage = stage;
    if (label) f.label = label;
    if (assignedTo) f.assignedTo = assignedTo === 'none' ? null : assignedTo;
    return listLeads(user, f);
  }, [user, q, stage, label, assignedTo]);

  return (
    <Layout title="All Leads" subtitle={`${leads.length} leads in view — full database access`}>
      <div className="card">
        <div className="card-pad">
          <div className="wrap-gap">
            <div style={{ position: 'relative', flex: 2, minWidth: 220 }}>
              <IcSearch width={16} height={16} style={{ position: 'absolute', left: 11, top: 11, stroke: 'var(--text-3)' }} />
              <input className="input" style={{ paddingLeft: 34 }} placeholder="Search name, phone, email, city…"
                value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="select" style={{ flex: 1, minWidth: 150 }} value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="">All stages</option>
              {PIPELINE.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select className="select" style={{ flex: 1, minWidth: 130 }} value={label} onChange={(e) => setLabel(e.target.value)}>
              <option value="">All labels</option>
              {LABELS.map((l) => <option key={l.key} value={l.key}>{l.icon} {l.label}</option>)}
            </select>
            <select className="select" style={{ flex: 1, minWidth: 150 }} value={assignedTo}
              onChange={(e) => { setAssignedTo(e.target.value); setSp(e.target.value ? { assignedTo: e.target.value } : {}); }}>
              <option value="">All agents</option>
              <option value="none">Unassigned</option>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card mt-16">
        <LeadsTable leads={leads} showAgent />
      </div>
    </Layout>
  );
}
