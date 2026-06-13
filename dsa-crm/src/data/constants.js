// ── Domain constants for the DSA Finance CRM ──────────────────────
// Mirrors Section 4 of the build spec (pipeline, labels, outcomes, reasons).

// 4.2 Main finance pipeline (full lead lifecycle)
export const PIPELINE = [
  { key: 'captured',    label: 'Lead Captured',        color: '#64748b', meaning: 'New lead entered the system' },
  { key: 'in_progress', label: 'In Progress',          color: '#3b82f6', meaning: 'Telecaller is actively working the lead' },
  { key: 'interested',  label: 'Interested – Follow Up', color: '#8b5cf6', meaning: 'Client showed interest; nurturing' },
  { key: 'documents',   label: 'Documents Collected',  color: '#6366f1', meaning: 'KYC & income documents received' },
  { key: 'submitted',   label: 'Talk to Bank / Submitted', color: '#0ea5e9', meaning: 'Application submitted to bank / NBFC' },
  { key: 'processing',  label: 'Under Processing',     color: '#f59e0b', meaning: 'Bank verifying the application' },
  { key: 'approved',    label: 'Approved',             color: '#10b981', meaning: 'Loan / product approved' },
  { key: 'disbursed',   label: 'Deal Closed / Disbursed', color: '#00d09c', meaning: 'Loan disbursed — converted' },
  { key: 'rejected',    label: 'Rejected',             color: '#ef4444', meaning: 'Declined (capture reason)' },
  { key: 'dropped',     label: 'Not Interested / Dropped', color: '#94a3b8', meaning: 'Not pursuing; re-engage later' },
];

export const stageOf = (key) => PIPELINE.find((s) => s.key === key) || PIPELINE[0];
export const stageIndex = (key) => PIPELINE.findIndex((s) => s.key === key);

// 4.1 Telecaller call outcomes (quick status after each call)
export const CALL_OUTCOMES = [
  'Called — Interested',
  'Called — Not Interested',
  'Call After Some Time',
  'Not Reachable / Switched Off / Busy',
  'Wrong Number',
];

// 4.3 Lead labels (tags)
// Icon component for each label lives in components/icons.jsx (LABEL_ICON map).
export const LABELS = [
  { key: 'hot',      label: 'Hot Lead',  color: '#ef4444' },
  { key: 'warm',     label: 'Warm Lead', color: '#f59e0b' },
  { key: 'cold',     label: 'Cold Lead', color: '#3b82f6' },
  { key: 'priority', label: 'Priority',  color: '#8b5cf6' },
  { key: 'reengage', label: 'Re-engage', color: '#0ea5e9' },
];
export const labelOf = (key) => LABELS.find((l) => l.key === key);

// 4.4 Rejection reasons (required when stage = rejected)
export const REJECTION_REASONS = [
  'Low CIBIL / credit score',
  'Insufficient income',
  'Incomplete documents',
  'Policy decline',
  'Bureau issue',
  'Property issue',
  'Already has a loan',
  'Blacklisted',
  'Other',
];

// Product types for the capture form / lead record
export const PRODUCT_TYPES = [
  'Home Loan', 'Personal Loan', 'Business Loan', 'Loan Against Property',
  'Education Loan', 'Auto Loan', 'Mutual Funds', 'Insurance', 'Other',
];

export const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business Owner', 'Professional', 'Other'];

export const LEAD_SOURCES = ['Website', 'Excel Import', 'Referral', 'Ads', 'Manual'];

// Daily minimum target per telecaller (Section 7)
export const DAILY_TARGET = 10;

// ── Phase 2: message templates (spec §6) ──────────────────────────
// {{name}}, {{product}}, {{amount}} tokens are filled at send time.
export const TEMPLATES = [
  { id: 'welcome',   channel: 'all',      title: 'Welcome',
    body: 'Hi {{name}}, thank you for your interest in our {{product}} with DSA Finance. Our advisor will assist you shortly.' },
  { id: 'docs',      channel: 'all',      title: 'Document Checklist',
    body: 'Hi {{name}}, to process your {{product}} please keep ready: PAN, Aadhaar, last 3 months bank statement, salary slips / ITR, and address proof.' },
  { id: 'followup',  channel: 'all',      title: 'Follow-up Reminder',
    body: 'Hi {{name}}, following up on your {{product}} enquiry. Are you available for a quick call today to take this forward?' },
  { id: 'approval',  channel: 'all',      title: 'Approval Update',
    body: 'Good news {{name}}! Your {{product}} application has progressed. Our team will share the next steps shortly.' },
];
export const fillTemplate = (body, lead) => body
  .replace(/\{\{name\}\}/g, lead.name.split(' ')[0])
  .replace(/\{\{product\}\}/g, lead.product)
  .replace(/\{\{amount\}\}/g, '₹' + (lead.amount || 0).toLocaleString('en-IN'));

// ── Phase 3: Bank / NBFC product catalog (spec §9) ────────────────
// Each lender lists eligibility criteria used to match leads.
export const BANKS = [
  { id: 'sbi',   name: 'SBI',            products: ['Home Loan', 'Personal Loan', 'Education Loan'], minIncome: 25000, minCibil: 700, maxAmount: 50000000, roi: '8.40%' },
  { id: 'hdfc',  name: 'HDFC Bank',      products: ['Home Loan', 'Personal Loan', 'Auto Loan'],     minIncome: 30000, minCibil: 720, maxAmount: 40000000, roi: '8.60%' },
  { id: 'icici', name: 'ICICI Bank',     products: ['Home Loan', 'Personal Loan', 'Business Loan'], minIncome: 30000, minCibil: 725, maxAmount: 35000000, roi: '8.75%' },
  { id: 'axis',  name: 'Axis Bank',      products: ['Personal Loan', 'Loan Against Property'],      minIncome: 35000, minCibil: 730, maxAmount: 30000000, roi: '10.49%' },
  { id: 'bajaj', name: 'Bajaj Finserv',  products: ['Personal Loan', 'Business Loan'],              minIncome: 25000, minCibil: 685, maxAmount: 4500000,  roi: '11.00%' },
  { id: 'lichfl',name: 'LIC Housing',    products: ['Home Loan', 'Loan Against Property'],          minIncome: 25000, minCibil: 700, maxAmount: 50000000, roi: '8.50%' },
  { id: 'tata',  name: 'Tata Capital',   products: ['Business Loan', 'Personal Loan', 'Auto Loan'], minIncome: 25000, minCibil: 700, maxAmount: 7500000,  roi: '10.99%' },
];

// Documents an agent can upload against a lead (spec §9)
export const DOC_TYPES = ['PAN Card', 'Aadhaar', 'Bank Statement', 'Salary Slip', 'ITR', 'Address Proof', 'Photo', 'Other'];

// Activity types for the per-lead communication/audit timeline (Section 6.4)
export const ACTIVITY = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  STAGE: 'stage',
  OUTCOME: 'outcome',
  LABEL: 'label',
  NOTE: 'note',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  SMS: 'sms',
  CALLBACK: 'callback',
  CALL: 'call',       // click-to-call with logged duration (Phase 3)
  DOC: 'doc',         // document uploaded (Phase 3)
  DND: 'dnd',         // DND flag toggled (Phase 3)
};
