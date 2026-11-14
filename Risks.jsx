import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { RISK_GROUPS } from '../../data/risks';
import { ALL_TRAINING } from '../../data/training';

export default function Risks() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const focus = params.get('risk'); // /risks?risk=bone highlights and scrolls to that risk

  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`risk-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    return () => clearTimeout(t);
  }, [focus]);

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Spaceflight Health Risks</h1>
        <p>Overview of the physiological, operational, and behavioral risks of human spaceflight, and the training that helps reduce them</p>
      </div>

      {RISK_GROUPS.map((g) => (
        <div key={g.id}>
          <h2 className="training-group-title">{g.title}</h2>
          <div className="risk-grid">
            {g.items.map((r) => {
              const related = ALL_TRAINING.filter((t) => t.riskId === r.id);
              return (
                <div key={r.id} id={`risk-${r.id}`} className={`glass-card risk-card${focus === r.id ? ' focus' : ''}`}>
                  <span className="week-tag">RISK {r.code}</span>
                  <h3>{r.title}</h3>
                  <p className="risk-desc">{r.description}</p>
                  <div className="risk-impact"><strong>Mission impact</strong>{r.impact}</div>
                  <div className="related-list">
                    {related.length > 0
                      ? related.map((t) => (
                          <button key={t.id} className="btn-sm" onClick={() => nav(`/training?open=${t.id}`)}><Dumbbell size={13} />{t.short}</button>
                        ))
                      : <span className="no-training">No training module linked yet.</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="disclaimer">Educational overview based on NASA Human Research Program risk categories. Not clinical guidance.</p>
    </section>
  );
}
