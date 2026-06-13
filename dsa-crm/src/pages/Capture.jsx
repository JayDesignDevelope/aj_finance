import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { captureLead } from '../api/db';
import { PRODUCT_TYPES, EMPLOYMENT_TYPES } from '../data/constants';
import { IcCheck, IcGlobe } from '../components/icons';

// Public, embeddable lead-capture form (spec §5.1). No auth.
// Drop this route in an <iframe src=".../capture"> on any website.
export default function Capture({ embed = false }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', city: '', product: 'Home Loan', amount: '', income: '', employment: 'Salaried', notes: '', company: '' });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) gsap.fromTo(cardRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }, [done]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    if (f.company) return; // honeypot — bots fill hidden field
    const res = captureLead(f);
    if (!res.ok) { setErr(res.duplicate ? 'This mobile number is already registered with us.' : (res.error || 'Please check your details.')); return; }
    setDone(true);
  };

  const wrapStyle = embed ? { padding: 20 } : { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'radial-gradient(1200px 600px at 70% -10%, #25457c 0%, #0f2347 55%)' };

  if (done) {
    return (
      <div style={wrapStyle}>
        <div className="login-card" ref={cardRef} style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(0,208,156,.13)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <IcCheck width={30} height={30} style={{ stroke: 'var(--green-600)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Thank you{f.name ? ', ' + f.name.split(' ')[0] : ''}!</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
            Your enquiry for <strong>{f.product}</strong> has been received. A DSA Finance advisor will reach out shortly.
          </p>
          <button className="btn btn-ghost mt-20" onClick={() => { setF({ ...f, name: '', phone: '', email: '', amount: '', notes: '' }); setDone(false); }}>Submit another enquiry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div className="login-card" ref={cardRef} style={{ maxWidth: 480 }}>
        <div className="login-brand">
          <div className="brand-mark" style={{ width: 42, height: 42, fontSize: 21 }}>D</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Get a Free Loan Quote</div>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>DSA Finance · 25+ lenders, lowest rates</div>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="row">
            <div className="field"><label>Full Name *</label><input className="input" value={f.name} onChange={set('name')} placeholder="Your name" /></div>
            <div className="field"><label>Mobile *</label><input className="input" value={f.phone} onChange={set('phone')} placeholder="10-digit mobile" /></div>
          </div>
          <div className="row">
            <div className="field"><label>Email</label><input className="input" type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" /></div>
            <div className="field"><label>City</label><input className="input" value={f.city} onChange={set('city')} placeholder="City" /></div>
          </div>
          <div className="row">
            <div className="field"><label>Product</label>
              <select className="select" value={f.product} onChange={set('product')}>{PRODUCT_TYPES.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div className="field"><label>Loan Amount</label><input className="input" value={f.amount} onChange={set('amount')} placeholder="e.g. 2500000" /></div>
          </div>
          <div className="row">
            <div className="field"><label>Monthly Income</label><input className="input" value={f.income} onChange={set('income')} placeholder="e.g. 65000" /></div>
            <div className="field"><label>Employment</label>
              <select className="select" value={f.employment} onChange={set('employment')}>{EMPLOYMENT_TYPES.map((p) => <option key={p}>{p}</option>)}</select></div>
          </div>
          {/* honeypot (hidden from humans) */}
          <input value={f.company} onChange={set('company')} name="company" tabIndex={-1} autoComplete="off"
            style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
          {err && <div style={{ color: 'var(--danger)', fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>{err}</div>}
          <button className="btn btn-green" style={{ width: '100%', padding: 12 }} type="submit">Get My Free Quote</button>
          <p className="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <IcGlobe width={12} height={12} /> Protected enquiry · we never share your data
          </p>
        </form>
      </div>
    </div>
  );
}
