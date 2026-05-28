import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ROLES = [
  { key: 'ADMIN', label: 'Admin', email: 'admin@ajfinance.com', password: 'admin123', redirect: '/admin/dashboard' },
  { key: 'DATA_OPERATOR', label: 'Data Operator', email: 'operator@ajfinance.com', password: 'op123', redirect: '/operator/dashboard' },
  { key: 'MARKETING_EXECUTIVE', label: 'Marketing', email: 'marketing@ajfinance.com', password: 'mkt123', redirect: '/marketing/dashboard' },
  { key: 'BANK_EXECUTIVE', label: 'Bank Executive', email: 'executive@ajfinance.com', password: 'exec123', redirect: '/executive/dashboard' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillRole = (role) => { setEmail(role.email); setPassword(role.password); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 400));
    const res = login(email, password);
    setLoading(false);
    if (!res.success) { setError(res.error); return; }
    const role = ROLES.find(r => r.email === email);
    navigate(role?.redirect || '/admin/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">AJ</div>
          <div className="login-logo-text">
            <h1>AJ Finance</h1>
            <p>CRM Portal</p>
          </div>
        </div>

        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to your account to continue</p>

        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick fill by role</p>
        <div className="login-role-grid">
          {ROLES.map(r => (
            <div key={r.key} className={`role-chip${email === r.email ? ' selected' : ''}`} onClick={() => fillRole(r)}>
              {r.label}
            </div>
          ))}
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="email" required
              placeholder="you@ajfinance.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPw ? 'text' : 'password'}
                required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4, padding: '12px' }}>
            {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray)', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <p style={{ fontSize: 12, color: 'var(--gray2)' }}>AJ Finance CRM • Internal Use Only</p>
        </div>
      </div>
    </div>
  );
}
