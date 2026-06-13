// ── Data-access layer with role-based access control ──────────────
// This module is the single gateway to lead data. Every read/write is
// scoped by the acting user's role — telecallers can ONLY ever touch
// leads assigned to them (spec §3.2). In production this logic lives on
// the server; here it guards the localStorage store the same way so the
// UI can later swap to a real API with identical semantics.

import { loadDb, saveDb, resetDb } from '../data/seed';
import { ACTIVITY, DAILY_TARGET } from '../data/constants';

let db = loadDb();
const persist = () => saveDb(db);
const uid = (p) => p + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();
const todayKey = (iso) => (iso || now()).slice(0, 10);

// ---- Auth ----------------------------------------------------------
export function authenticate(email, password) {
  const u = db.users.find(
    (x) => x.email.toLowerCase() === String(email).toLowerCase() && x.password === password && x.active
  );
  if (!u) return null;
  const { password: _p, ...safe } = u;
  return safe;
}

// ---- Users / agents ------------------------------------------------
export const getAgents = () => db.users.filter((u) => u.role === 'caller').map(({ password, ...u }) => u);
export const getUser = (id) => { const u = db.users.find((x) => x.id === id); if (!u) return null; const { password, ...s } = u; return s; };

export function createAgent({ name, email, password }) {
  const agent = { id: uid('u_'), name, email, password: password || 'call123', role: 'caller', active: true };
  db.users.push(agent); persist();
  const { password: _p, ...safe } = agent; return safe;
}
export function toggleAgent(id) {
  const u = db.users.find((x) => x.id === id);
  if (u && u.role === 'caller') { u.active = !u.active; persist(); }
  return getAgents();
}
export function resetAgentPassword(id, pwd) {
  const u = db.users.find((x) => x.id === id);
  if (u) { u.password = pwd; persist(); }
}

// ---- Leads (RBAC-scoped) -------------------------------------------
// `actor` = the logged-in user object { id, role }.
function scope(actor, leads) {
  if (!actor) return [];
  if (actor.role === 'admin') return leads;
  return leads.filter((l) => l.assignedTo === actor.id); // caller: only own batch
}

export function listLeads(actor, filters = {}) {
  let rows = scope(actor, db.leads);
  if (filters.stage) rows = rows.filter((l) => l.stage === filters.stage);
  if (filters.label) rows = rows.filter((l) => l.label === filters.label);
  if (filters.assignedTo !== undefined) rows = rows.filter((l) => l.assignedTo === filters.assignedTo);
  if (filters.source) rows = rows.filter((l) => l.source === filters.source);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    rows = rows.filter((l) =>
      l.name.toLowerCase().includes(q) || l.phone.includes(q) ||
      (l.email || '').toLowerCase().includes(q) || (l.city || '').toLowerCase().includes(q));
  }
  return [...rows].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

// Admin-only: the unassigned pool used on the assignment screen.
export function unassignedPool(actor) {
  if (!actor || actor.role !== 'admin') return [];
  return db.leads.filter((l) => !l.assignedTo && !['disbursed', 'rejected', 'dropped'].includes(l.stage));
}

export function getLead(actor, id) {
  const l = db.leads.find((x) => x.id === id);
  if (!l) return null;
  if (actor.role !== 'admin' && l.assignedTo !== actor.id) return null; // hard block
  return l;
}

function addActivity(lead, type, by, text, extra = {}) {
  lead.activity = lead.activity || [];
  lead.activity.unshift({ id: uid('a_'), type, at: now(), by, text, ...extra });
}

export function createLead(actor, data) {
  const lead = {
    id: uid('L_'), name: data.name, phone: data.phone, email: data.email || '',
    city: data.city || '', product: data.product || 'Other', amount: Number(data.amount) || 0,
    income: Number(data.income) || 0, employment: data.employment || '', source: data.source || 'Manual',
    stage: 'captured', label: null, assignedTo: null, callback: null, rejectionReason: null,
    lastOutcome: null, notes: data.notes || '', createdAt: now(), activity: [],
  };
  addActivity(lead, ACTIVITY.CREATED, actor ? actor.id : 'system', `Lead captured from ${lead.source}`);
  db.leads.unshift(lead); persist();
  return lead;
}

// De-dup helper used by capture + import (spec §5.1 / §5.2)
const normPhone = (p) => String(p).replace(/\D/g, '').slice(-10);
export const findByPhone = (phone) => db.leads.find((l) => normPhone(l.phone) === normPhone(phone));

export function updateStage(actor, id, stage, rejectionReason) {
  const lead = getLead(actor, id); if (!lead) return null;
  lead.stage = stage;
  if (stage === 'rejected') lead.rejectionReason = rejectionReason || 'Other';
  addActivity(lead, ACTIVITY.STAGE, actor.id, `Stage → ${stage}${stage === 'rejected' && rejectionReason ? ` (${rejectionReason})` : ''}`);
  persist(); return lead;
}
export function setLabel(actor, id, label) {
  const lead = getLead(actor, id); if (!lead) return null;
  lead.label = label;
  addActivity(lead, ACTIVITY.LABEL, actor.id, `Label set to ${label || 'none'}`);
  persist(); return lead;
}
export function setOutcome(actor, id, outcome) {
  const lead = getLead(actor, id); if (!lead) return null;
  lead.lastOutcome = outcome;
  addActivity(lead, ACTIVITY.OUTCOME, actor.id, `Call outcome: ${outcome}`);
  persist(); return lead;
}
export function setCallback(actor, id, when) {
  const lead = getLead(actor, id); if (!lead) return null;
  lead.callback = when;
  addActivity(lead, ACTIVITY.CALLBACK, actor.id, `Callback set for ${new Date(when).toLocaleString()}`);
  persist(); return lead;
}
export function addNote(actor, id, text) {
  const lead = getLead(actor, id); if (!lead || !text.trim()) return lead;
  addActivity(lead, ACTIVITY.NOTE, actor.id, text.trim());
  persist(); return lead;
}
export function logComm(actor, id, channel, text) {
  const lead = getLead(actor, id); if (!lead) return null;
  addActivity(lead, channel, actor.id, text);
  persist(); return lead;
}

// ---- Assignment (admin only) ---------------------------------------
export function assignLeads(actor, leadIds, callerId) {
  if (actor.role !== 'admin') return;
  leadIds.forEach((id) => {
    const lead = db.leads.find((l) => l.id === id);
    if (lead) {
      lead.assignedTo = callerId;
      if (lead.stage === 'captured') lead.stage = 'in_progress';
      addActivity(lead, ACTIVITY.ASSIGNED, actor.id, `Assigned to ${getUser(callerId)?.name || callerId}`);
    }
  });
  persist();
}
export function unassignLead(actor, id) {
  if (actor.role !== 'admin') return;
  const lead = db.leads.find((l) => l.id === id);
  if (lead) { lead.assignedTo = null; addActivity(lead, ACTIVITY.ASSIGNED, actor.id, 'Pulled back to pool'); persist(); }
}

// ---- Bulk import (admin only) — spec §5.2 --------------------------
// rows: array of {name, phone, email, city, product, amount, income, employment}
// Returns { imported, duplicates, errors }
export function importLeads(actor, rows) {
  if (actor.role !== 'admin') return { imported: 0, duplicates: 0, errors: 0 };
  let imported = 0, duplicates = 0, errors = 0;
  rows.forEach((r) => {
    const phone = (r.phone || '').toString().trim();
    if (!r.name || !normPhone(phone) || normPhone(phone).length < 10) { errors++; return; }
    if (findByPhone(phone)) { duplicates++; return; }
    const clean = {
      id: uid('L_'),
      name: titleCase((r.name || '').trim()),
      phone: '+91 ' + normPhone(phone),
      email: (r.email || '').trim().toLowerCase(),
      city: titleCase((r.city || '').trim()),
      product: r.product || 'Other',
      amount: Number(String(r.amount).replace(/\D/g, '')) || 0,
      income: Number(String(r.income).replace(/\D/g, '')) || 0,
      employment: r.employment || '',
      source: 'Excel Import', stage: 'captured', label: null, assignedTo: null,
      callback: null, rejectionReason: null, lastOutcome: null, notes: '', createdAt: now(), activity: [],
    };
    addActivity(clean, ACTIVITY.CREATED, actor.id, 'Imported from Excel');
    db.leads.unshift(clean); imported++;
  });
  persist();
  return { imported, duplicates, errors };
}
const titleCase = (s) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

// ---- Analytics (admin) + per-caller progress -----------------------
export function analytics() {
  const leads = db.leads;
  const byStage = {};
  leads.forEach((l) => { byStage[l.stage] = (byStage[l.stage] || 0) + 1; });
  const byReason = {};
  leads.filter((l) => l.stage === 'rejected').forEach((l) => {
    const r = l.rejectionReason || 'Other'; byReason[r] = (byReason[r] || 0) + 1;
  });
  const bySource = {};
  leads.forEach((l) => { bySource[l.source] = (bySource[l.source] || 0) + 1; });
  const byLabel = {};
  leads.forEach((l) => { if (l.label) byLabel[l.label] = (byLabel[l.label] || 0) + 1; });

  // leads captured over last 14 days
  const overTime = [];
  for (let i = 13; i >= 0; i--) {
    const day = todayKey(new Date(Date.now() - i * 86400000).toISOString());
    const count = leads.filter((l) => todayKey(l.createdAt) === day).length;
    overTime.push({ day: day.slice(5), count });
  }

  const total = leads.length;
  const closed = byStage['disbursed'] || 0;
  const conversion = total ? Math.round((closed / total) * 100) : 0;

  // per-agent performance
  const agents = getAgents().map((a) => {
    const mine = leads.filter((l) => l.assignedTo === a.id);
    const callsToday = mine.filter((l) =>
      (l.activity || []).some((act) => act.type === ACTIVITY.OUTCOME && todayKey(act.at) === todayKey())
    ).length;
    return {
      id: a.id, name: a.name, active: a.active,
      assigned: mine.length,
      conversions: mine.filter((l) => l.stage === 'disbursed').length,
      callsToday,
      target: DAILY_TARGET,
    };
  });

  return { total, closed, conversion, byStage, byReason, bySource, byLabel, overTime, agents };
}

// Per-caller "My Calls Today" progress counter (spec §7)
export function callerProgress(actor) {
  if (!actor) return { done: 0, target: DAILY_TARGET, assigned: 0 };
  const mine = db.leads.filter((l) => l.assignedTo === actor.id);
  const done = mine.filter((l) =>
    (l.activity || []).some((a) => a.type === ACTIVITY.OUTCOME && todayKey(a.at) === todayKey())
  ).length;
  return { done, target: DAILY_TARGET, assigned: mine.length };
}

export function hardReset() { db = resetDb(); return db; }
