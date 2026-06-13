# DSA Finance CRM

A lean, purpose-built CRM for a DSA (Direct Selling Agent) finance business handling
loan & wealth products. Built to the *DSA_CRM_Developer_Spec* handoff brief.

**Core principle — controlled lead distribution:** unlike a normal CRM where everyone
sees all leads, the Admin assigns a limited daily batch (10–20 numbers) to each
telecaller. Telecallers only ever see the numbers assigned to them — never the full
database. This is enforced in the data-access layer (`src/api/db.js`), mirroring the
server-side RBAC a production deployment requires.

## Run it

```bash
cd dsa-crm
npm install
npm run dev      # → http://localhost:5175
npm run build    # production build
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin / Manager | `admin@dsacrm.in` | `admin123` |
| Telecaller 1 | `caller1@dsacrm.in` | `call123` |
| Telecaller 2 | `caller2@dsacrm.in` | `call123` |
| Telecaller 3 | `caller3@dsacrm.in` | `call123` |

The app seeds ~56 sample leads on first load (localStorage key `dsa_crm_db_v1`).
Clear that key to reseed.

## Tech stack

- **React 18 + Vite 5** (Node 18 compatible)
- **React Router 6** — role-gated routes
- **Recharts** — admin analytics
- **SheetJS (xlsx)** — Excel import & cleaning
- **GSAP** — page/entrance animation
- Plain CSS design system (`src/index.css`), navy `#1b3a6b` + green `#00d09c`

## What's implemented (Phase 1 MVP + key Phase 2)

| Spec section | Feature | Where |
|---|---|---|
| §3.1 | Admin dashboard, full DB access, agent management | `pages/admin/*` |
| §3.2 | Telecaller dashboard — only own batch (RBAC) | `pages/caller/MyCalls.jsx`, `api/db.js` `scope()` |
| §4.1 | Call outcomes | `pages/LeadDetail.jsx` |
| §4.2 | 10-stage finance pipeline | `data/constants.js` `PIPELINE` |
| §4.3 | Lead labels (Hot/Warm/Cold/Priority/Re-engage) | `LABELS` |
| §4.4 | Rejection reasons (required when Rejected) | `REJECTION_REASONS` |
| §5.2 | Excel import → auto-clean → de-dup → commit | `pages/admin/ImportLeads.jsx` |
| §6 | WhatsApp / Email / SMS contact (deep links) + auto-log | `LeadDetail.jsx` |
| §6.4 | Per-lead activity timeline | `LeadDetail.jsx` |
| §7 | Daily batch assignment + target counter | `pages/admin/AssignLeads.jsx`, sidebar widget |
| §8 | Analytics: stage funnel, conversion, rejection/source pies, capture trend, per-agent | `pages/admin/AdminDashboard.jsx` |

## Phase 2 — Capture & Communication (built)

| Feature | Where |
|---|---|
| Public embeddable website capture form (honeypot spam guard, de-dup, auto-ack) | `pages/Capture.jsx` → route `/capture` |
| Real-time website-lead inbox + iframe embed snippet | `pages/admin/WebsiteInbox.jsx` |
| Message templates (welcome / doc checklist / follow-up / approval) with token fill | `data/constants.js` `TEMPLATES`, used in `LeadDetail` |
| WhatsApp / Email / SMS send (deep-links) + auto-logged | `LeadDetail.jsx` |
| Provider connect screen (WhatsApp/SendGrid/MSG91/Exotel keys) | `pages/admin/Settings.jsx` |
| Admin analytics graphs | `pages/admin/AdminDashboard.jsx` |
| Report export — Excel + Print/PDF | `utils/exporters.js` |

## Phase 3 — Automation & Add-ons (built)

| Feature | Where |
|---|---|
| Click-to-call with live timer + logged duration | `components/CallMode.jsx` |
| Auto lead-rotation (round-robin, load-balanced) | `api/db.js` `autoRotate`, Settings + Assign screens |
| Document upload & storage (per lead) | `components/LeadExtras.jsx` `DocsPanel` |
| EMI / eligibility calculator (FOIR) | `components/LeadExtras.jsx` `EligibilityCalc` |
| Follow-up reminders (due-callback bell) | `components/Layout.jsx` `RemindersBell` |
| Bank / NBFC catalog + per-lead lender matching | `pages/admin/Catalog.jsx`, `LeadExtras` `MatchingLenders` |
| Duplicate & DND check | `LeadDetail.jsx`, `api/db.js` `toggleDnd` |
| Role-based audit log | `pages/admin/AuditLog.jsx` |
| PWA — installable, offline service worker | `public/manifest.webmanifest`, `public/sw.js` |
| Data backup / restore (JSON) | `pages/admin/Settings.jsx` |

## Going live (needs your accounts)

The app runs fully on a localStorage store. The data layer (`src/api/db.js`) is the single
gateway to all data, structured to swap to a real backend with identical semantics:

- Replace `api/db.js` calls with REST/GraphQL to **Node + Express / PostgreSQL**; move the
  RBAC scoping (`scope()`, `getLead()` guards) server-side — the UI already assumes it.
- The capture form posts client-side today; point it at `POST /api/leads/capture` in production.
- Messaging/telephony currently use device deep-links (wa.me / mailto / sms / tel) and log every
  interaction. To send/dial **through providers**, add credentials in Settings and wire the
  backend to WhatsApp Cloud API / WATI, SendGrid / SES, MSG91 (DLT), and Exotel / Twilio.
  These require paid accounts + (for SMS) DLT registration.
