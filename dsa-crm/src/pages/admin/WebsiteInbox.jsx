import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { websiteLeads, getUser } from '../../api/db';
import { StageBadge, money } from '../../components/ui';
import { IcGlobe, IcInbox } from '../../components/icons';

// Real-time-ish inbox: polls the store so new website captures appear live.
export default function WebsiteInbox() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [leads, setLeads] = useState(() => websiteLeads(user));
  const prevCount = useRef(leads.length);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const fresh = websiteLeads(user);
      if (fresh.length !== prevCount.current) {
        if (fresh.length > prevCount.current) { setFlash(true); setTimeout(() => setFlash(false), 1500); }
        prevCount.current = fresh.length;
        setLeads(fresh);
      }
    }, 1500);
    return () => clearInterval(t);
  }, [user]);

  const capturePath = window.location.origin + '/capture';

  return (
    <Layout title="Website Leads" subtitle="Live inbox — leads captured from the public website form"
      actions={<a className="btn btn-ghost" href="/capture" target="_blank" rel="noreferrer"><IcGlobe width={16} height={16} /> Open capture form</a>}>

      <div className="card card-pad" style={{ background: 'linear-gradient(135deg,#eef4ff,#fff)' }}>
        <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="card-title">Embed the capture form on your website</div>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Paste this snippet on WordPress, Wix, or any landing page. Submissions land here instantly.</p>
          </div>
          <code style={{ fontSize: 11.5, background: '#0b1626', color: '#7ee7c9', padding: '8px 12px', borderRadius: 8, fontWeight: 700 }}>
            &lt;iframe src="{capturePath}" width="480" height="640"&gt;&lt;/iframe&gt;
          </code>
        </div>
      </div>

      <div className="card mt-16" style={flash ? { boxShadow: '0 0 0 2px var(--green)' } : {}}>
        <div className="card-head"><span className="card-title">Incoming Website Leads</span>
          <span className="badge" style={{ background: 'rgba(0,208,156,.13)', color: 'var(--green-600)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: 'var(--green)' }} /> Live</span>
          <span className="muted" style={{ marginLeft: 'auto' }}>{leads.length} total</span></div>
        {leads.length === 0 ? (
          <div className="empty"><IcInbox /><div>No website leads yet. Open the capture form and submit a test enquiry.</div></div>
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Lead</th><th>Product</th><th>Amount</th><th>Captured</th><th>Stage</th><th>Assigned</th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} onClick={() => nav('/leads/' + l.id)}>
                    <td><div className="cell-name">{l.name}</div><div className="cell-sub">{l.phone}{l.city ? ' · ' + l.city : ''}</div></td>
                    <td>{l.product}</td>
                    <td style={{ fontWeight: 700 }}>{money(l.amount)}</td>
                    <td className="cell-sub">{new Date(l.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td><StageBadge stage={l.stage} /></td>
                    <td>{l.assignedTo ? getUser(l.assignedTo)?.name : <span className="chip">Unassigned</span>}</td>
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
