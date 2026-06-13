import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getSettings, updateSettings, setProvider, exportBackup, restoreBackup, autoRotate } from '../../api/db';
import { Toast } from '../../components/ui';
import { IcCheck, IcDownload, IcUpload, IcSettings } from '../../components/icons';

const PROVIDERS = [
  { key: 'whatsapp', label: 'WhatsApp', hint: 'WhatsApp Business Cloud API / WATI / AiSensy' },
  { key: 'email', label: 'Email', hint: 'SendGrid / Amazon SES / Brevo' },
  { key: 'sms', label: 'SMS', hint: 'MSG91 / Twilio / Kaleyra (DLT registered)' },
  { key: 'telephony', label: 'Cloud Telephony', hint: 'Exotel / Knowlarity / Twilio (click-to-call)' },
];

export default function Settings() {
  const { user } = useAuth();
  const [s, setS] = useState(() => ({ ...getSettings() }));
  const [toast, setToast] = useState('');
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };

  const toggleRotate = () => { const v = !s.autoRotate; updateSettings({ autoRotate: v }); setS({ ...s, autoRotate: v }); flash(v ? 'Auto-rotation ON — new website leads auto-distribute' : 'Auto-rotation off'); };
  const saveProvider = (key, patch) => { const ns = setProvider(key, patch); setS({ ...ns }); };

  const download = () => {
    const blob = new Blob([exportBackup()], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'dsa-crm-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    flash('Backup downloaded');
  };
  const upload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => { if (restoreBackup(r.result)) { flash('Backup restored — reloading'); setTimeout(() => location.reload(), 900); } else flash('Invalid backup file'); };
    r.readAsText(file);
  };

  return (
    <Layout title="Settings" subtitle="Automation, messaging providers, and data backup">
      <Toast msg={toast} />

      <div className="card card-pad">
        <div className="between">
          <div>
            <div className="card-title">Auto lead-rotation</div>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 4, maxWidth: 520 }}>
              When ON, new website leads are automatically distributed round-robin to active telecallers (balanced by current load).
            </p>
          </div>
          <button className={'btn ' + (s.autoRotate ? 'btn-green' : 'btn-ghost')} onClick={toggleRotate}>
            {s.autoRotate ? <><IcCheck width={16} height={16} /> ON</> : 'OFF'}
          </button>
        </div>
        <div className="mt-16">
          <button className="btn btn-ghost btn-sm" onClick={() => { const n = autoRotate(user); flash(n ? `Distributed ${n} pool leads` : 'Pool already empty'); }}>
            Auto-distribute current pool now
          </button>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-head"><IcSettings width={16} height={16} /><span className="card-title">Messaging &amp; Telephony Providers</span></div>
        <div className="card-pad">
          <p className="muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
            Connect your accounts to enable live sending/dialing. Until connected, the CRM uses device deep-links
            (WhatsApp / mail / SMS / dialer) and logs every interaction. API keys are held by the backend in production.
          </p>
          <div className="grid cols-2">
            {PROVIDERS.map((p) => {
              const cfg = s.providers?.[p.key] || {};
              return (
                <div className="card card-pad" key={p.key} style={{ boxShadow: 'none' }}>
                  <div className="between">
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.label}</div>
                    <span className="badge" style={{ background: cfg.connected ? 'rgba(0,208,156,.13)' : 'rgba(148,163,184,.18)', color: cfg.connected ? 'var(--green-600)' : 'var(--text-2)' }}>
                      {cfg.connected ? 'Connected' : 'Not connected'}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, margin: '4px 0 10px' }}>{p.hint}</div>
                  <input className="input" placeholder="API key" value={cfg.key || ''} onChange={(e) => saveProvider(p.key, { key: e.target.value })} />
                  <button className="btn btn-ghost btn-sm mt-16" onClick={() => { saveProvider(p.key, { connected: !cfg.connected }); flash(p.label + (cfg.connected ? ' disconnected' : ' connected')); }}>
                    {cfg.connected ? 'Disconnect' : 'Connect'}</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card mt-16 card-pad">
        <div className="card-title" style={{ marginBottom: 6 }}>Data backup &amp; restore</div>
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>Export the full database as JSON, or restore from a backup file.</p>
        <div className="wrap-gap">
          <button className="btn btn-primary" onClick={download}><IcDownload width={16} height={16} /> Download backup</button>
          <label className="btn btn-ghost" style={{ cursor: 'pointer' }}><IcUpload width={16} height={16} /> Restore backup<input type="file" accept=".json" hidden onChange={upload} /></label>
        </div>
      </div>
    </Layout>
  );
}
