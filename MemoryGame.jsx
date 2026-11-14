import { useState } from 'react';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MemoryGame({ onFinish }) {
  const [seq, setSeq] = useState([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const play = async (s) => {
    setBusy(true);
    for (const c of s) { await sleep(400); setLit(c); await sleep(450); setLit(null); }
    setBusy(false); setStep(0);
  };
  const next = (s = seq) => { const n = [...s, Math.floor(Math.random() * 9)]; setSeq(n); play(n); };
  const start = () => { setOver(false); next([]); };

  const press = (i) => {
    if (busy || over || !seq.length) return;
    if (i !== seq[step]) {
      setOver(true);
      onFinish(Math.min(100, (seq.length - 1) * 12.5));
      return;
    }
    if (step + 1 === seq.length) next(); else setStep(step + 1);
  };

  return (
    <>
      <p className="game-hint">Watch the sequence, then repeat it. Each round adds one more step.</p>
      <div className="memory-grid">
        {[...Array(9)].map((_, i) => <button key={i} className={`memory-cell${lit === i ? ' lit' : ''}`} onClick={() => press(i)} />)}
      </div>
      <p className="game-result">{over ? `Game over · reached level ${seq.length - 1}` : seq.length ? `Level ${seq.length}${busy ? ' · watch…' : ' · your turn'}` : ''}</p>
      {(!seq.length || over) && <button className="arena-btn" style={{ marginTop: 16 }} onClick={start}>{over ? 'Play Again' : 'Start'}</button>}
    </>
  );
}
