export function statusClass(status) {
  const map = {
    'In-Process': 'badge-blue',
    'Is-Disbursement': 'badge-gold',
    'Completed': 'badge-primary',
    'Rejected': 'badge-red',
    'Active': 'badge-primary',
    'Inactive': 'badge-gray',
    'Pending': 'badge-gold',
    'Submitted': 'badge-blue',
    'Verified': 'badge-primary',
    'Processing': 'badge-purple',
    'Paid': 'badge-primary',
    'ADMIN': 'badge-purple',
    'DATA_OPERATOR': 'badge-blue',
    'MARKETING_EXECUTIVE': 'badge-gold',
    'BANK_EXECUTIVE': 'badge-primary',
  };
  return map[status] || 'badge-gray';
}

export default function Badge({ status, label }) {
  return (
    <span className={`badge ${statusClass(status)}`}>
      {label || status}
    </span>
  );
}
