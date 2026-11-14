import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { db } from '../utils/storage';
import { ALERT_TARGET, getBaseline, getRanges, inRange } from '../utils/vitals';
import { ADVANCED } from '../data/advanced';

const VitalsCtx = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useVitals = () => useContext(VitalsCtx);

const noise = (n) => (Math.random() - 0.5) * n;
const r1 = (x) => Math.round(x * 10) / 10;

export function VitalsProvider({ children }) {
  const { user } = useAuth();
  const { active } = useAlert();
  const conditions = useMemo(() => user?.conditions ?? [], [user]);
  const ranges = useMemo(() => getRanges(conditions), [conditions]);
  const base = useMemo(() => getBaseline(conditions), [conditions]);
  const [v, setV] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setV((cur) => {
        const t = active ? ALERT_TARGET : base;
        const step = (k, n) => cur[k] + (t[k] - cur[k]) * 0.25 + noise(n);
        return {
          hr: Math.round(step('hr', 3)),
          spo2: Math.min(100, Math.round(step('spo2', 1.2))),
          temp: r1(step('temp', 0.1)),
          sys: Math.round(step('sys', 3)),
          dia: Math.round(step('dia', 2)),
          rr: Math.round(step('rr', 1.5)),
          sleep: base.sleep,
          // advanced monitoring
          hrvZ: r1(step('hrvZ', 0.15)),
          pvtRt: Math.round(step('pvtRt', 6)),
          pvtLapses: Math.max(0, Math.round(step('pvtLapses', 0.6))),
          radAcute: Math.max(0, r1(step('radAcute', 0.15))),
          radCum: base.radCum,
          co2: Math.round(step('co2', 60)),
          exercise: Math.min(100, Math.round(step('exercise', 1.2))),
          mood: Math.max(0, Math.round(step('mood', 1.5))),
          sans: Math.max(0, r1(step('sans', 0.6))),
        };
      });
    }, 1500);
    return () => clearInterval(id);
  }, [active, base]);

  const ok = {
    hr: inRange(v.hr, ranges.hr),
    spo2: inRange(v.spo2, ranges.spo2),
    temp: inRange(v.temp, ranges.temp),
    bp: inRange(v.sys, ranges.sys) && inRange(v.dia, ranges.dia),
    rr: inRange(v.rr, ranges.rr),
    sleep: inRange(v.sleep, ranges.sleep),
  };

  // Advanced vitals with green / yellow / red levels
  const adv = useMemo(() => ADVANCED.map((a) => ({ ...a, level: a.level(v) })), [v]);
  const worst = adv.some((a) => a.level === 'red') ? 'red' : adv.some((a) => a.level === 'yellow') ? 'yellow' : 'green';
  const allOk = Object.values(ok).every(Boolean) && worst === 'green';

  // Publish the latest live reading so the admin can see it (key: vitals:{email}).
  useEffect(() => {
    if (!user?.email) return;
    db.set(`vitals:${user.email}`, {
      ...v, allOk, worst, alert: active, t: Date.now(),
      flags: adv.filter((a) => a.level !== 'green').map((a) => a.short),
    });
  }, [v, allOk, worst, adv, active, user?.email]);

  return <VitalsCtx.Provider value={{ v, ranges, ok, allOk, adv, worst, conditions }}>{children}</VitalsCtx.Provider>;
}