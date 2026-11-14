import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVitals } from '../../context/VitalsContext';
import { db } from '../../utils/storage';
import { rate } from '../../utils/rating';
import { AGENT } from '../../data/advanced';

const SUGGESTIONS = ['How are my vitals?', 'Radiation status?', 'How is my cognitive rating?', 'Tips for my conditions', 'I feel dizzy'];

// Placeholder logic. Replace this function with a real API call when Dr AI is ready.
function getReply(text, { user, v, allOk, adv, conditions }) {
  const q = text.toLowerCase();
  const scores = db.get(`scores:${user.email}`, []);
  const avg = scores.length ? scores.reduce((s, x) => s + x.score, 0) / scores.length : null;

  if (q.includes('dizz') || q.includes('pain') || q.includes('chest') || q.includes('breath'))
    return 'Those symptoms need attention. Stop any activity, sit or secure yourself, and check your suit/cabin pressure and CO₂ levels. If symptoms persist for more than a few minutes, contact the flight surgeon or press ALERT.';

  const hit = adv.find((a) => q.includes(a.key) || q.includes(a.short.toLowerCase()) || (a.key === 'co2' && q.includes('co2')) || (a.key === 'radiation' && q.includes('radiat')) || (a.key === 'sans' && (q.includes('eye') || q.includes('vision'))));
  if (hit) {
    const d = hit.display(v);
    const advice = hit.level === 'yellow' ? hit.yellow(v) : hit.level === 'red' ? hit.red(v) : null;
    return `${hit.title}: ${d.value} ${d.unit} (${hit.level.toUpperCase()}).\n${advice ? advice + '\nAction: ' + hit.action : 'Within the normal range. No action needed.'}`;
  }

  if (q.includes('vital') || q.includes('heart') || q.includes('oxygen') || q.includes('pressure'))
    return `Current readings: HR ${v.hr} BPM, SpO₂ ${v.spo2}%, BP ${v.sys}/${v.dia} mmHg, temp ${v.temp.toFixed(1)}°C.\n${allOk ? 'Everything is within your normal ranges.' : 'Some values are outside your normal range. Rest, hydrate, and recheck in a few minutes.'}${adv.filter((a) => a.level !== 'green').map((a) => `\n• ${a.title}: ${a.level === 'red' ? a.red(v) : a.yellow(v)}`).join('')}`;
  if (q.includes('cognitive') || q.includes('score') || q.includes('rating') || q.includes('game')) {
    if (avg === null) return 'You have not played any test yet. Try the Tests & Games page so I can estimate your cognitive performance.';
    const r = rate(avg);
    return `Your average is ${Math.round(avg)}/100 (${r.label}). ${r.msg}`;
  }
  if (q.includes('condition') || q.includes('tip') || q.includes('advice')) {
    if (!conditions.length) return 'You have no chronic conditions on file. Keep up regular training, hydration, and 7–8 hours of sleep.';
    return `Based on your profile (${conditions.join(', ')}): keep to your medication schedule, track your vitals daily, and report any trend outside your ranges to the flight surgeon.`;
  }
  return `I'm ${AGENT}, your onboard health assistant. I can summarize your vitals (including radiation, CO₂, HRV, mood), your cognitive rating, and give general guidance. I do not replace a medical diagnosis.`;
}

export default function DrAI() {
  const { user } = useAuth();
  const vit = useVitals();
  const [msgs, setMsgs] = useState([{ me: false, text: `Hello ${user.name.split(' ')[0]}, I'm ${AGENT}. How can I help with your health today?` }]);
  const [input, setInput] = useState('');
  const end = useRef();

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = (text) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { me: true, text: t }]);
    setInput('');
    setTimeout(() => setMsgs((m) => [...m, { me: false, text: getReply(t, { user, ...vit }) }]), 600);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Dr NOVA</h1>
        <p>Your onboard health assistant. General guidance only, not a medical diagnosis.</p>
      </div>
      <div className="glass-card chat-card">
        <div className="chat-log">
          {msgs.map((m, i) => <div key={i} className={`bubble ${m.me ? 'me' : 'ai'}`}>{m.text}</div>)}
          <div ref={end} />
        </div>
        <div className="chat-suggestions">{SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}</div>
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Dr AI…" />
          <button aria-label="Send"><Send size={18} /></button>
        </form>
      </div>
    </section>
  );
}
