import { useState } from 'react';
import { addDoc, removeDoc, matchLenders } from '../api/db';
import { DOC_TYPES, BANKS } from '../data/constants';
import { money } from './ui';
import { IcUpload, IcFile, IcX, IcBank, IcCalc, IcCheck } from './icons';

// ── Document upload panel (spec §9) ───────────────────────────────
export function DocsPanel({ user, lead, refresh, flash }) {
  const [type, setType] = useState(DOC_TYPES[0]);
  const onFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 3 * 1024 * 1024) { flash('File too large (max 3MB in demo)'); return; }
    const r = new FileReader();
    r.onload = () => { addDoc(user, lead.id, { name: file.name, type, size: file.size, dataUrl: r.result }); refresh(); flash('Document uploaded'); };
    r.readAsDataURL(file);
  };
  const docs = lead.docs || [];
  return (
    <div className="card card-pad mt-16">
      <div className="card-title" style={{ marginBottom: 12 }}>Documents ({docs.length})</div>
      <div className="flex" style={{ gap: 8 }}>
        <select className="select" style={{ flex: 1 }} value={type} onChange={(e) => setType(e.target.value)}>
          {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
        </select>
        <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <IcUpload width={15} height={15} /> Upload<input type="file" hidden onChange={onFile} /></label>
      </div>
      <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {docs.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>No documents uploaded yet.</div>}
        {docs.map((d) => (
          <div className="between" key={d.id} style={{ padding: '8px 10px', background: 'var(--bg)', borderRadius: 8 }}>
            <a className="flex" href={d.dataUrl} download={d.name} style={{ gap: 8, fontSize: 12.5, fontWeight: 600 }}>
              <IcFile width={15} height={15} style={{ stroke: 'var(--navy)' }} />
              <span>{d.type} <span className="muted">· {(d.size / 1024).toFixed(0)} KB</span></span>
            </a>
            <button className="btn btn-ghost btn-sm" style={{ padding: 5 }} onClick={() => { removeDoc(user, lead.id, d.id); refresh(); }}><IcX width={13} height={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Matching lenders (spec §9 product catalog) ────────────────────
export function MatchingLenders({ lead }) {
  const matches = matchLenders(lead, BANKS);
  return (
    <div className="card card-pad mt-16">
      <div className="flex" style={{ gap: 7, marginBottom: 12 }}><IcBank width={16} height={16} style={{ stroke: 'var(--navy)' }} /><span className="card-title">Matching Lenders ({matches.length})</span></div>
      {matches.length === 0 ? <div className="muted" style={{ fontSize: 12.5 }}>No lenders match this profile (product / income / CIBIL / amount).</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {matches.map((b) => (
            <div className="between" key={b.id} style={{ padding: '9px 11px', background: 'var(--bg)', borderRadius: 8 }}>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div><div className="muted" style={{ fontSize: 11 }}>from {b.roi} · max {money(b.maxAmount)}</div></div>
              <span className="badge" style={{ background: 'rgba(0,208,156,.13)', color: 'var(--green-600)' }}><IcCheck width={12} height={12} /> Eligible</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── EMI / eligibility calculator (spec §9) ────────────────────────
export function EligibilityCalc({ lead }) {
  const [amount, setAmount] = useState(lead.amount || 1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(15);
  const [income, setIncome] = useState(lead.income || 60000);

  const n = years * 12;
  const r = rate / 12 / 100;
  const emi = r > 0 ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amount / n;
  const foir = income ? Math.round((emi / income) * 100) : 0;
  // simple eligibility: lender comfort at ~50% FOIR
  const maxEmi = income * 0.5;
  const eligible = r > 0 ? (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : maxEmi * n;

  const Field = ({ label, val, set, suffix }) => (
    <div className="field" style={{ marginBottom: 10 }}>
      <label>{label}</label>
      <input className="input" type="number" value={val} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );

  return (
    <div className="card card-pad mt-16">
      <div className="flex" style={{ gap: 7, marginBottom: 12 }}><IcCalc width={16} height={16} style={{ stroke: 'var(--navy)' }} /><span className="card-title">EMI &amp; Eligibility</span></div>
      <div className="row">
        <Field label="Loan amount" val={amount} set={setAmount} />
        <Field label="Interest %" val={rate} set={setRate} />
      </div>
      <div className="row">
        <Field label="Tenure (yrs)" val={years} set={setYears} />
        <Field label="Monthly income" val={income} set={setIncome} />
      </div>
      <div className="grid cols-3 mt-16" style={{ gap: 8, textAlign: 'center' }}>
        <div><div style={{ fontSize: 18, fontWeight: 800 }}>{money(Math.round(emi))}</div><div className="muted" style={{ fontSize: 10.5 }}>Monthly EMI</div></div>
        <div><div style={{ fontSize: 18, fontWeight: 800, color: foir > 50 ? 'var(--danger)' : 'var(--green-600)' }}>{foir}%</div><div className="muted" style={{ fontSize: 10.5 }}>FOIR</div></div>
        <div><div style={{ fontSize: 18, fontWeight: 800 }}>{money(Math.round(eligible))}</div><div className="muted" style={{ fontSize: 10.5 }}>Max eligible</div></div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11.5, fontWeight: 700, color: foir > 50 ? 'var(--danger)' : 'var(--green-600)' }}>
        {foir > 50 ? 'FOIR high — reduce amount or extend tenure' : 'Healthy FOIR — strong eligibility'}
      </div>
    </div>
  );
}
