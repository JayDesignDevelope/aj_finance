import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { ArrowLeft, Edit, User, FileText, Phone, Mail, MapPin } from 'lucide-react';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customers = store.get('crm_customers');
  const customer = customers.find(c => String(c.id) === id);
  const loans = store.get('crm_loans').filter(l => String(l.customerId) === id);
  const docs = store.get('crm_documents').filter(d => String(d.customerId) === id);

  if (!customer) {
    return (
      <Layout title="Customer Detail">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          Customer not found. <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/customers')}>Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customer Detail">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/customers')}><ArrowLeft size={16} /> Back</button>
          <h1>{customer.name}</h1>
          <Badge status={customer.status} />
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/edit-customer/${id}`)}>
            <Edit size={14} /> Edit
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><span className="card-title"><User size={16} /> Personal Info</span></div>
            <div className="card-body">
              <div className="detail-rows">
                <DetailRow label="Customer ID" value={customer.id} mono />
                <DetailRow label="Full Name" value={customer.name} bold />
                <DetailRow label="Email" value={<><Mail size={12} style={{ marginRight: 4 }} />{customer.email}</>} />
                <DetailRow label="Phone" value={<><Phone size={12} style={{ marginRight: 4 }} />{customer.contact}</>} />
                <DetailRow label="City" value={<><MapPin size={12} style={{ marginRight: 4 }} />{customer.district}</>} />
                <DetailRow label="Status" value={<Badge status={customer.status} />} />
                <DetailRow label="Joined" value={customer.registeredAt} />
                {customer.notes && <DetailRow label="Notes" value={customer.notes} />}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title"><FileText size={16} /> Documents ({docs.length})</span></div>
            <div className="card-body" style={{ padding: 0 }}>
              {docs.length === 0 ? (
                <p style={{ padding: '16px 20px', color: 'var(--gray)', fontSize: 13 }}>No documents.</p>
              ) : (
                <table>
                  <thead><tr><th>File</th><th>Type</th><th>Status</th></tr></thead>
                  <tbody>
                    {docs.map(d => (
                      <tr key={d.id}>
                        <td>{d.fileName}</td>
                        <td className="td-muted">{d.docType}</td>
                        <td><Badge status={d.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title"><FileText size={16} /> Loan History ({loans.length})</span></div>
          <div className="card-body" style={{ padding: 0 }}>
            {loans.length === 0 ? (
              <p style={{ padding: '16px 20px', color: 'var(--gray)', fontSize: 13 }}>No loans yet.</p>
            ) : (
              <table>
                <thead><tr><th>Loan ID</th><th>Type</th><th>Amount</th><th>Bank</th><th>Status</th></tr></thead>
                <tbody>
                  {loans.map(l => (
                    <tr key={l.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/loan-files/${l.id}`)}>
                      <td><span className="td-mono">{l.id}</span></td>
                      <td>{l.loanType}</td>
                      <td><strong>₹{Number(l.amount).toLocaleString('en-IN')}</strong></td>
                      <td className="td-muted">{l.bankName}</td>
                      <td><Badge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function DetailRow({ label, value, mono, bold }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className={`detail-value${mono ? ' td-mono' : ''}${bold ? ' detail-bold' : ''}`}>{value}</span>
    </div>
  );
}
