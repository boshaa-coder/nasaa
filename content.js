export const TRAINING = [
  { id: 't1', icon: 'run', title: 'Cardiovascular Endurance (Treadmill T2)', desc: 'Maintains aerobic capacity and prevents cardiac deconditioning in microgravity', tag: '45 Mins · High Intensity', minutes: 45,
    steps: ['Phase 1 (10 min): Harness attachment & warm-up jog at 6.5 km/h.', 'Phase 2 (25 min): Interval sprint cycles (3 min at 12 km/h, 2 min recovery).', 'Phase 3 (10 min): Gradual cooldown walk and heart rate stabilization.', 'Target Heart Rate Zone: 135 – 155 BPM.'] },
  { id: 't2', icon: 'dumbbell', title: 'ARED Resistive Strength Training', desc: 'Prevents bone density loss and muscle atrophy across lower & upper body', tag: '50 Mins · Heavy Load', minutes: 50,
    steps: ['Squats & Deadlifts: 4 sets × 10 reps at 80% vacuum cylinder load.', 'Heel Raises: 4 sets × 15 reps to protect soleus and gastrocnemius muscles.', 'Bench Press & Rows: 3 sets × 12 reps for upper torso stability.', 'Rest Interval: 90 seconds between sets.'] },
  { id: 't3', icon: 'bike', title: 'CEVIS Cycle Ergometer', desc: 'Lower-limb endurance and metabolic conditioning', tag: '25 Mins · Moderate', minutes: 25,
    steps: ['Setup: Lock cycling shoes into pedals and fasten lap belt.', 'Main Set: Maintain 75–85 RPM at 180 Watts resistance for 20 minutes.', 'Cooldown: 5 minutes light pedaling at 80 Watts.'] },
  { id: 't4', icon: 'spine', title: 'Spinal Decompression & Core Mobility', desc: 'Relieves microgravity spinal elongation discomfort and improves posture', tag: '15 Mins · Recovery', minutes: 15,
    steps: ['Thoracic Mobility: Controlled rotational stretches for 5 minutes.', 'Core Stabilization: Isometric planks and pelvic tilts (3 × 45 sec).', 'Breathing: Deep diaphragmatic recovery breathing.'] },
];

export const MESSAGES = [
  { time: 'Today · 14:20 UTC', body: 'Great consistency on your cardiovascular and ARED strength sessions over the past 48 hours. Your resting heart rate and oxygen saturation remain rock solid. Please make sure to complete the Pattern & Memory cognitive checks before the 18:00 UTC orbital docking drill.' },
  { time: 'Yesterday · 19:45 UTC', body: "Notice from Flight Control: Tomorrow's EVA prep requires extra lower-body recovery. Keep hydration intake above 2.5L today and log your post-sleep blood pressure immediately upon waking." },
  { time: '3 Days Ago · 09:10 UTC', body: 'Reviewed your Week 3 summary report. The partial training adjustment on Wednesday worked well to prevent fatigue. Keep Saturday strictly as a full rest and spinal decompression day.' },
];

export const REPORTS = [
  { weekLabel: 'WEEK 04 · CURRENT ARCHIVE', title: 'Nov 07 – Nov 13, 2026', badge: '92% Weekly Adherence',
    days: [
      ['MONDAY', '100% · Training completed (Cardio + ARED)', '75 BPM', '98%'],
      ['TUESDAY', '100% · Training completed (Strength Focus)', '72 BPM', '98%'],
      ['WEDNESDAY', '50% · Partial training (Light CEVIS)', '78 BPM', '97%'],
      ['THURSDAY', '100% · Training completed (Full Protocol)', '74 BPM', '99%'],
      ['FRIDAY', '100% · Training completed (Endurance)', '73 BPM', '98%'],
      ['SATURDAY', 'Rest · Scheduled Rest & Mobility Day', '71 BPM', '98%'],
      ['SUNDAY', '100% · Training completed (ARED + Core)', '72 BPM', '99%'],
    ],
    conclusion: 'The astronaut maintained regular training throughout the week, with one partial session on Wednesday and one planned rest day on Saturday. Vital signs remained stable across the full 7-day monitoring period (Avg HR: 73.5 BPM, SpO₂: 98.1%). Recommendation: Increase hydration slightly before mid-week cardio and maintain current sleep schedule.' },
  { weekLabel: 'WEEK 03 · ARCHIVE', title: 'Oct 31 – Nov 06, 2026', badge: '100% Weekly Adherence',
    days: [
      ['MONDAY', '100% · Training completed', '74 BPM', '98%'],
      ['TUESDAY', '100% · Training completed', '73 BPM', '99%'],
      ['WEDNESDAY', '100% · Training completed', '75 BPM', '98%'],
      ['THURSDAY', '100% · Training completed', '72 BPM', '98%'],
      ['FRIDAY', '100% · Training completed', '74 BPM', '99%'],
      ['SATURDAY', 'Rest · Planned Rest Day', '70 BPM', '99%'],
      ['SUNDAY', '100% · Training completed', '71 BPM', '98%'],
    ],
    conclusion: 'Peak weekly consistency achieved with zero missed sessions. Cardiovascular recovery time improved by 6%. Continue current ARED resistance loads and reduce late-evening screen exposure to preserve deep sleep cycles.' },
  { weekLabel: 'WEEK 02 · ARCHIVE', title: 'Oct 24 – Oct 30, 2026', badge: '85% Weekly Adherence',
    days: [
      ['MONDAY', '100% · Training completed', '76 BPM', '98%'],
      ['TUESDAY', '50% · Partial training (EVA Prep)', '79 BPM', '97%'],
      ['WEDNESDAY', '100% · Training completed', '74 BPM', '98%'],
      ['THURSDAY', '100% · Training completed', '73 BPM', '98%'],
      ['FRIDAY', '50% · Partial training', '77 BPM', '98%'],
      ['SATURDAY', 'Rest · Planned Rest Day', '71 BPM', '99%'],
      ['SUNDAY', '100% · Training completed', '72 BPM', '98%'],
    ],
    conclusion: 'Overall health remained stable despite two partial sessions adjusted for spacewalk preparations. Recommend adding 10 minutes of spinal decompression after heavy suit simulations and cutting excess caffeine post-14:00 UTC.' },
];
