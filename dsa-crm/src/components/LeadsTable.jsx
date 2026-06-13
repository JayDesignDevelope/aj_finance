import { useNavigate } from 'react-router-dom';
import { StageBadge, LabelChip, money } from './ui';
import { getUser } from '../api/db';
import { IcInbox } from './icons';

export default function LeadsTable({ leads, showAgent = false, emptyText = 'No leads found' }) {
  const nav = useNavigate();
  if (!leads.length) {
    return <div className="empty"><IcInbox /><div>{emptyText}</div></div>;
  }
  return (
    <div className="table-wrap">
      <table className="dt">
        <thead>
          <tr>
            <th>Lead</th><th>Product</th><th>Amount</th><th>Stage</th><th>Label</th>
            {showAgent && <th>Assigned To</th>}<th>Source</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} onClick={() => nav('/leads/' + l.id)}>
              <td>
                <div className="cell-name">{l.name}</div>
                <div className="cell-sub">{l.phone} · {l.city}</div>
              </td>
              <td>{l.product}</td>
              <td style={{ fontWeight: 700 }}>{money(l.amount)}</td>
              <td><StageBadge stage={l.stage} /></td>
              <td><LabelChip label={l.label} /></td>
              {showAgent && <td>{l.assignedTo ? (getUser(l.assignedTo)?.name || '—')
                : <span className="chip">Unassigned</span>}</td>}
              <td><span className="cell-sub">{l.source}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
