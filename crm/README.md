# AJ Finance CRM

A role-based customer relationship management system for AJ Finance, built as a React single-page application. It manages loan files, customers, commissions, documents, and executive assignments across four user roles.

---

## Tech Stack

- React 19
- Vite 5 (requires Node 18+)
- React Router DOM 7
- Recharts (charts and graphs)
- Lucide React (icons)
- CSS custom properties (no Tailwind or component library)
- localStorage for data persistence (mock backend)

---

## Getting Started

```bash
cd crm
npm install
npm run dev
```

The app runs at `http://localhost:5174` by default.

Open the root URL to see the landing page. Click "Staff Login" in the navbar to go to the login screen.

---

## Login Credentials

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Admin | admin@ajfinance.com | admin123 | /admin/dashboard |
| Data Operator | operator@ajfinance.com | op123 | /operator/dashboard |
| Marketing Executive | marketing@ajfinance.com | mkt123 | /marketing/dashboard |
| Bank Executive | executive@ajfinance.com | exec123 | /executive/dashboard |

---

## Features by Role

### Admin

Full access to all data and configuration.

- **Dashboard** — summary stats (total loans, customers, disbursed amount, pending files), recent loan files table, loan status breakdown chart, monthly disbursement trend chart
- **Loan Files** — paginated list with search and status filter, export to CSV, link to detail view
- **Loan Detail** — full loan info, customer info, assigned executive, document list, status history
- **Create Loan** — form to create a new loan file linked to a customer and bank
- **Edit Loan** — update loan amount, type, status, bank, and notes
- **Customers** — paginated list with search, export to CSV, links to detail and edit
- **Customer Detail** — full customer profile and all associated loans
- **Create Customer** — form to add a new customer
- **Edit Customer** — update customer contact details, district, and status
- **Users** — list all staff users with role and status
- **Create User** — add a new staff account with a role
- **Edit User** — change user name, role, or status
- **Banks** — list all partner banks
- **Create Bank** — add a new bank with contact and type
- **Edit Bank** — update bank information
- **Documents** — list all uploaded documents across all loan files
- **Upload Document** — attach a document to a loan file with type and notes
- **Commission** — list all commission records with payment status; mark commissions as paid
- **Add Commission** — create a commission entry for a loan file and executive
- **Executive Assignment** — list all loan-to-executive assignments with status
- **Assign Executive** — assign a bank executive to a loan file
- **Reports** — loan volume by type (bar chart), status distribution (pie chart), monthly disbursement trend (area chart), commission payment summary (bar chart)
- **Status** — change the status of any loan file with a reason note

### Data Operator

Responsible for data entry.

- **Dashboard** — summary of customers added, loans created, documents uploaded today and overall
- **Customers** — view all customers with search; add new customer
- **Create Customer** — form to register a new customer
- **Create Loan** — form to create a new loan file
- **Loan Files** — view all loan files with search and status filter
- **Upload Document** — attach a document to an existing loan file

### Marketing Executive

Focused on lead tracking and reporting.

- **Dashboard** — total leads, active vs inactive breakdown, recent leads table, lead status distribution chart
- **Leads** — full customer list with search, status filter, loan count per customer, export to CSV
- **Reports** — monthly new customer trend (line chart), lead status breakdown (pie chart), top districts by customer count (bar chart)

### Bank Executive

Sees only the files assigned to them.

- **Dashboard** — count of assigned files, pending vs active, list of recent assigned files
- **My Files** — all loan files assigned to this executive with search and status filter
- **Documents** — all documents linked to assigned loan files

---

## Data Model (localStorage keys)

| Key | Contents |
|---|---|
| crm_users | Staff user accounts (id, name, email, password, role, status) |
| crm_customers | Customer records (id, name, email, contact, district, status, registeredAt) |
| crm_loans | Loan files (id, customerId, bankId, type, amount, status, createdAt, notes) |
| crm_banks | Partner banks (id, name, type, contact, status) |
| crm_documents | Documents (id, fileId, type, name, uploadedBy, uploadedAt, notes) |
| crm_commissions | Commission records (id, fileId, assignedTo, commissionPct, paymentStatus, paymentDate) |
| crm_assignments | Executive assignments (id, fileId, executiveName, assignedDate, status) |

Mock data is seeded automatically on first load via `initMockData()` in `main.jsx`. If localStorage already has data the seed is skipped.

---

## Project Structure

```
crm/
  src/
    pages/
      Landing.jsx          - Public landing page at /
      auth/Login.jsx       - Login screen at /login
      admin/               - 20 admin pages
      executive/           - 3 bank executive pages
      operator/            - 6 data operator pages
      marketing/           - 3 marketing pages
    components/
      layout/Layout.jsx    - Sidebar + topbar shell
      ui/Badge.jsx         - Status badge
      ui/Modal.jsx         - Confirm dialog
    contexts/
      AuthContext.jsx      - Login state, role, logout
    utils/
      mockData.js          - store helper + initMockData seed function
    index.css              - All CSS variables, component styles, landing styles
    App.jsx                - Router, ProtectedRoute, role-based redirects
    main.jsx               - Entry point
```

---

## Loan Types

Personal Loan, Business Loan, Home Loan, Loan Against Property (LAP), Professional Loan, Balance Transfer

## Loan Statuses

Submitted, Under Review, Approved, Rejected, Disbursed, Closed

## Commission Payment Statuses

Pending, Processing, Paid
