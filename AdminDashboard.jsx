import useStorage, { useStorageVersion } from '../../hooks/useStorage';
import { cognitive } from '../../utils/crew';

export default function AdminDashboard() {
  const [users] = useStorage('users', []);
  const [incidents] = useStorage('incidents', []);
  useStorageVersion(); // per-member keys (scores:{email}) also update this page live

  const crew = users.filter((u) => u.role === 'user');

  const rows = crew.map((u) => ({ ...u, ...cognitive(u.email) }));
  const rated = rows.filter((r) => r.avg !== null);
  const fleetAvg = rated.length ? Math.round(rated.reduce((a, r) => a + r.avg, 0) / rated.length) : '—';
  const atRisk = rows.filter((r) => r.key === 'poor').length;

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Mission Admin Overview</h1>
        <p>Crew health overview</p>
      </div>

      <div className="admin-stats">
        <div className="glass-card"><div className="stat-num">{crew.length}</div><div className="stat-label">Registered crew</div></div>
        <div className="glass-card"><div className="stat-num">{fleetAvg}</div><div className="stat-label">Average cognitive score</div></div>
        <div className="glass-card"><div className="stat-num" style={{ color: atRisk ? '#f87171' : undefined }}>{atRisk}</div><div className="stat-label">Crew rated Poor</div></div>
        <div className="glass-card"><div className="stat-num">{incidents.length}</div><div className="stat-label">Alert incidents</div></div>
      </div>

      <div className="glass-card" style={{ marginBottom: 24 }}>
        <p className="section-title">Crew members</p>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Name</th><th>Age</th><th>Email</th><th>Chronic conditions</th><th>Tests</th><th>Rating</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan="6" style={{ color: 'var(--text-muted)' }}>No crew registered yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.email}>
                  <td>{r.name}</td><td>{r.age}</td><td>{r.email}</td>
                  <td>{r.conditions?.length ? r.conditions.join(', ') : 'None'}</td>
                  <td>{r.plays}</td>
                  <td>{r.rating ? <span className={`rating-${r.key}`}>{Math.round(r.avg)} · {r.rating.label}</span> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card">
        <p className="section-title">Alert incidents</p>
        {incidents.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No incidents recorded.</p>}
        {incidents.map((i, k) => (
          <div key={k} className="incident-row">
            <span>{i.name} ({i.email}){i.source === 'admin' ? ' · triggered by admin' : ''}</span>
            <span style={{ color: 'var(--text-muted)' }}>{new Date(i.time).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
