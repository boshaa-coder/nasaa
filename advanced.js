// Advanced monitoring vitals (HRV, PVT-B, Radiation, CO2, Exercise, Mood, SANS).
// Each has a 3-level status: green | yellow | red. Existing vitals (HR, SpO2, Temp, BP, Resp, Sleep) are untouched.
// Name shown in the advisory messages. Change it here if the agent gets another name.
export const AGENT = 'Dr NOVA';

const GENERIC_RED = 'Critical: this reading is outside safe bounds. Please follow the action plan below. I am queuing a telemetry packet for the Flight Surgeon.';

export const ADVANCED = [
  {
    key: 'hrv', title: 'Heart Rate Variability (RMSSD)', icon: 'waves', short: 'HRV',
    range: 'Green: Z ≥ −1.0σ · Yellow: −2.0σ to −1.0σ · Red: < −2.0σ',
    level: (v) => (v.hrvZ >= -1 ? 'green' : v.hrvZ >= -2 ? 'yellow' : 'red'),
    display: (v) => ({ value: Math.round(48 + 12 * v.hrvZ), unit: 'ms', sub: `Z-score ${v.hrvZ.toFixed(1)}σ vs personal baseline` }),
    action: 'Perform a 10-minute guided paced-breathing session (6 breaths/minute). Decrease scheduled exercise intensity by 20% for the day.',
    yellow: () => 'Your autonomic recovery is lower than your personal baseline today. I recommend a 10-minute paced breathing module and reducing today’s exercise intensity.',
    red: () => GENERIC_RED,
  },
  {
    key: 'pvt', title: 'Psychomotor Vigilance (PVT-B)', icon: 'timer', short: 'PVT-B',
    range: 'Green: < 270 ms & 0 lapses · Yellow: 270–350 ms or 1–3 lapses · Red: > 350 ms or ≥ 4 lapses',
    level: (v) => (v.pvtRt > 350 || v.pvtLapses >= 4 ? 'red' : v.pvtRt >= 270 || v.pvtLapses >= 1 ? 'yellow' : 'green'),
    display: (v) => ({ value: v.pvtRt, unit: 'ms mean RT', sub: `${v.pvtLapses} lapse${v.pvtLapses === 1 ? '' : 's'} (RT > 500 ms) · 3-min test` }),
    action: 'Take a 15-minute cognitive break away from screens. Expose eyes to bright blue-enriched light.',
    yellow: () => 'Reaction times indicate mild cognitive fatigue. I recommend a 15-minute break. Please re-test before initiating robotic arm operations.',
    red: () => GENERIC_RED,
  },
  {
    key: 'radiation', title: 'Space Radiation Exposure', icon: 'radiation', short: 'Radiation',
    range: 'Green: acute < 1 mSv & cumulative < 400 mSv · Yellow: acute 1–50 mSv or cumulative 400–600 mSv · Red: acute > 50 mSv (SPE)',
    // Assumption: cumulative > 600 mSv is also treated as red (the spec does not define it).
    level: (v) => (v.radAcute > 50 || v.radCum > 600 ? 'red' : v.radAcute >= 1 || v.radCum >= 400 ? 'yellow' : 'green'),
    display: (v) => ({ value: v.radAcute.toFixed(1), unit: 'mSv / 24h', sub: `Cumulative: ${v.radCum.toFixed(1)} mSv` }),
    note: 'Sources: Bubble detectors + CANS (neutron dose) · MOSFET dosimeters with Human Phantom model (internal organ dose).',
    action: 'Radiation-aware navigation: relocate to the module with the lowest real-time measured exposure (e.g. Sleeping Quarters or Water Storage), using recent sensor data only.',
    yellow: () => 'Elevated ionizing and neutron radiation detected. Spatial mapping shows the Laboratory module is currently exposed. The Sleeping Quarters offer the lowest dose rate. Please relocate. (Internal organ dose estimations have been updated.)',
    red: () => 'Solar Particle Event (SPE) threshold breached. Proceed immediately to the designated Storm Shelter via the verified safe route. Do not leave until clearance is given.',
  },
  {
    key: 'co2', title: 'Cabin CO₂ Concentration', icon: 'gauge', short: 'Cabin CO₂',
    range: 'Green: < 2500 ppm · Yellow: 2500–4000 ppm · Red: > 4000 ppm (60-min TWA)',
    level: (v) => (v.co2 > 4000 ? 'red' : v.co2 >= 2500 ? 'yellow' : 'green'),
    display: (v) => ({ value: v.co2, unit: 'ppm (60-min TWA)', sub: 'Sampled every minute' }),
    action: 'Increase inter-module ventilation (IMV) fan speeds to disperse stagnant air pockets.',
    yellow: () => 'Cabin CO₂ TWA is rising. I recommend manually increasing the inter-module ventilation fans to disperse local gas pockets.',
    red: () => GENERIC_RED,
  },
  {
    key: 'exercise', title: 'Daily Exercise Compliance', icon: 'dumbbell', short: 'Exercise',
    range: 'Green: ≥ 90% · Yellow: 70–89% · Red: < 70% (maintained for 3 consecutive days)',
    level: (v) => (v.exercise >= 90 ? 'green' : v.exercise >= 70 ? 'yellow' : 'red'),
    display: (v) => ({ value: v.exercise, unit: '%', sub: 'ARED resistive + CEVIS aerobic vs target' }),
    action: 'Add a 20-minute CEVIS aerobic cycle or 3 high-intensity ARED resistance sets to the following day.',
    yellow: (v) => `Your physical workload compliance is currently ${v.exercise}%. To prevent musculoskeletal deconditioning, I suggest adding a 20-minute cycle session to tomorrow’s schedule.`,
    red: () => GENERIC_RED,
  },
  {
    key: 'mood', title: 'Mood & Psychological (POMS-SF)', icon: 'smile', short: 'Mood',
    range: 'Green: TMD < 30 · Yellow: 30–50 · Red: > 50 (scale 0–120)',
    level: (v) => (v.mood > 50 ? 'red' : v.mood >= 30 ? 'yellow' : 'green'),
    display: (v) => ({ value: v.mood, unit: '/ 120 TMD', sub: 'Total Mood Disturbance, 30-item short form' }),
    action: 'Schedule a Private Family Conference (PFC) downlink. Complete a 20-minute audio-visual relaxation software module.',
    yellow: () => 'Your wellness metrics indicate elevated stress. I suggest utilizing a 20-minute relaxation module and scheduling a Private Family Conference downlink when comms allow.',
    red: () => GENERIC_RED,
  },
  {
    key: 'sans', title: 'Neuro-Ocular Syndrome (SANS)', icon: 'eye', short: 'SANS',
    range: 'Green: < 10% · Yellow: 10–25% · Red: > 25% or clinical optic disc edema grade ≥ 1',
    level: (v) => (v.sans > 25 ? 'red' : v.sans >= 10 ? 'yellow' : 'green'),
    display: (v) => ({ value: v.sans.toFixed(1), unit: '% ΔSANS', sub: 'OCT: RNFL and optic disc height change' }),
    action: 'Undergo 40 minutes of Lower Body Negative Pressure (LBNP) therapy daily at −25 mmHg to draw fluids downward.',
    yellow: () => 'OCT scans show mild morphological shifts. Please ensure you complete your 40-minute Lower Body Negative Pressure therapy today to help redistribute cranial fluids.',
    red: () => GENERIC_RED,
  },
];

export const LEVEL_LABEL = { green: 'NORMAL', yellow: 'CAUTION', red: 'CRITICAL' };
