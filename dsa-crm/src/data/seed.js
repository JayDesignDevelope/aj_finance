// ── Seed data + localStorage-backed store ─────────────────────────
// NOTE FOR PRODUCTION: this client-side store stands in for the
// Node/Express + PostgreSQL backend described in the spec. The access
// rules in api/db.js mirror the server-side RBAC that production needs
// ("enforced server-side, not just hidden in the UI" — spec §3.2).

const KEY = 'dsa_crm_db_v2';

const FIRST = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Pooja', 'Rohit', 'Neha',
  'Arjun', 'Divya', 'Suresh', 'Meera', 'Rajesh', 'Kavya', 'Manish', 'Ritu', 'Sanjay', 'Deepa',
  'Nikhil', 'Shreya', 'Gaurav', 'Isha', 'Varun', 'Tanvi', 'Akash', 'Nisha', 'Yash', 'Aditi',
  'Sahil', 'Megha', 'Dev', 'Swati', 'Harsh', 'Payal', 'Ankit', 'Sonia', 'Vivek', 'Pallavi'];
const LAST = ['Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Mehta', 'Joshi',
  'Kumar', 'Rao', 'Desai', 'Kapoor', 'Malhotra', 'Bose', 'Chopra', 'Shah', 'Pillai', 'Agarwal'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];
const PRODUCTS = ['Home Loan', 'Personal Loan', 'Business Loan', 'Loan Against Property', 'Education Loan', 'Auto Loan'];
const EMP = ['Salaried', 'Self-Employed', 'Business Owner', 'Professional'];
const SOURCES = ['Website', 'Excel Import', 'Referral', 'Ads'];
const STAGES = ['captured', 'captured', 'captured', 'in_progress', 'in_progress', 'interested',
  'documents', 'submitted', 'processing', 'approved', 'disbursed', 'rejected', 'dropped'];

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rint = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

function makePhone() {
  return '+91 ' + pick(['98', '99', '97', '70', '88', '63', '91']) + String(rint(10000000, 99999999));
}

function seedUsers() {
  return [
    { id: 'u_admin', name: 'Admin Manager', email: 'admin@dsacrm.in', password: 'admin123', role: 'admin', active: true },
    { id: 'u_t1', name: 'Telecaller One', email: 'caller1@dsacrm.in', password: 'call123', role: 'caller', active: true },
    { id: 'u_t2', name: 'Telecaller Two', email: 'caller2@dsacrm.in', password: 'call123', role: 'caller', active: true },
    { id: 'u_t3', name: 'Telecaller Three', email: 'caller3@dsacrm.in', password: 'call123', role: 'caller', active: true },
  ];
}

function seedLeads() {
  const leads = [];
  const callers = ['u_t1', 'u_t2', 'u_t3'];
  for (let i = 0; i < 56; i++) {
    const name = pick(FIRST) + ' ' + pick(LAST);
    const stage = pick(STAGES);
    const created = daysAgo(rint(0, 45));
    // ~60% assigned to a caller, rest unassigned in the pool
    const assigned = Math.random() < 0.6;
    const assignedTo = assigned ? pick(callers) : null;
    const id = 'L' + String(1000 + i);
    const activity = [
      { id: 'a_' + id + '_0', type: 'created', at: created, by: 'system', text: `Lead captured from ${pick(SOURCES)}` },
    ];
    if (assignedTo) {
      activity.push({ id: 'a_' + id + '_1', type: 'assigned', at: daysAgo(rint(0, 5)), by: 'u_admin', text: `Assigned to telecaller` });
    }
    leads.push({
      id,
      name,
      phone: makePhone(),
      email: name.toLowerCase().replace(/[^a-z]/g, '.') + '@gmail.com',
      city: pick(CITIES),
      product: pick(PRODUCTS),
      amount: rint(2, 80) * 100000,
      income: rint(25, 250) * 1000,
      employment: pick(EMP),
      source: pick(SOURCES),
      stage,
      label: Math.random() < 0.5 ? pick(['hot', 'warm', 'cold', 'priority', 'reengage']) : null,
      assignedTo,
      callback: null,
      rejectionReason: stage === 'rejected' ? pick([
        'Low CIBIL / credit score', 'Insufficient income', 'Incomplete documents', 'Policy decline']) : null,
      lastOutcome: null,
      notes: '',
      cibil: rint(620, 820),
      dnd: Math.random() < 0.08,
      docs: [],
      createdAt: created,
      activity,
    });
  }
  return leads;
}

const DEFAULT_SETTINGS = {
  autoRotate: false,            // auto round-robin website leads to telecallers
  providers: {                  // provider config stubs (real keys wired to backend)
    whatsapp: { name: 'WhatsApp Business Cloud', connected: false, key: '' },
    email: { name: 'SendGrid', connected: false, key: '' },
    sms: { name: 'MSG91 (DLT)', connected: false, key: '' },
    telephony: { name: 'Exotel', connected: false, key: '' },
  },
};

export function freshDb() {
  return {
    users: seedUsers(),
    leads: seedLeads(),
    settings: DEFAULT_SETTINGS,
    seededAt: new Date().toISOString(),
  };
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  const db = freshDb();
  saveDb(db);
  return db;
}

export function saveDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDb() {
  const db = freshDb();
  saveDb(db);
  return db;
}
