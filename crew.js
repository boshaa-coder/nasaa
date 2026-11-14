import { db } from './storage';
import { rate } from './rating';
import { getRanges, inRange } from './vitals';
import { ADVANCED } from '../data/advanced';

// A member counts as online if their tab wrote vitals within this window.
export const ONLINE_MS = 8000;

const LABELS = { ok: 'Stable', warn: 'Needs Care', bad: 'Critical', off: 'Offline' };
const NAMES = { hr: 'Heart rate', spo2: 'SpO₂', temp: 'Body temp', bp: 'Blood pressure', rr: 'Respiration', sleep: 'Sleep' };

// Same checks the member's own VitalsContext does (basic vitals).
export function checkVitals(conditions = [], v) {
  const r = getRanges(conditions);
  return {
    hr: inRange(v.hr, r.hr),
    spo2: inRange(v.spo2, r.spo2),
    temp: inRange(v.temp, r.temp),
    bp: inRange(v.sys, r.sys) && inRange(v.dia, r.dia),
    rr: inRange(v.rr, r.rr),
    sleep: inRange(v.sleep, r.sleep),
  };
}

// Advanced vitals with their green / yellow / red level.
// Returns [] for old readings that do not have the advanced fields yet.
export function advancedLevels(v) {
  if (!v || typeof v.hrvZ !== 'number') return [];
  return ADVANCED.map((a) => ({ ...a, level: a.level(v) }));
}

// Status: ok (all normal) / warn (1 out of range) / bad (any red, 2+ out of range, or Alert Mode) / off (no live signal)
export function evaluate(user, v, now) {
  if (!v || typeof v.t !== 'number') return { key: 'off', label: LABELS.off, online: false, v: null, ok: null, adv: [], abnormal: [] };
  const ok = checkVitals(user.conditions ?? [], v);
  const adv = advancedLevels(v);
  const abnormal = [
    ...Object.keys(ok).filter((k) => !ok[k]).map((k) => NAMES[k]),
    ...adv.filter((a) => a.level !== 'green').map((a) => a.short),
  ];
  if (now - v.t > ONLINE_MS) return { key: 'off', label: LABELS.off, online: false, v, ok, adv, abnormal };
  const anyRed = adv.some((a) => a.level === 'red');
  const key = v.alert || anyRed || abnormal.length >= 2 ? 'bad' : abnormal.length === 1 ? 'warn' : 'ok';
  return { key, label: LABELS[key], online: true, v, ok, adv, abnormal };
}

export function cognitive(email) {
  const s = db.get(`scores:${email}`, []);
  const avg = s.length ? s.reduce((a, x) => a + x.score, 0) / s.length : null;
  const rating = avg !== null ? rate(avg) : null;
  return { plays: s.length, avg, rating, key: rating ? rating.label.toLowerCase() : null };
}

export const trainingCount = (email) => db.get(`training:${email}`, []).length;

export function timeAgo(t, now) {
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}