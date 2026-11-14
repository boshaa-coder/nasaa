import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, Droplets, Thermometer, Activity, Wind, Moon, Brain, ShieldAlert, Dumbbell,
  Send, Siren, ChevronRight, TriangleAlert, Waves, Timer, Radiation, Gauge, Smile, Eye, Lightbulb,
} from 'lucide-react';
import Modal from '../../components/modal';
import useStorage, { useStorageVersion, useNow } from '../../hooks/useStorage';
import { db } from '../../utils/storage';
import { evaluate, cognitive, trainingCount, timeAgo } from '../../utils/crew';
import { AGENT, LEVEL_LABEL } from '../../data/advanced';

const ADV_ICONS = { waves: Waves, timer: Timer, radiation: Radiation, gauge: Gauge, dumbbell: Dumbbell, smile: Smile, eye: Eye };
const ADV_COLORS = { waves: '#f472b6', timer: '#fbbf24', radiation: '#a3e635', gauge: '#2dd4bf', dumbbell: '#60a5fa', smile: '#c084fc', eye: '#38bdf8' };

const Note = ({ good, a, b }) => <p className={`vital-note${good ? '' : ' warn'}`}>● {good ? a : b}</p>;

function Vital({ icon, title, value, unit, good, a, b }) {
  return (
    <div className="glass-card mini-vital">
      <h4>{icon}{title}</h4>
      <div className="val">{value} <span>{unit}</span></div>
      {good !== null && <Note good={good} a={a} b={b} />}
    </div>
  );
}

// Same data and wording as the AdvCard on the member's Health Care page, in a compact form.
function AdvMini({ a, v }) {
  const Icon = ADV_ICONS[a.icon];
  const d = a.display(v);
  const badge = a.level === 'green' ? '' : a.level === 'yellow' ? ' warn' : ' crit';
  const advice = a.level === 'yellow' ? a.yellow(v) : a.level === 'red' ? a.red(v) : null;
  return (
    <div className="glass-card mini-vital">
      <h4><Icon size={16} color={ADV_COLORS[a.icon]} />{a.title}</h4>
      <div className="val">{d.value} <span>{d.unit}</span></div>
      <p className="adv-sub">{d.sub}</p>
      <span className={`normality-badge${badge}`} style={{ display: 'inline-block', marginTop: 10 }}>{LEVEL_LABEL[a.level]}</span>
      {advice && (
        <div className={`advice-box${a.level === 'red' ? ' crit' : ''}`}>
          <p><strong>{AGENT}:</strong> {advice}</p>
          <p className="advice-action"><Lightbulb size={14} /><span><strong>Action to Green:</strong> {a.action}</span></p>
        </div>
      )}
    </div>
  );
}

const initialOf = (u) => u.name?.[0]?.toUpperCase() ?? '?';

export default function Members() {
  const nav = useNavigate();
  const [users] = useStorage('users', []);
  const [, setRemote] = useStorage('remoteAlerts', []);
  useStorageVersion(); // vitals:{email} changes update this page live
  const now = useNow(2000);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const crew = users.filter((u) => u.role === 'user');
  const rows = crew.map((u) => ({ user: u, st: evaluate(u, db.get(`vitals:${u.email}`, null), now) }));
  const count = (k) => rows.filter((r) => r.st.key === k).length;
  const sel = rows.find((r) => r.user.email === selected) ?? null;

  const sendAlert = (to, label) => {
    if (!window.confirm(`Trigger Alert Mode for ${label}?`)) return;
    setRemote((cur) => [...cur.slice(-49), { id: Date.now(), to }]);
    setToast(`Alert Mode sent to ${label}.`);
  };

  const openChat = (to) => nav(`/admin/messages?to=${encodeURIComponent(to)}`);

  const renderModal = () => {
    const { user: u, st } = sel;
    const v = st.v;
    const ok = st.ok;
    const c = cognitive(u.email);
    const statusNote = st.online ? 'Live telemetry' : v ? `Last reading ${timeAgo(v.t, now)}` : 'No telemetry received yet';

    return (
      <Modal onClose={() => setSelected(null)}>
        <div className="modal-head">
          <div className="member-avatar">{initialOf(u)}</div>
          <div>
            <h2>{u.name}</h2>
            <p>{u.email} · Age {u.age ?? '—'}</p>
          </div>
        </div>

        <div className="member-status-line">
          <span className={`st-badge ${st.key}`}>{st.label}</span>
          <span className="member-meta">{statusNote}</span>
        </div>

        <div className="vitals-mini-grid">
          <Vital icon={<HeartPulse size={16} color="#f43f5e" />} title="Heart Rate" value={v ? v.hr : '—'} unit="BPM"
            good={ok ? ok.hr : null} a="Within Normal Range" b="Outside Normal Range" />
          <Vital icon={<Droplets size={16} color="#38bdf8" />} title="SpO₂ Level" value={v ? v.spo2 : '—'} unit="%"
            good={ok ? ok.spo2 : null} a="Optimal Saturation" b="Low Saturation" />
          <Vital icon={<Thermometer size={16} color="#fbbf24" />} title="Body Temp" value={v ? v.temp.toFixed(1) : '—'} unit="°C"
            good={ok ? ok.temp : null} a="Stable Core Temp" b="Abnormal Temp" />
          <Vital icon={<Activity size={16} color="#c084fc" />} title="Blood Pressure" value={v ? `${v.sys}/${v.dia}` : '—'} unit="mmHg"
            good={ok ? ok.bp : null} a="Normal Pressure" b="Abnormal Pressure" />
          <Vital icon={<Wind size={16} color="#2dd4bf" />} title="Respiration Rate" value={v ? v.rr : '—'} unit="br/min"
            good={ok ? ok.rr : null} a="Within Normal Range" b="Outside Normal Range" />
          <Vital icon={<Moon size={16} color="#60a5fa" />} title="Sleep & Recovery" value={v ? v.sleep : '—'} unit="hrs"
            good={ok ? ok.sleep : null} a="Within Normal Range" b="Outside Normal Range" />
        </div>

        {st.adv.length > 0 && (
          <>
            <h2 className="section-heading" style={{ marginTop: 24 }}>Advanced Monitoring</h2>
            <div className="vitals-mini-grid">
              {st.adv.map((a) => <AdvMini key={a.key} a={a} v={v} />)}
            </div>
          </>
        )}

        {st.online && v.alert && (
          <div className="out-of-range"><TriangleAlert size={16} />Alert Mode is active on this member's console.</div>
        )}
        {st.online && st.abnormal.length > 0 && (
          <div className="out-of-range"><TriangleAlert size={16} />Out of range: {st.abnormal.join(', ')}</div>
        )}

        <p className="section-title" style={{ marginTop: 24 }}>Chronic conditions</p>
        {u.conditions?.length
          ? <div className="tag-list">{u.conditions.map((x) => <span key={x} className="tag">{x}</span>)}</div>
          : <p className="member-none">No chronic conditions on file.</p>}

        <div className="dash-extra">
          <div className="glass-card extra-card static">
            <div className="icon-box"><Brain size={22} /></div>
            <div>
              <div className="big">{c.rating ? `${Math.round(c.avg)}/100 · ${c.rating.label}` : 'Not tested yet'}</div>
              <div className="sub">Cognitive rating</div>
            </div>
          </div>
          <div className="glass-card extra-card static">
            <div className="icon-box"><ShieldAlert size={22} /></div>
            <div>
              <div className="big">{u.conditions?.length ?? 0}</div>
              <div className="sub">Chronic conditions monitored</div>
            </div>
          </div>
          <div className="glass-card extra-card static">
            <div className="icon-box"><Dumbbell size={22} /></div>
            <div>
              <div className="big">{trainingCount(u.email)}</div>
              <div className="sub">Training sessions completed</div>
            </div>
          </div>
        </div>

        <div className="member-actions">
          <button className="btn-primary btn-sm" onClick={() => openChat(u.email)}><Send size={15} />Send Message</button>
          <button
            className="btn-ghost btn-sm danger"
            disabled={!st.online || !!v?.alert}
            title={!st.online ? 'Member must be online to receive an alert' : undefined}
            onClick={() => sendAlert(u.email, u.name)}
          ><Siren size={15} />Trigger Alert</button>
        </div>
      </Modal>
    );
  };

  return (
    <section className="page-section">
      <div className="page-header-row">
        <div className="page-header">
          <h1>Crew Members</h1>
          <p>Live status of every registered crew member. Select a member to see full vitals.</p>
        </div>
        <div className="member-actions" style={{ marginTop: 0 }}>
          <button className="btn-ghost btn-sm" onClick={() => openChat('all')} disabled={crew.length === 0}><Send size={15} />Message All</button>
          <button className="btn-ghost btn-sm danger" onClick={() => sendAlert('all', 'all crew')} disabled={crew.length === 0}><Siren size={15} />Alert All</button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="glass-card"><div className="stat-num" style={{ color: '#34d399' }}>{count('ok')}</div><div className="stat-label">Stable</div></div>
        <div className="glass-card"><div className="stat-num" style={{ color: '#fbbf24' }}>{count('warn')}</div><div className="stat-label">Needs care</div></div>
        <div className="glass-card"><div className="stat-num" style={{ color: '#f87171' }}>{count('bad')}</div><div className="stat-label">Critical</div></div>
        <div className="glass-card"><div className="stat-num" style={{ color: 'var(--text-muted)' }}>{count('off')}</div><div className="stat-label">Offline</div></div>
      </div>

      {rows.length === 0 && <div className="glass-card" style={{ color: 'var(--text-muted)' }}>No crew registered yet.</div>}

      <div className="member-list">
        {rows.map(({ user: u, st }) => (
          <button type="button" key={u.email} className={`glass-card member-row ${st.key}`} onClick={() => setSelected(u.email)}>
            <div className="member-avatar">{initialOf(u)}</div>
            <div>
              <div className="member-name">{u.name}</div>
              <div className="member-email">{u.email}</div>
            </div>
            <div className="member-meta hide-sm">Age {u.age ?? '—'}</div>
            <div className="member-conds hide-sm">
              {u.conditions?.length
                ? u.conditions.map((x) => <span key={x} className="tag">{x}</span>)
                : <span className="member-none">No chronic conditions</span>}
            </div>
            <span className={`st-badge ${st.key}`}>{st.label}</span>
            <ChevronRight size={18} className="chevron" />
          </button>
        ))}
      </div>

      {sel && renderModal()}
      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}