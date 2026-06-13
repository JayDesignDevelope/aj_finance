import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

const DEMO = [
  { role: 'Admin / Manager', email: 'admin@dsacrm.in', password: 'admin123' },
  { role: 'Telecaller 1', email: 'caller1@dsacrm.in', password: 'call123' },
  { role: 'Telecaller 2', email: 'caller2@dsacrm.in', password: 'call123' },
  { role: 'Telecaller 3', email: 'caller3@dsacrm.in', password: 'call123' },
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 26, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) { setErr('Invalid credentials or disabled account.'); return; }
    nav(u.role === 'admin' ? '/admin' : '/me', { replace: true });
  };

  const useDemo = (d) => { setEmail(d.email); setPassword(d.password); setErr(''); };

  return (
    <div className="login-wrap">
      <div className="login-card" ref={cardRef}>
        <div className="login-brand">
          <div className="brand-mark" style={{ width: 44, height: 44, fontSize: 23 }}>D</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>DSA Finance CRM</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>Loan &amp; Wealth Lead Management</div>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" value={email} placeholder="you@dsacrm.in"
              onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" value={password} placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div style={{ color: 'var(--danger)', fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>{err}</div>}
          <button className="btn btn-green" style={{ width: '100%', padding: 12 }} type="submit">Sign in</button>
        </form>

        <div className="login-demo">
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Demo accounts — click to fill
          </div>
          {DEMO.map((d) => (
            <div className="demo-row" key={d.email}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{d.role}</div>
                <code>{d.email}</code>
              </div>
              <button type="button" className="demo-use" onClick={() => useDemo(d)}>Use →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
