import { useAuth } from '../../context/AuthContext';
import { db } from '../../utils/storage';
import { rate } from '../../utils/rating';

export default function Profile() {
  const { user } = useAuth();
  const scores = db.get(`scores:${user.email}`, []);
  const avg = scores.length ? scores.reduce((s, x) => s + x.score, 0) / scores.length : null;

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your registered information and medical history</p>
      </div>

      <div className="profile-grid">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
          <h2>{user.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{user.email}</p>
        </div>

        <div className="glass-card">
          <div className="info-row"><span>Name</span><span>{user.name}</span></div>
          <div className="info-row"><span>Age</span><span>{user.age}</span></div>
          <div className="info-row"><span>Email</span><span>{user.email}</span></div>
          <div className="info-row"><span>Tests played</span><span>{scores.length}</span></div>
          <div className="info-row"><span>Cognitive rating</span><span>{avg !== null ? `${Math.round(avg)}/100 · ${rate(avg).label}` : 'Not tested yet'}</span></div>
          <div style={{ marginTop: 22 }}>
            <p className="section-title">Chronic conditions</p>
            {user.conditions?.length
              ? <div className="tag-list">{user.conditions.map((c) => <span key={c} className="tag">{c}</span>)}</div>
              : <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>None reported.</p>}
          </div>
        </div>
      </div>
      <p className="disclaimer">Educational prototype. Not a substitute for professional medical diagnosis.</p>
    </section>
  );
}
