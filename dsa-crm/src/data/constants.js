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
};
