import { useNavigate } from 'react-router-dom';
import { HeartPulse, Droplets, Thermometer, Activity, Brain, ShieldAlert, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVitals } from '../../context/VitalsContext';
import { db } from '../../utils/storage';
import { rate } from '../../utils/rating';

export default function Dashboard() {
  const { user } = useAuth();
  const { v, ok, allOk, worst, adv, conditions } = useVitals();

  const nav = useNavigate();

  const scores = db.get(`scores:${user.email}`, []);
  const avg = scores.length ? scores.reduce((s, x) => s + x.score, 0) / scores.length : null;
  const rating = avg !== null ? rate(avg) : null;

  const Note = ({ good, a, b }) => <p className={`vital-note${good ? '' : ' warn'}`}>● {good ? a : b}</p>;

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Mission Wellness Overview</h1>
        <p>Real-time telemetry and daily mission readiness summary</p>
      </div>

      <div className="dash-grid">
        <div className="glass-card hero-astronaut">
          <div>
            <span className="eyebrow">Crew member · {user.name}</span>
            <h2 style={{ marginTop: 4 }}>Astronaut Telemetry</h2>
          </div>
          <div className={`planet-orb${worst === 'red' ? ' bad' : allOk ? '' : ' warn'}`} />
          <div className={`status-pill${allOk ? '' : ' warn'}`}>
            <div className="status-dot" />
            <span>Health Status: <strong>{allOk ? 'Optimal' : worst === 'red' ? 'Critical' : 'Attention Required'}</strong></span>
          </div>
          {adv.some((a) => a.level !== 'green') && (
            <p className="vital-note warn" style={{ marginTop: 12 }}>
              Flagged: {adv.filter((a) => a.level !== 'green').map((a) => a.short).join(', ')}
            </p>
          )}
        </div>

        <div className="vitals-mini-grid">
          <div className="glass-card mini-vital">
            <h4><HeartPulse size={16} color="#f43f5e" />Heart Rate</h4>
            <div className="val">{v.hr} <span>BPM</span></div>
            <Note good={ok.hr} a="Within Normal Range" b="Outside Normal Range" />
          </div>
          <div className="glass-card mini-vital">
            <h4><Droplets size={16} color="#38bdf8" />SpO₂ Level</h4>
            <div className="val">{v.spo2} <span>%</span></div>
            <Note good={ok.spo2} a="Optimal Saturation" b="Low Saturation" />
          </div>
          <div className="glass-card mini-vital">
            <h4><Thermometer size={16} color="#fbbf24" />Body Temp</h4>
            <div className="val">{v.temp.toFixed(1)} <span>°C</span></div>
            <Note good={ok.temp} a="Stable Core Temp" b="Abnormal Temp" />
          </div>
          <div className="glass-card mini-vital">
            <h4><Activity size={16} color="#c084fc" />Blood Pressure</h4>
            <div className="val">{v.sys}/{v.dia} <span>mmHg</span></div>
            <Note good={ok.bp} a="Normal Pressure" b="Abnormal Pressure" />
          </div>
        </div>
      </div>

      <div className="dash-extra">
        <div className="glass-card extra-card" onClick={() => nav('/tests')}>
          <div className="icon-box"><Brain size={22} /></div>
          <div>
            <div className="big">{rating ? `${Math.round(avg)}/100 · ${rating.label}` : 'Not tested yet'}</div>
            <div className="sub">Cognitive rating</div>
          </div>
        </div>
        <div className="glass-card extra-card" onClick={() => nav('/profile')}>
          <div className="icon-box"><ShieldAlert size={22} /></div>
          <div>
            <div className="big">{conditions.length}</div>
            <div className="sub">Chronic conditions monitored</div>
          </div>
        </div>
        <div className="glass-card extra-card" onClick={() => nav('/training')}>
          <div className="icon-box"><Dumbbell size={22} /></div>
          <div>
            <div className="big">{db.get(`training:${user.email}`, []).length}</div>
            <div className="sub">Training sessions completed</div>
          </div>
        </div>
      </div>
    </section>
  );
}