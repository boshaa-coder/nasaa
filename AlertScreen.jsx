import { useEffect, useState } from 'react';
import { TriangleAlert, ShieldCheck } from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

const ACTIONS = [
  'Isolated Node 3 primary air loop.',
  'Automatically engaged backup Lithium Hydroxide (LiOH) scrubber.',
  'Regulated EMU suit pressure to 4.3 psi to prevent decompression sickness (DCS).',
  'Switched telemetry to autonomous onboard triage mode.',
];

const CHECKLIST = [
  'Confirm auxiliary oxygen mask connection.',
  'Inspect quick-disconnect valves on suit umbilical.',
  'Acknowledge automated scrubber switch on main console.',
  'Verify suit/cabin primary pressure seals.',
];

const stamp = () => new Date().toISOString().slice(11, 19) + ' UTC';

export default function AlertScreen() {
  const { active, clear } = useAlert();
  const { user } = useAuth();
  const [t, setT] = useState(0);
  const [shown, setShown] = useState(0);
  const [checked, setChecked] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!active) return;
    // reset state at the start of each alert
    setT(0); setShown(0); setChecked([]);
    setLog([
      { c: false, text: `[${stamp()}] Telemetry package compiled. Status: Stable.` },
      { c: true, text: `[${stamp()}] CRITICAL INCIDENT REPORT: CO2 scrubbing saturation + pressure drop. Crew: ${user?.name ?? 'Unknown'}. Queued for transmission upon ground sync.` },
    ]);
    const clock = setInterval(() => setT((x) => x + 1), 1000);
    const steps = setInterval(() => setShown((s) => Math.min(s + 1, ACTIONS.length)), 1200);
    return () => { clearInterval(clock); clearInterval(steps); };
  }, [active, user]);

  const toggle = (i) => {
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
    if (!checked.includes(i)) setLog((l) => [...l, { c: false, text: `[${stamp()}] Crew confirmed: ${CHECKLIST[i]}` }]);
  };

  if (!active) return null;
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  const flags = user?.conditions?.length ? user.conditions.join(', ') : 'None on file';

  return (
    <div className="alert-screen">
      <div className="alert-inner">
        <div className="alert-header">
          <div>
            <h1><TriangleAlert size={22} />CRITICAL EMERGENCY — GROUND LINK LOST</h1>
            <p>Communication with Earth interrupted for {mm}:{ss}. Autonomous mode engaged.</p>
          </div>
          <div className="link-chip">GROUND SYNC LINK: SEVERED (last delay 18:42 min)</div>
        </div>

        <div className="alert-grid">
          <section className="alert-card">
            <h2>1. Diagnostics & Root Cause</h2>
            <div className="diag-box"><small>SYSTEM SENSOR ID:</small>ECLSS-CO2-04 & SUIT-PRESS-02</div>
            <div className="diag-box"><small>EXACT ANOMALY / ISSUE:</small>Carbon dioxide scrubber bed saturation coupled with secondary circuit pressure drop in EMU suit.</div>
            <div className="diag-box"><small>LOCATION / MODULE:</small>Node 3 Air Purification Rack / Spacewalk Preparation Area</div>
            <div className="diag-box"><small>SEVERITY LEVEL:</small><span className="crit">LEVEL 3 (CRITICAL EMERGENCY)</span></div>
            <div className="diag-box"><small>CREW MEDICAL FLAGS:</small>{flags}</div>
          </section>

          <section className="alert-card">
            <h2>2. Action Taken & Crew Checklist</h2>
            <span className="sub-label">Autonomous system actions executed:</span>
            <div className="action-box">
              {ACTIONS.slice(0, shown).map((a) => <div key={a}>✔ {a}</div>)}
              {shown < ACTIONS.length && <div style={{ opacity: 0.6 }}>Executing…</div>}
            </div>
            <span className="sub-label">Crew procedural checklist:</span>
            {CHECKLIST.map((c, i) => (
              <label key={c} className={`check-item${checked.includes(i) ? ' checked' : ''}`}>
                <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} />
                <span><strong>Step {i + 1}:</strong> {c}</span>
              </label>
            ))}
          </section>

          <section className="alert-card">
            <h2>3. Ground Control Transmission Queue</h2>
            <div className="tx-log">
              {log.map((l, i) => <div key={i} className={l.c ? 'crit' : ''}>{l.text}</div>)}
            </div>
            <p className="sub-label" style={{ marginTop: 12 }}>
              BUFFER STATUS: <strong style={{ color: '#fbbf24' }}>AWAITING GROUND WINDOW</strong>
            </p>
          </section>
        </div>

        <div className="alert-footer">
          <button className="btn-primary" onClick={clear} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} />Acknowledge & Restore Link
          </button>
        </div>
      </div>
    </div>
  );
}