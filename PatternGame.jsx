import { useMemo, useState } from 'react';

const make = () => {
  const a = 1 + Math.floor(Math.random() * 9), d = 2 + Math.floor(Math.random() * 5);
  const geo = Math.random() < 0.4, r = 2 + Math.floor(Math.random() * 2);
  const s = [...Array(4)].map((_, i) => (geo ? a * r ** i : a + d * i));
  const ans = geo ? a * r ** 4 : a + d * 4;
  const opts = [...new Set([ans, ans + d, ans - 1, ans + 2 * d + 1])].sort(() => Math.random() - 0.5);
  return { s, ans, opts };
};

export default function PatternGame({ onFinish }) {
  const [qs, setQs] = useState(() => [...Array(5)].map(make));
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);

  const pick = (v) => {
    const total = ok + (v === qs[i].ans ? 1 : 0);
    setOk(total);
    if (i === 4) { onFinish((total / 5) * 100); setI(5); } else setI(i + 1);
  };
  const again = () => { setQs([...Array(5)].map(make)); setI(0); setOk(0); };

  if (i === 5) return (
    <>
      <p className="game-result" style={{ fontSize: 18 }}>{ok}/5 correct · Score {ok * 20}</p>
      <button className="arena-btn" style={{ marginTop: 16 }} onClick={again}>Play Again</button>
    </>
  );
  return (
    <>
      <p className="game-hint">Question {i + 1} of 5 · find the next number</p>
      <div className="pattern-seq">{qs[i].s.join(', ')}, ?</div>
      <div className="pattern-options">{qs[i].opts.map((o) => <button key={o} onClick={() => pick(o)}>{o}</button>)}</div>
    </>
  );
}