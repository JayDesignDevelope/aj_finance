import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Badge from '../../components/ui/Badge';
import { store } from '../../utils/mockData';
import { ArrowLeft, Edit, FileText, User, Building2, Calendar, DollarSign, Clock } from 'lucide-react';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loans = store.get('crm_loans');
  const loan = loans.find(l => l.id === id);

  const customers = store.get('crm_customers');
  const customer = customers.find(c => c.id === loan?.customerId);
  const docs = store.get('crm_documents').filter(d => d.loanId === id || d.fileId === id);
  const commissions = store.get('crm_commissions').filter(c => c.fileId === id);

  if (!loan) {
    return (
      <Layout title="Loan Detail">
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>
          <FileText size={40} style={{ marginBottom: 12 }} />
          <p>Loan not found.</p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/admin/loan-files')}>Back to Loans</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Loan Detail">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/loan-files')}><ArrowLeft size={16} /> Back</button>
          <h1>{loan.id}</h1>
          <Badge status={loan.status} />
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/edit-loan/${loan.id}`)}>
            <Edit size={14} /> Edit Loan
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Loan Info */}
          <div className="card">
            <div className="card-header"><span className="card-title"><FileText size={16} /> Loan Information</span></div>
            <div className="card-body">
              <div className="detail-rows">
                <DetailRow label="Loan ID" value={loan.id} mono />
                <DetailRow label="Loan Type" value={loan.loanType} />
                <DetailRow label="Amount" value={`₹${Number(loan.amount).toLocaleString('en-IN')}`} bold />
                <DetailRow label="Bank" value={loan.bankName} />
                <DetailRow label="Status" value={<Badge status={loan.status} />} />
                <DetailRow label="Created" value={loan.createdAt} />
                {loan.notes && <DetailRow label="Notes" value={loan.notes} />}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><FileText size={16} /> Documents ({docs.length})</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {docs.length === 0 ? (
                <p style={{ padding: '16px 20px', color: 'var(--gray)', fontSize: 13 }}>No documents uploaded.</p>
              ) : (
                <table>
                  <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Uploaded</th></tr></thead>
                  <tbody>
                    {docs.map(d => (
                      <tr key={d.id}>
                        <td>{d.fileName}</td>
                        <td className="td-muted">{d.docType}</td>
                        <td><Badge status={d.status} /></td>
                        <td className="td-muted">{d.uploadedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Customer Info */}
          <div className="card">
            <div className="card-header"><span className="card-title"><User size={16} /> Customer</span></div>
            <div className="card-body">
              {customer ? (
                <div className="detail-rows">
                  <DetailRow label="Name" value={customer.name} bold />
                  <DetailRow label="Email" value={customer.email} />
                  <DetailRow label="Phone" value={customer.phone} />
                  <DetailRow label="City" value={customer.city} />
                  <DetailRow label="Status" value={<Badge status={customer.status} />} />
                </div>
              ) : (
                <p style={{ color: 'var(--gray)', fontSize: 13 }}>{loan.customerName}</p>
              )}
            </div>
          </div>

          {/* Commission */}
          <div className="card">
            <div className="card-header"><span className="card-title"><DollarSign size={16} /> Commission</span></div>
            <div className="card-body" style={{ padding: 0 }}>
              {commissions.length === 0 ? (
                <p style={{ padding: '16px 20px', color: 'var(--gray)', fontSize: 13 }}>No commission records.</p>
              ) : (
                <table>
                  <thead><tr><th>Amount</th><th>Rate</th><th>Status</th></tr></thead>
                  <tbody>
                    {commissions.map(c => (
                      <tr key={c.id}>
                        <td><strong>₹{Number(c.commissionAmt).toLocaleString('en-IN')}</strong></td>
                        <td className="td-muted">{c.commissionPct}%</td>
                        <td><Badge status={c.paymentStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="card-header"><span className="card-title"><Clock size={16} /> Timeline</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <TimelineItem label="Application Created" date={loan.createdAt} done />
                <TimelineItem label="In-Process" date={loan.status !== 'Rejected' ? loan.createdAt : null} done={['In-Process','Is-Disbursement','Completed'].includes(loan.status)} />
                <TimelineItem label="Disbursement" done={['Is-Disbursement','Completed'].includes(loan.status)} />
                <TimelineItem label="Completed" done={loan.status === 'Completed'} />
              </div>
            </div>
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

function TimelineItem({ label, date, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--primary)' : 'var(--border)', border: `2px solid ${done ? 'var(--primary)' : 'var(--border)'}`
      }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: done ? 600 : 400, color: done ? 'var(--text)' : 'var(--gray)' }}>{label}</div>
        {date && <div style={{ fontSize: 11, color: 'var(--gray)' }}>{date}</div>}
      </div>
    </div>
  );
}
