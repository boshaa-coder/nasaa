// Normal ranges are adjusted using the user's chronic conditions.
export function getRanges(conditions = []) {
  const has = (k) => conditions.some((c) => c.toLowerCase().includes(k));
  const hyper = has('blood pressure');
  const resp = has('asthma') || has('copd');
  const heart = has('ischemic');
  return {
    hr: { min: 60, max: heart ? 90 : 100 },
    spo2: { min: resp ? 92 : 95, max: 100 },
    temp: { min: 36.1, max: 37.2 },
    sys: { min: 90, max: hyper ? 130 : 120 },
    dia: { min: 60, max: hyper ? 85 : 80 },
    rr: { min: 12, max: 20 },
    sleep: { min: 7, max: 8.5 },
  };
}

export const inRange = (v, r) => v >= r.min && v <= r.max;

export function getBaseline(conditions = []) {
  const hyper = conditions.some((c) => c.toLowerCase().includes('blood pressure'));
  const depressed = conditions.some((c) => c.toLowerCase().includes('depressive'));
  return {
    hr: 72, spo2: 98, temp: 36.8, sys: hyper ? 126 : 114, dia: hyper ? 80 : 74, rr: 16, sleep: 7.5,
    hrvZ: -0.2, pvtRt: 245, pvtLapses: 0, radAcute: 0.4, radCum: 212.4, co2: 1800, exercise: 94, mood: depressed ? 26 : 18, sans: 4.0,
  };
}

export const ALERT_TARGET = {
  hr: 114, spo2: 91, temp: 37.5, sys: 142, dia: 92, rr: 25, sleep: 7.5,
  hrvZ: -1.7, pvtRt: 300, pvtLapses: 2, radAcute: 0.4, radCum: 212.4, co2: 4300, exercise: 94, mood: 36, sans: 4.0,
};
