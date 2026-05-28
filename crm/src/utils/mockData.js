// ── Seed helpers ──────────────────────────────────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function dateStr(daysAgo) {
  const d = new Date(); d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}
function fmtAmt(n) { return n.toLocaleString('en-IN'); }

// ── Users ─────────────────────────────────────────────────────────────────────
export const INITIAL_USERS = [
  { id: 1, name: 'Arjun Joshi', email: 'admin@ajfinance.com', contact: '9876500001', username: 'admin', password: 'admin123', role: 'ADMIN', status: 'Active', registeredAt: '2024-01-01' },
  { id: 2, name: 'Sneha Patil', email: 'operator@ajfinance.com', contact: '9876500002', username: 'operator', password: 'op123', role: 'DATA_OPERATOR', status: 'Active', registeredAt: '2024-01-05' },
  { id: 3, name: 'Vikram Nair', email: 'marketing@ajfinance.com', contact: '9876500003', username: 'marketing', password: 'mkt123', role: 'MARKETING_EXECUTIVE', status: 'Active', registeredAt: '2024-01-08' },
  { id: 4, name: 'Priya Mehta', email: 'executive@ajfinance.com', contact: '9876500004', username: 'executive', password: 'exec123', role: 'BANK_EXECUTIVE', status: 'Active', registeredAt: '2024-01-10' },
  { id: 5, name: 'Rohit Das', email: 'rohit@ajfinance.com', contact: '9876500005', username: 'rohit', password: 'rohit123', role: 'DATA_OPERATOR', status: 'Active', registeredAt: '2024-02-01' },
  { id: 6, name: 'Anjali Singh', email: 'anjali@ajfinance.com', contact: '9876500006', username: 'anjali', password: 'anjali123', role: 'MARKETING_EXECUTIVE', status: 'Inactive', registeredAt: '2024-02-15' },
  { id: 7, name: 'Karthik Rao', email: 'karthik@ajfinance.com', contact: '9876500007', username: 'karthik', password: 'kart123', role: 'BANK_EXECUTIVE', status: 'Active', registeredAt: '2024-03-01' },
];

// ── Banks ─────────────────────────────────────────────────────────────────────
export const INITIAL_BANKS = [
  { id: 1, name: 'HDFC Bank', branch: 'Mumbai Main', ifsc: 'HDFC0000001', contactPerson: 'Amit Kumar', contact: '9876510001', email: 'amit@hdfc.com', status: 'Active', loanTypes: ['Home Loan', 'Personal Loan', 'Business Loan'], rateMin: 8.35, rateMax: 14.0, registeredAt: '2024-01-01' },
  { id: 2, name: 'State Bank of India', branch: 'Hyderabad Central', ifsc: 'SBIN0001234', contactPerson: 'Ravi Sharma', contact: '9876510002', email: 'ravi@sbi.co.in', status: 'Active', loanTypes: ['Home Loan', 'Education Loan', 'LAP'], rateMin: 8.05, rateMax: 13.5, registeredAt: '2024-01-01' },
  { id: 3, name: 'ICICI Bank', branch: 'Pune Branch', ifsc: 'ICIC0001234', contactPerson: 'Neha Gupta', contact: '9876510003', email: 'neha@icici.com', status: 'Active', loanTypes: ['Personal Loan', 'Business Loan', 'LAP'], rateMin: 10.25, rateMax: 18.0, registeredAt: '2024-01-02' },
  { id: 4, name: 'Axis Bank', branch: 'Bengaluru North', ifsc: 'UTIB0001234', contactPerson: 'Suresh Iyer', contact: '9876510004', email: 'suresh@axisbank.com', status: 'Active', loanTypes: ['Home Loan', 'Personal Loan', 'Business Loan'], rateMin: 9.0, rateMax: 15.5, registeredAt: '2024-01-05' },
  { id: 5, name: 'Kotak Mahindra Bank', branch: 'Chennai Main', ifsc: 'KKBK0001234', contactPerson: 'Deepa Nair', contact: '9876510005', email: 'deepa@kotak.com', status: 'Active', loanTypes: ['Personal Loan', 'Home Loan', 'Business Loan'], rateMin: 10.5, rateMax: 17.0, registeredAt: '2024-01-08' },
  { id: 6, name: 'Bajaj Finserv', branch: 'Pune HQ', ifsc: 'BARB0BAJAJF', contactPerson: 'Manish Jain', contact: '9876510006', email: 'manish@bajaj.com', status: 'Active', loanTypes: ['Personal Loan', 'Business Loan', 'Medical Loan'], rateMin: 11.0, rateMax: 22.0, registeredAt: '2024-01-10' },
  { id: 7, name: 'LIC Housing Finance', branch: 'Mumbai West', ifsc: 'LICF0000001', contactPerson: 'Kavitha Rao', contact: '9876510007', email: 'kavitha@lichfl.com', status: 'Inactive', loanTypes: ['Home Loan', 'LAP', 'Construction Loan'], rateMin: 8.5, rateMax: 12.5, registeredAt: '2024-02-01' },
];

// ── Customers ─────────────────────────────────────────────────────────────────
export const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', contact: '9876543201', whatsapp: '9876543201', pin: '400001', district: 'Mumbai', status: 'Active', registeredAt: dateStr(90) },
  { id: 2, name: 'Priya Verma', email: 'priya@email.com', contact: '9876543202', whatsapp: '', pin: '110001', district: 'Delhi', status: 'Active', registeredAt: dateStr(85) },
  { id: 3, name: 'Suresh Kumar', email: 'suresh@email.com', contact: '9876543203', whatsapp: '9876543203', pin: '500001', district: 'Hyderabad', status: 'Active', registeredAt: dateStr(80) },
  { id: 4, name: 'Anita Patel', email: 'anita@email.com', contact: '9876543204', whatsapp: '', pin: '380001', district: 'Ahmedabad', status: 'Inactive', registeredAt: dateStr(75) },
  { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', contact: '9876543205', whatsapp: '9876543205', pin: '560001', district: 'Bengaluru', status: 'Active', registeredAt: dateStr(70) },
  { id: 6, name: 'Meena Iyer', email: 'meena@email.com', contact: '9876543206', whatsapp: '9876543206', pin: '600001', district: 'Chennai', status: 'Active', registeredAt: dateStr(65) },
  { id: 7, name: 'Deepak Nair', email: 'deepak@email.com', contact: '9876543207', whatsapp: '', pin: '682001', district: 'Kochi', status: 'Active', registeredAt: dateStr(60) },
  { id: 8, name: 'Sunita Rao', email: 'sunita@email.com', contact: '9876543208', whatsapp: '9876543208', pin: '411001', district: 'Pune', status: 'Active', registeredAt: dateStr(55) },
  { id: 9, name: 'Ravi Gupta', email: 'ravi@email.com', contact: '9876543209', whatsapp: '', pin: '302001', district: 'Jaipur', status: 'Inactive', registeredAt: dateStr(50) },
  { id: 10, name: 'Kavitha Menon', email: 'kavitha@email.com', contact: '9876543210', whatsapp: '9876543210', pin: '700001', district: 'Kolkata', status: 'Active', registeredAt: dateStr(45) },
  { id: 11, name: 'Arun Pillai', email: 'arun@email.com', contact: '9876543211', whatsapp: '9876543211', pin: '641001', district: 'Coimbatore', status: 'Active', registeredAt: dateStr(40) },
  { id: 12, name: 'Lakshmi Devi', email: 'lakshmi@email.com', contact: '9876543212', whatsapp: '', pin: '530001', district: 'Visakhapatnam', status: 'Active', registeredAt: dateStr(35) },
  { id: 13, name: 'Nikhil Joshi', email: 'nikhil@email.com', contact: '9876543213', whatsapp: '9876543213', pin: '431001', district: 'Aurangabad', status: 'Active', registeredAt: dateStr(30) },
  { id: 14, name: 'Shobha Reddy', email: 'shobha@email.com', contact: '9876543214', whatsapp: '9876543214', pin: '500038', district: 'Hyderabad', status: 'Active', registeredAt: dateStr(20) },
  { id: 15, name: 'Manoj Tiwari', email: 'manoj@email.com', contact: '9876543215', whatsapp: '', pin: '226001', district: 'Lucknow', status: 'Active', registeredAt: dateStr(10) },
];

// ── Loans ─────────────────────────────────────────────────────────────────────
const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'LAP', 'Medical Loan'];
const LOAN_STATUSES = ['In-Process', 'Is-Disbursement', 'Completed', 'Rejected'];
const BANK_NAMES = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bajaj Finserv'];

export const INITIAL_LOANS = [
  { id: 'LN001', customerName: 'Rahul Sharma', customerId: 1, loanType: 'Home Loan', amount: 2500000, status: 'Completed', email: 'rahul@email.com', phone: '9876543201', bankName: 'HDFC Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(85), createdBy: 'admin' },
  { id: 'LN002', customerName: 'Priya Verma', customerId: 2, loanType: 'Personal Loan', amount: 500000, status: 'In-Process', email: 'priya@email.com', phone: '9876543202', bankName: 'ICICI Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(80), createdBy: 'operator' },
  { id: 'LN003', customerName: 'Suresh Kumar', customerId: 3, loanType: 'Business Loan', amount: 1500000, status: 'Is-Disbursement', email: 'suresh@email.com', phone: '9876543203', bankName: 'Axis Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(75), createdBy: 'admin' },
  { id: 'LN004', customerName: 'Anita Patel', customerId: 4, loanType: 'Vehicle Loan', amount: 800000, status: 'Rejected', email: 'anita@email.com', phone: '9876543204', bankName: 'Kotak Mahindra Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(70), createdBy: 'operator' },
  { id: 'LN005', customerName: 'Vikram Singh', customerId: 5, loanType: 'LAP', amount: 3500000, status: 'In-Process', email: 'vikram@email.com', phone: '9876543205', bankName: 'State Bank of India', assignedTo: 'Priya Mehta', createdAt: dateStr(65), createdBy: 'admin' },
  { id: 'LN006', customerName: 'Meena Iyer', customerId: 6, loanType: 'Education Loan', amount: 600000, status: 'Completed', email: 'meena@email.com', phone: '9876543206', bankName: 'State Bank of India', assignedTo: 'Karthik Rao', createdAt: dateStr(60), createdBy: 'operator' },
  { id: 'LN007', customerName: 'Deepak Nair', customerId: 7, loanType: 'Personal Loan', amount: 300000, status: 'In-Process', email: 'deepak@email.com', phone: '9876543207', bankName: 'Bajaj Finserv', assignedTo: 'Priya Mehta', createdAt: dateStr(55), createdBy: 'admin' },
  { id: 'LN008', customerName: 'Sunita Rao', customerId: 8, loanType: 'Home Loan', amount: 4000000, status: 'Is-Disbursement', email: 'sunita@email.com', phone: '9876543208', bankName: 'HDFC Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(50), createdBy: 'operator' },
  { id: 'LN009', customerName: 'Ravi Gupta', customerId: 9, loanType: 'Business Loan', amount: 1000000, status: 'Rejected', email: 'ravi@email.com', phone: '9876543209', bankName: 'ICICI Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(45), createdBy: 'admin' },
  { id: 'LN010', customerName: 'Kavitha Menon', customerId: 10, loanType: 'Medical Loan', amount: 250000, status: 'Completed', email: 'kavitha@email.com', phone: '9876543210', bankName: 'Bajaj Finserv', assignedTo: 'Karthik Rao', createdAt: dateStr(40), createdBy: 'operator' },
  { id: 'LN011', customerName: 'Arun Pillai', customerId: 11, loanType: 'Home Loan', amount: 3200000, status: 'In-Process', email: 'arun@email.com', phone: '9876543211', bankName: 'Axis Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(35), createdBy: 'admin' },
  { id: 'LN012', customerName: 'Lakshmi Devi', customerId: 12, loanType: 'Personal Loan', amount: 450000, status: 'Completed', email: 'lakshmi@email.com', phone: '9876543212', bankName: 'HDFC Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(30), createdBy: 'operator' },
  { id: 'LN013', customerName: 'Nikhil Joshi', customerId: 13, loanType: 'Vehicle Loan', amount: 700000, status: 'Is-Disbursement', email: 'nikhil@email.com', phone: '9876543213', bankName: 'Kotak Mahindra Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(25), createdBy: 'admin' },
  { id: 'LN014', customerName: 'Shobha Reddy', customerId: 14, loanType: 'LAP', amount: 2800000, status: 'In-Process', email: 'shobha@email.com', phone: '9876543214', bankName: 'State Bank of India', assignedTo: 'Karthik Rao', createdAt: dateStr(15), createdBy: 'operator' },
  { id: 'LN015', customerName: 'Manoj Tiwari', customerId: 15, loanType: 'Business Loan', amount: 1200000, status: 'In-Process', email: 'manoj@email.com', phone: '9876543215', bankName: 'ICICI Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(8), createdBy: 'admin' },
  { id: 'LN016', customerName: 'Rahul Sharma', customerId: 1, loanType: 'Personal Loan', amount: 200000, status: 'Completed', email: 'rahul@email.com', phone: '9876543201', bankName: 'Axis Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(5), createdBy: 'operator' },
  { id: 'LN017', customerName: 'Priya Verma', customerId: 2, loanType: 'Education Loan', amount: 800000, status: 'In-Process', email: 'priya@email.com', phone: '9876543202', bankName: 'State Bank of India', assignedTo: 'Priya Mehta', createdAt: dateStr(3), createdBy: 'admin' },
  { id: 'LN018', customerName: 'Vikram Singh', customerId: 5, loanType: 'Medical Loan', amount: 150000, status: 'Completed', email: 'vikram@email.com', phone: '9876543205', bankName: 'Bajaj Finserv', assignedTo: 'Karthik Rao', createdAt: dateStr(2), createdBy: 'operator' },
  { id: 'LN019', customerName: 'Meena Iyer', customerId: 6, loanType: 'Home Loan', amount: 5000000, status: 'Is-Disbursement', email: 'meena@email.com', phone: '9876543206', bankName: 'HDFC Bank', assignedTo: 'Priya Mehta', createdAt: dateStr(1), createdBy: 'admin' },
  { id: 'LN020', customerName: 'Suresh Kumar', customerId: 3, loanType: 'Personal Loan', amount: 350000, status: 'In-Process', email: 'suresh@email.com', phone: '9876543203', bankName: 'ICICI Bank', assignedTo: 'Karthik Rao', createdAt: dateStr(0), createdBy: 'operator' },
];

// ── Documents ─────────────────────────────────────────────────────────────────
const DOC_TYPES = ['Aadhaar Card', 'PAN Card', 'Income Proof', 'Bank Statement', 'Property Papers', 'ITR', 'Salary Slip', 'Passport'];
const DOC_STATUSES = ['Pending', 'Submitted', 'Verified', 'Rejected'];

export const INITIAL_DOCUMENTS = [
  { id: 'DOC001', fileId: 'LN001', customerName: 'Rahul Sharma', docType: 'Aadhaar Card', docName: 'aadhaar_rahul.pdf', uploadDate: dateStr(84), status: 'Verified', remarks: 'Clear scan', uploadedBy: 'operator' },
  { id: 'DOC002', fileId: 'LN001', customerName: 'Rahul Sharma', docType: 'PAN Card', docName: 'pan_rahul.pdf', uploadDate: dateStr(83), status: 'Verified', remarks: '', uploadedBy: 'operator' },
  { id: 'DOC003', fileId: 'LN002', customerName: 'Priya Verma', docType: 'Aadhaar Card', docName: 'aadhaar_priya.pdf', uploadDate: dateStr(79), status: 'Submitted', remarks: '', uploadedBy: 'operator' },
  { id: 'DOC004', fileId: 'LN002', customerName: 'Priya Verma', docType: 'Income Proof', docName: 'income_priya.pdf', uploadDate: dateStr(78), status: 'Pending', remarks: 'Awaiting review', uploadedBy: 'operator' },
  { id: 'DOC005', fileId: 'LN003', customerName: 'Suresh Kumar', docType: 'Bank Statement', docName: 'bank_suresh.pdf', uploadDate: dateStr(74), status: 'Verified', remarks: 'OK', uploadedBy: 'admin' },
  { id: 'DOC006', fileId: 'LN004', customerName: 'Anita Patel', docType: 'ITR', docName: 'itr_anita.pdf', uploadDate: dateStr(69), status: 'Rejected', remarks: 'Incomplete document', uploadedBy: 'operator' },
  { id: 'DOC007', fileId: 'LN005', customerName: 'Vikram Singh', docType: 'Property Papers', docName: 'property_vikram.pdf', uploadDate: dateStr(64), status: 'Pending', remarks: '', uploadedBy: 'admin' },
  { id: 'DOC008', fileId: 'LN006', customerName: 'Meena Iyer', docType: 'Salary Slip', docName: 'salary_meena.pdf', uploadDate: dateStr(59), status: 'Verified', remarks: 'Last 3 months', uploadedBy: 'operator' },
  { id: 'DOC009', fileId: 'LN007', customerName: 'Deepak Nair', docType: 'Aadhaar Card', docName: 'aadhaar_deepak.pdf', uploadDate: dateStr(54), status: 'Submitted', remarks: '', uploadedBy: 'operator' },
  { id: 'DOC010', fileId: 'LN008', customerName: 'Sunita Rao', docType: 'PAN Card', docName: 'pan_sunita.pdf', uploadDate: dateStr(49), status: 'Verified', remarks: 'Original verified', uploadedBy: 'admin' },
  { id: 'DOC011', fileId: 'LN011', customerName: 'Arun Pillai', docType: 'Aadhaar Card', docName: 'aadhaar_arun.pdf', uploadDate: dateStr(33), status: 'Submitted', remarks: '', uploadedBy: 'operator' },
  { id: 'DOC012', fileId: 'LN011', customerName: 'Arun Pillai', docType: 'Income Proof', docName: 'income_arun.pdf', uploadDate: dateStr(32), status: 'Pending', remarks: 'Awaiting HR letter', uploadedBy: 'operator' },
  { id: 'DOC013', fileId: 'LN013', customerName: 'Nikhil Joshi', docType: 'PAN Card', docName: 'pan_nikhil.pdf', uploadDate: dateStr(24), status: 'Verified', remarks: '', uploadedBy: 'admin' },
  { id: 'DOC014', fileId: 'LN013', customerName: 'Nikhil Joshi', docType: 'Bank Statement', docName: 'bank_nikhil.pdf', uploadDate: dateStr(23), status: 'Submitted', remarks: '6 months statement', uploadedBy: 'operator' },
  { id: 'DOC015', fileId: 'LN015', customerName: 'Manoj Tiwari', docType: 'Aadhaar Card', docName: 'aadhaar_manoj.pdf', uploadDate: dateStr(7), status: 'Submitted', remarks: '', uploadedBy: 'operator' },
  { id: 'DOC016', fileId: 'LN019', customerName: 'Meena Iyer', docType: 'Property Papers', docName: 'property_meena.pdf', uploadDate: dateStr(1), status: 'Pending', remarks: 'Valuation pending', uploadedBy: 'admin' },
];

// ── Commissions ───────────────────────────────────────────────────────────────
export const INITIAL_COMMISSIONS = [
  { id: 'COM001', fileId: 'LN001', customerName: 'Rahul Sharma', bankName: 'HDFC Bank', loanType: 'Home Loan', loanAmount: 2500000, commissionPct: 1.0, commissionAmt: 25000, paymentStatus: 'Paid', paymentDate: dateStr(60), paymentMode: 'Bank Transfer', assignedTo: 'Priya Mehta', remarks: 'Disbursed on time' },
  { id: 'COM002', fileId: 'LN003', customerName: 'Suresh Kumar', bankName: 'Axis Bank', loanType: 'Business Loan', loanAmount: 1500000, commissionPct: 1.5, commissionAmt: 22500, paymentStatus: 'Processing', paymentDate: null, paymentMode: 'UPI', assignedTo: 'Karthik Rao', remarks: '' },
  { id: 'COM003', fileId: 'LN006', customerName: 'Meena Iyer', bankName: 'State Bank of India', loanType: 'Education Loan', loanAmount: 600000, commissionPct: 0.75, commissionAmt: 4500, paymentStatus: 'Paid', paymentDate: dateStr(30), paymentMode: 'Bank Transfer', assignedTo: 'Priya Mehta', remarks: '' },
  { id: 'COM004', fileId: 'LN010', customerName: 'Kavitha Menon', bankName: 'Bajaj Finserv', loanType: 'Medical Loan', loanAmount: 250000, commissionPct: 2.0, commissionAmt: 5000, paymentStatus: 'Pending', paymentDate: null, paymentMode: '', assignedTo: 'Karthik Rao', remarks: 'Invoice pending' },
  { id: 'COM005', fileId: 'LN012', customerName: 'Lakshmi Devi', bankName: 'HDFC Bank', loanType: 'Personal Loan', loanAmount: 450000, commissionPct: 1.25, commissionAmt: 5625, paymentStatus: 'Paid', paymentDate: dateStr(10), paymentMode: 'Bank Transfer', assignedTo: 'Priya Mehta', remarks: '' },
  { id: 'COM006', fileId: 'LN016', customerName: 'Rahul Sharma', bankName: 'Axis Bank', loanType: 'Personal Loan', loanAmount: 200000, commissionPct: 1.5, commissionAmt: 3000, paymentStatus: 'Pending', paymentDate: null, paymentMode: '', assignedTo: 'Karthik Rao', remarks: '' },
  { id: 'COM007', fileId: 'LN018', customerName: 'Vikram Singh', bankName: 'Bajaj Finserv', loanType: 'Medical Loan', loanAmount: 150000, commissionPct: 2.0, commissionAmt: 3000, paymentStatus: 'Paid', paymentDate: dateStr(2), paymentMode: 'UPI', assignedTo: 'Priya Mehta', remarks: '' },
  { id: 'COM008', fileId: 'LN008', customerName: 'Sunita Rao', bankName: 'HDFC Bank', loanType: 'Home Loan', loanAmount: 4000000, commissionPct: 1.0, commissionAmt: 40000, paymentStatus: 'Processing', paymentDate: null, paymentMode: 'Bank Transfer', assignedTo: 'Karthik Rao', remarks: 'Large disbursal' },
];

// ── Executive Assignments ──────────────────────────────────────────────────────
export const INITIAL_ASSIGNMENTS = [
  { id: 'ASN001', fileId: 'LN001', customerName: 'Rahul Sharma', bankName: 'HDFC Bank', loanType: 'Home Loan', loanAmount: 2500000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Completed', assignedDate: dateStr(84), dueDate: dateStr(60) },
  { id: 'ASN002', fileId: 'LN002', customerName: 'Priya Verma', bankName: 'ICICI Bank', loanType: 'Personal Loan', loanAmount: 500000, executiveName: 'Karthik Rao', executiveEmail: 'karthik@ajfinance.com', status: 'Active', assignedDate: dateStr(79), dueDate: dateStr(30) },
  { id: 'ASN003', fileId: 'LN003', customerName: 'Suresh Kumar', bankName: 'Axis Bank', loanType: 'Business Loan', loanAmount: 1500000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Active', assignedDate: dateStr(74), dueDate: dateStr(20) },
  { id: 'ASN004', fileId: 'LN005', customerName: 'Vikram Singh', bankName: 'State Bank of India', loanType: 'LAP', loanAmount: 3500000, executiveName: 'Karthik Rao', executiveEmail: 'karthik@ajfinance.com', status: 'Pending', assignedDate: dateStr(64), dueDate: dateStr(5) },
  { id: 'ASN005', fileId: 'LN007', customerName: 'Deepak Nair', bankName: 'Bajaj Finserv', loanType: 'Personal Loan', loanAmount: 300000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Active', assignedDate: dateStr(54), dueDate: dateStr(10) },
  { id: 'ASN006', fileId: 'LN008', customerName: 'Sunita Rao', bankName: 'HDFC Bank', loanType: 'Home Loan', loanAmount: 4000000, executiveName: 'Karthik Rao', executiveEmail: 'karthik@ajfinance.com', status: 'Active', assignedDate: dateStr(49), dueDate: dateStr(15) },
  { id: 'ASN007', fileId: 'LN011', customerName: 'Arun Pillai', bankName: 'Axis Bank', loanType: 'Home Loan', loanAmount: 3200000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Active', assignedDate: dateStr(34), dueDate: dateStr(7) },
  { id: 'ASN008', fileId: 'LN013', customerName: 'Nikhil Joshi', bankName: 'Kotak Mahindra Bank', loanType: 'Vehicle Loan', loanAmount: 700000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Active', assignedDate: dateStr(24), dueDate: dateStr(3) },
  { id: 'ASN009', fileId: 'LN015', customerName: 'Manoj Tiwari', bankName: 'ICICI Bank', loanType: 'Business Loan', loanAmount: 1200000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Pending', assignedDate: dateStr(7), dueDate: dateStr(-5) },
  { id: 'ASN010', fileId: 'LN019', customerName: 'Meena Iyer', bankName: 'HDFC Bank', loanType: 'Home Loan', loanAmount: 5000000, executiveName: 'Priya Mehta', executiveEmail: 'executive@ajfinance.com', status: 'Active', assignedDate: dateStr(1), dueDate: dateStr(-10) },
];

// ── LocalStorage helpers ───────────────────────────────────────────────────────
const DATA_VERSION = 'v3';
const CRM_KEYS = ['crm_users','crm_banks','crm_customers','crm_loans','crm_documents','crm_commissions','crm_assignments'];

export function initMockData() {
  if (localStorage.getItem('crm_data_version') !== DATA_VERSION) {
    CRM_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('crm_data_version', DATA_VERSION);
  }
  if (!localStorage.getItem('crm_users')) localStorage.setItem('crm_users', JSON.stringify(INITIAL_USERS));
  if (!localStorage.getItem('crm_banks')) localStorage.setItem('crm_banks', JSON.stringify(INITIAL_BANKS));
  if (!localStorage.getItem('crm_customers')) localStorage.setItem('crm_customers', JSON.stringify(INITIAL_CUSTOMERS));
  if (!localStorage.getItem('crm_loans')) localStorage.setItem('crm_loans', JSON.stringify(INITIAL_LOANS));
  if (!localStorage.getItem('crm_documents')) localStorage.setItem('crm_documents', JSON.stringify(INITIAL_DOCUMENTS));
  if (!localStorage.getItem('crm_commissions')) localStorage.setItem('crm_commissions', JSON.stringify(INITIAL_COMMISSIONS));
  if (!localStorage.getItem('crm_assignments')) localStorage.setItem('crm_assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
}

export const store = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  add: (key, item) => { const arr = store.get(key); arr.push(item); store.set(key, arr); },
  update: (key, id, updates) => {
    const arr = store.get(key);
    const idx = arr.findIndex(i => String(i.id) === String(id));
    if (idx > -1) { arr[idx] = { ...arr[idx], ...updates }; store.set(key, arr); }
  },
  remove: (key, id) => store.set(key, store.get(key).filter(i => String(i.id) !== String(id))),
};
