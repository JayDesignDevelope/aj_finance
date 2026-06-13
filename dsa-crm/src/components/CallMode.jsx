import { useState, useEffect, useRef } from 'react';
import { logCall } from '../api/db';
import { CALL_OUTCOMES } from '../data/constants';
import { IcPhone, IcX } from './icons';

// Click-to-call with a live timer; logs call duration + outcome (spec §9).
export default function CallMode({ user, lead, onClose, onLogged }) {
  const [secs, setSecs] = useState(0);
  const [active, setActive] = useState(false);
  const [outcome, setOutcome] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    setActive(true);
    window.open('tel:' + lead.phone.replace(/\D/g, ''), '_self');
    timer.current = setInterval(() => setSecs((s) => s + 1), 1000);
  };
  const end = () => { clearInterval(timer.current); setActive(false); };
  const save = () => {
    logCall(user, lead.id, secs, outcome);
    onLogged && onLogged();
    onClose();
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,35,71,.55)', display: 'grid', placeItems: 'center', zIndex: 100 }} onClick={onClose}>
      <div className="card card-pad" style={{ width: 340, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="between" style={{ marginBottom: 6 }}>
          <span className="card-title">Call</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 6 }}><IcX width={15} height={15} /></button>
        </div>
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 20, margin: '6px auto 10px', background: active ? 'var(--green)' : 'var(--navy)' }}>
          <IcPhone width={24} height={24} style={{ stroke: '#fff' }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{lead.name}</div>
        <div className="muted" style={{ fontSize: 13 }}>{lead.phone}</div>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 1, margin: '14px 0', fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</div>

        {!active && secs === 0 && <button className="btn btn-green" style={{ width: '100%' }} onClick={start}><IcPhone width={16} height={16} /> Start call</button>}
        {active && <button className="btn" style={{ width: '100%', background: 'var(--danger)', color: '#fff' }} onClick={end}>End call</button>}

        {!active && secs > 0 && (
          <>
            <div className="field" style={{ textAlign: 'left', marginTop: 14 }}>
              <label>Outcome</label>
              <select className="select" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                <option value="">Select outcome…</option>
                {CALL_OUTCOMES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={save}>Log call ({mm}:{ss})</button>
          </>
        )}
      </div>
    </div>
  );
}
