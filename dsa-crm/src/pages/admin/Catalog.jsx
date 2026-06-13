import Layout from '../../components/Layout';
import { BANKS } from '../../data/constants';
import { money } from '../../components/ui';
import { IcBank } from '../../components/icons';

// Bank / NBFC product catalog (spec §9). Criteria here power the
// "matching lenders" panel on each lead's detail screen.
export default function Catalog() {
  return (
    <Layout title="Bank / NBFC Catalog" subtitle="Lender products & eligibility criteria used to match leads">
      <div className="grid cols-3">
        {BANKS.map((b) => (
          <div className="card card-pad" key={b.id}>
            <div className="flex" style={{ marginBottom: 12 }}>
              <div className="stat-ico" style={{ margin: 0, background: 'rgba(27,58,107,.1)', color: 'var(--navy)' }}><IcBank /></div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{b.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>from {b.roi} p.a.</div>
              </div>
            </div>
            <div className="wrap-gap" style={{ marginBottom: 12 }}>
              {b.products.map((p) => <span className="chip" key={p}>{p}</span>)}
            </div>
            <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="between"><span className="muted">Min income</span><strong>{money(b.minIncome)}/mo</strong></div>
              <div className="between"><span className="muted">Min CIBIL</span><strong>{b.minCibil}</strong></div>
              <div className="between"><span className="muted">Max loan</span><strong>{money(b.maxAmount)}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
