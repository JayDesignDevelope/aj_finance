import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  getLead, updateStage, setLabel, setOutcome, setCallback, addNote, logComm, getUser, unassignLead,
} from '../api/db';
import {
  PIPELINE, LABELS, CALL_OUTCOMES, REJECTION_REASONS, ACTIVITY, stageOf, labelOf,
} from '../data/constants';
import { StageBadge, money, initials, Toast } from '../components/ui';
import { IcBack, IcWhats, IcMail, IcSms, IcClock, IcPhone, LabelIcon, ActivityIcon } from '../components/icons';

export default function LeadDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [, force] = useState(0);
  const refresh = () => force((v) => v + 1);

  const lead = useMemo(() => getLead(user, id), [user, id]);
  const [toast, setToast] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [rejReason, setRejReason] = useState(REJECTION_REASONS[0]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  if (!lead) {
    return (
      <Layout title="Lead not found">
        <div className="card card-pad empty">
          This lead doesn't exist or isn't assigned to you.
          <div className="mt-16"><button className="btn btn-ghost" onClick={() => nav(-1)}>Go back</button></div>
        </div>
      </Layout>
    );
  }

  const phoneDigits = lead.phone.replace(/\D/g, '');
  const waLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg || `Hi ${lead.name.split(' ')[0]}, this is regarding your ${lead.product} enquiry with DSA Finance.`)}`;
  const mailLink = `mailto:${lead.email}?subject=${encodeURIComponent('Your ' + lead.product + ' enquiry — DSA Finance')}&body=${encodeURIComponent(msg || `Dear ${lead.name},\n\nThank you for your interest in our ${lead.product}.`)}`;
  const smsLink = `sms:${phoneDigits}?body=${encodeURIComponent(msg || `Hi ${lead.name.split(' ')[0]}, DSA Finance here regarding your ${lead.product} enquiry.`)}`;

  const contact = (channel, link, verb) => {
    logComm(user, lead.id, channel, `${verb} sent${msg ? ': ' + msg : ' (template)'}`);
    window.open(link, '_blank');
    setMsg(''); refresh(); flash(`${verb} opened & logged`);
  };

  const onStage = (key) => {
    if (key === 'rejected') { updateStage(user, lead.id, key, rejReason); }
    else updateStage(user, lead.id, key);
    refresh(); flash('Stage updated');
  };

  return (
    <Layout title={lead.name} subtitle={`${lead.product} · ${lead.city}`}
      actions={<button className="btn btn-ghost" onClick={() => nav(-1)}><IcBack width={16} height={16} /> Back</button>}>
      <Toast msg={toast} />

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* LEFT column */}
        <div>
          {/* Identity + contact */}
          <div className="card card-pad">
            <div className="between" style={{ alignItems: 'flex-start' }}>
              <div className="flex" style={{ alignItems: 'flex-start' }}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: 17, background: 'var(--navy)' }}>{initials(lead.name)}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{lead.name}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{lead.phone}{lead.email ? ' · ' + lead.email : ''}</div>
                  <div className="wrap-gap" style={{ marginTop: 10 }}>
                    <StageBadge stage={lead.stage} />
                    {lead.label && <span className="chip"><LabelIcon label={lead.label} /> {labelOf(lead.label)?.label}</span>}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{money(lead.amount)}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>requirement</div>
              </div>
            </div>

            <div className="grid cols-4 mt-16" style={{ gap: 10, fontSize: 12.5 }}>
              <div><div className="muted" style={{ fontSize: 11 }}>Income</div><div style={{ fontWeight: 700 }}>{money(lead.income)}/mo</div></div>
              <div><div className="muted" style={{ fontSize: 11 }}>Employment</div><div style={{ fontWeight: 700 }}>{lead.employment || '—'}</div></div>
              <div><div className="muted" style={{ fontSize: 11 }}>Source</div><div style={{ fontWeight: 700 }}>{lead.source}</div></div>
              <div><div className="muted" style={{ fontSize: 11 }}>Assigned</div><div style={{ fontWeight: 700 }}>{lead.assignedTo ? getUser(lead.assignedTo)?.name : 'Unassigned'}</div></div>
            </div>
          </div>

          {/* Contact client */}
          <div className="card mt-16">
            <div className="card-head"><span className="card-title">Contact Client</span>
              <span className="muted">WhatsApp · Email · SMS — auto-logged</span></div>
            <div className="card-pad">
              <textarea className="textarea" placeholder="Custom message (leave blank to use a template)…"
                value={msg} onChange={(e) => setMsg(e.target.value)} />
              <div className="wrap-gap mt-16">
                <button className="btn btn-wa" onClick={() => contact(ACTIVITY.WHATSAPP, waLink, 'WhatsApp')}><IcWhats width={16} height={16} /> WhatsApp</button>
                <button className="btn btn-email" onClick={() => contact(ACTIVITY.EMAIL, mailLink, 'Email')} disabled={!lead.email}><IcMail width={16} height={16} /> Email</button>
                <button className="btn btn-sms" onClick={() => contact(ACTIVITY.SMS, smsLink, 'SMS')}><IcSms width={16} height={16} /> SMS</button>
                <a className="btn btn-ghost" href={`tel:${phoneDigits}`}><IcPhone width={16} height={16} /> Call</a>
              </div>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="card mt-16">
            <div className="card-head"><span className="card-title">Activity Timeline</span>
              <span className="muted">{lead.activity.length} events</span></div>
            <div className="card-pad" style={{ paddingTop: 4, paddingBottom: 6 }}>
              {lead.activity.map((act) => {
                const who = act.by === 'system' ? 'System' : (getUser(act.by)?.name || 'User');
                return (
                  <div className="tl-item" key={act.id}>
                    <div className="tl-dot" style={{ background: 'var(--bg)', color: 'var(--navy)' }}><ActivityIcon type={act.type} /></div>
                    <div style={{ flex: 1 }}>
                      <div className="tl-text">{act.text}</div>
                      <div className="tl-meta">{who} · {new Date(act.at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT column — actions */}
        <div>
          {/* Call outcome */}
          <div className="card card-pad">
            <div className="card-title" style={{ marginBottom: 12 }}>Call Outcome</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CALL_OUTCOMES.map((o) => (
                <button key={o} className={'btn btn-sm ' + (lead.lastOutcome === o ? 'btn-primary' : 'btn-ghost')}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => { setOutcome(user, lead.id, o); refresh(); flash('Outcome logged'); }}>{o}</button>
              ))}
            </div>
          </div>

          {/* Pipeline stage */}
          <div className="card card-pad mt-16">
            <div className="card-title" style={{ marginBottom: 12 }}>Pipeline Stage</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PIPELINE.map((s) => (
                <button key={s.key} onClick={() => onStage(s.key)}
                  className="btn btn-sm" style={{
                    justifyContent: 'flex-start',
                    background: lead.stage === s.key ? s.color : '#fff',
                    color: lead.stage === s.key ? '#fff' : 'var(--text)',
                    border: '1px solid ' + (lead.stage === s.key ? s.color : 'var(--line)'),
                  }}>
                  <span style={{ width: 7, height: 7, borderRadius: 7, background: lead.stage === s.key ? '#fff' : s.color }} />{s.label}
                </button>
              ))}
            </div>
            {lead.stage === 'rejected' && (
              <div className="field mt-16">
                <label>Rejection reason</label>
                <select className="select" value={lead.rejectionReason || rejReason}
                  onChange={(e) => { setRejReason(e.target.value); updateStage(user, lead.id, 'rejected', e.target.value); refresh(); }}>
                  {REJECTION_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="card card-pad mt-16">
            <div className="card-title" style={{ marginBottom: 12 }}>Label</div>
            <div className="wrap-gap">
              {LABELS.map((l) => (
                <button key={l.key} className="btn btn-sm"
                  onClick={() => { setLabel(user, lead.id, lead.label === l.key ? null : l.key); refresh(); flash('Label updated'); }}
                  style={{
                    background: lead.label === l.key ? l.color : '#fff',
                    color: lead.label === l.key ? '#fff' : 'var(--text)',
                    border: '1px solid ' + (lead.label === l.key ? l.color : 'var(--line)'),
                  }}><LabelIcon label={l.key} /> {l.label}</button>
              ))}
            </div>
          </div>

          {/* Callback */}
          <div className="card card-pad mt-16">
            <div className="card-title" style={{ marginBottom: 12 }}>Callback Reminder</div>
            <div className="flex">
              <input className="input" type="datetime-local"
                onChange={(e) => { if (e.target.value) { setCallback(user, lead.id, e.target.value); refresh(); flash('Callback set'); } }} />
            </div>
            {lead.callback && <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: 'var(--green-600)' }}>
              <IcClock width={14} height={14} style={{ verticalAlign: -2 }} /> {new Date(lead.callback).toLocaleString('en-IN')}</div>}
          </div>

          {/* Notes */}
          <div className="card card-pad mt-16">
            <div className="card-title" style={{ marginBottom: 12 }}>Add Note</div>
            <textarea className="textarea" placeholder="Write a call note…" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn btn-primary mt-16" style={{ width: '100%' }}
              onClick={() => { if (note.trim()) { addNote(user, lead.id, note); setNote(''); refresh(); flash('Note added'); } }}>Save note</button>
          </div>

          {user.role === 'admin' && lead.assignedTo && (
            <button className="btn btn-ghost mt-16" style={{ width: '100%' }}
              onClick={() => { unassignLead(user, lead.id); refresh(); flash('Pulled back to pool'); }}>Pull back to pool</button>
          )}
        </div>
      </div>
    </Layout>
  );
}
