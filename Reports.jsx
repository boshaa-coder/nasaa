import { useState } from 'react';
import { Heart, Droplets, ArrowRight } from 'lucide-react';
import Modal from '../../components/Modal';
import { REPORTS } from '../../data/content';

export default function Reports() {
  const [sel, setSel] = useState(null);
  const rep = sel !== null ? REPORTS[sel] : null;
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Weekly Health & Training Reports</h1>
        <p>Select any weekly archive card below to inspect the 7-day breakdown and weekly conclusion</p>
      </div>

      <div className="reports-history-grid">
        {REPORTS.map((r, i) => (
          <button key={r.title} className="glass-card report-history-card" onClick={() => setSel(i)}>
            <div>
              <div className="week-tag">{r.weekLabel}</div>
              <h3>{r.title}</h3>
              <p>7-Day Monitoring Period · Daily Vitals & Conclusion</p>
            </div>
            <div className="report-card-footer"><span>{r.badge}</span><span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>Open Report <ArrowRight size={14} /></span></div>
          </button>
        ))}
      </div>

      {rep && (
        <Modal onClose={() => setSel(null)}>
          <div style={{ marginBottom: 16 }}>
            <span className="week-tag">ORBIT CARE — WEEKLY DAILY REPORT</span>
            <h2 style={{ fontSize: 24, marginTop: 4 }}>{rep.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>7-day monitoring period · Daily recorded measurements</p>
          </div>
          <div className="daily-report-list">
            {rep.days.map(([day, status, hr, spo2]) => (
              <div key={day} className="day-row">
                <div className="day-name">{day}</div>
                <div className="day-training">{status}</div>
                <div className="day-vitals"><span><Heart size={13} color="#f43f5e" />{hr}</span><span><Droplets size={13} color="#38bdf8" />{spo2}</span></div>
              </div>
            ))}
          </div>
          <div className="conclusion-box"><h4>WEEKLY CONCLUSION & RECOMMENDATIONS</h4><p>{rep.conclusion}</p></div>
        </Modal>
      )}
    </section>
  );
}
