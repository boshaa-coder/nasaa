import { HeartPulse, Droplets, Thermometer, Activity, Wind, Moon, Info, Waves, Timer, Radiation, Gauge, Dumbbell, Smile, Eye, Lightbulb } from 'lucide-react';
import { useVitals } from '../../context/VitalsContext';
import { AGENT, LEVEL_LABEL } from '../../data/advanced';

const ADV_ICONS = { waves: Waves, timer: Timer, radiation: Radiation, gauge: Gauge, dumbbell: Dumbbell, smile: Smile, eye: Eye };
const ADV_COLORS = { waves: '#f472b6', timer: '#fbbf24', radiation: '#a3e635', gauge: '#2dd4bf', dumbbell: '#60a5fa', smile: '#c084fc', eye: '#38bdf8' };

function Card({ icon: Icon, color, title, ok, value, unit, range, okLabel = 'NORMAL' }) {
  return (
    <div className="glass-card hc-large-card">
      <div className="hc-top">
        <div className="hc-title">
          <div className="hc-icon" style={{ color }}><Icon size={22} /></div>
          <span>{title}</span>
        </div>
        <span className={`normality-badge${ok ? '' : ' warn'}`}>{ok ? okLabel : 'OUT OF RANGE'}</span>
      </div>
      <div className="hc-reading">{value} <span>{unit}</span></div>
      <div className="hc-normality-box">
        <span>Astronaut Normality Range:</span>
        <strong>{range}</strong>
      </div>
    </div>
  );
}

function AdvCard({ a, v }) {
  const Icon = ADV_ICONS[a.icon];
  const d = a.display(v);
  const badge = a.level === 'green' ? '' : a.level === 'yellow' ? ' warn' : ' crit';
  const advice = a.level === 'yellow' ? a.yellow(v) : a.level === 'red' ? a.red(v) : null;
  return (
    <div className="glass-card hc-large-card">
      <div className="hc-top">
        <div className="hc-title">
          <div className="hc-icon" style={{ color: ADV_COLORS[a.icon] }}><Icon size={22} /></div>
          <span>{a.title}</span>
        </div>
        <span className={`normality-badge${badge}`}>{LEVEL_LABEL[a.level]}</span>
      </div>
      <div className="hc-reading">{d.value} <span>{d.unit}</span></div>
      <p className="adv-sub">{d.sub}</p>
      <div className="hc-normality-box" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 4 }}>
        <span>Astronaut Normality Range:</span>
        <strong style={{ fontSize: 12, lineHeight: 1.5 }}>{a.range}</strong>
      </div>
      {a.note && <p className="adv-sub" style={{ marginTop: 10 }}>{a.note}</p>}
      {advice && (
        <div className={`advice-box${a.level === 'red' ? ' crit' : ''}`}>
          <p><strong>{AGENT}:</strong> {advice}</p>
          <p className="advice-action"><Lightbulb size={14} /><span><strong>Action to Green:</strong> {a.action}</span></p>
        </div>
      )}
    </div>
  );
}

export default function HealthCare() {
  const { v, ranges: r, ok, adv, conditions } = useVitals();
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Health Care & Biometrics</h1>
        <p>Live astronaut physiological measurements compared against clinical normality standards</p>
      </div>

      <div className="healthcare-grid">
        <Card icon={HeartPulse} color="#f43f5e" title="Heart Rate" ok={ok.hr} value={v.hr} unit="BPM" range={`${r.hr.min} – ${r.hr.max} BPM`} />
        <Card icon={Droplets} color="#38bdf8" title="Blood Oxygen (SpO₂)" ok={ok.spo2} okLabel="OPTIMAL" value={v.spo2} unit="%" range={`${r.spo2.min}% – ${r.spo2.max}%`} />
        <Card icon={Thermometer} color="#fbbf24" title="Core Temperature" ok={ok.temp} value={v.temp.toFixed(1)} unit="°C" range={`${r.temp.min}°C – ${r.temp.max}°C`} />
        <Card icon={Activity} color="#c084fc" title="Blood Pressure" ok={ok.bp} value={`${v.sys}/${v.dia}`} unit="mmHg" range={`${r.sys.min}/${r.dia.min} – ${r.sys.max}/${r.dia.max} mmHg`} />
        <Card icon={Wind} color="#2dd4bf" title="Respiration Rate" ok={ok.rr} value={v.rr} unit="br/min" range={`${r.rr.min} – ${r.rr.max} br/min`} />
        <Card icon={Moon} color="#60a5fa" title="Sleep & Recovery" ok={ok.sleep} okLabel="OPTIMAL" value={v.sleep} unit="hrs" range={`${r.sleep.min.toFixed(1)} – ${r.sleep.max} hrs/cycle`} />
      </div>

      <h2 className="section-heading">Advanced Monitoring</h2>
      <div className="healthcare-grid">
        {adv.map((a) => <AdvCard key={a.key} a={a} v={v} />)}
      </div>

      {conditions.length > 0 && (
        <p className="condition-note">
          <Info size={16} />Normality ranges are adjusted for your registered conditions: {conditions.join(', ')}.
        </p>
      )}
    </section>
  );
}