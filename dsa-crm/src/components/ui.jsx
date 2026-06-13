import { stageOf, labelOf } from '../data/constants';

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function StageBadge({ stage }) {
  const s = stageOf(stage);
  return <span className="badge" style={{ background: hexA(s.color, 0.13), color: s.color }}>
    <span style={{ width: 6, height: 6, borderRadius: 6, background: s.color }} />{s.label}
  </span>;
}

export function LabelChip({ label }) {
  if (!label) return <span className="muted" style={{ fontSize: 12 }}>—</span>;
  const l = labelOf(label);
  if (!l) return null;
  return <span className="label-chip" style={{ background: hexA(l.color, 0.13), color: l.color }}>
    {l.icon} {l.label}
  </span>;
}

export function StatCard({ icon, value, label, foot, footColor, accent = '#1b3a6b' }) {
  return (
    <div className="stat">
      <div className="stat-ico" style={{ background: hexA(accent, 0.12), color: accent }}>{icon}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
      {foot && <div className="stat-foot" style={{ color: footColor || 'var(--green-600)' }}>{foot}</div>}
    </div>
  );
}

export const money = (n) => {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
  return '₹' + n;
};

export const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}
