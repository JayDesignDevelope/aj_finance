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

## Production path (Phase 2/3 — see spec §10)

This MVP uses a localStorage store so it runs and demos standalone. The data layer
(`src/api/db.js`) is the single gateway to all lead data and is structured so it can be
swapped for a real backend with identical semantics:

- Replace `src/api/db.js` calls with REST/GraphQL calls to **Node + Express / PostgreSQL**.
- Move RBAC scoping (`scope()`, `getLead()` guards) server-side — the UI already assumes it.
- Wire real messaging providers for §6: WhatsApp Cloud API / WATI, SendGrid / SES, MSG91 (DLT).
- Add the public capture endpoint `POST /api/leads/capture` + embeddable form (§5.1).
- Phase 3 add-ons: cloud telephony click-to-call, auto round-robin rotation, document upload,
  callback reminders, eligibility calculator.
