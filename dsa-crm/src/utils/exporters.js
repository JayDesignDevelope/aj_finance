import * as XLSX from 'xlsx';
import { getUser } from '../api/db';

// Export leads to .xlsx (spec §3.1 "Export reports")
export function exportLeadsXlsx(leads, filename = 'leads') {
  const rows = leads.map((l) => ({
    Name: l.name, Phone: l.phone, Email: l.email, City: l.city,
    Product: l.product, Amount: l.amount, Income: l.income, Employment: l.employment,
    Source: l.source, Stage: l.stage, Label: l.label || '',
    'Assigned To': l.assignedTo ? (getUser(l.assignedTo)?.name || '') : 'Unassigned',
    CIBIL: l.cibil || '', DND: l.dnd ? 'Yes' : 'No',
    'Rejection Reason': l.rejectionReason || '', Notes: l.notes || '',
    Created: new Date(l.createdAt).toLocaleString('en-IN'),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Print-to-PDF via the browser print dialog (spec §3.1 "PDF")
export function printReport() { window.print(); }
