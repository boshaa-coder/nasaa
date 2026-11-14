import { useEffect, useRef, useState } from 'react';
import { beep } from '../../../utils/sound';

export default function FocusGame({ onFinish }) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(null);
  const hist = useRef([]);
  const stats = useRef({ hits: 0, targets: 0, falses: 0 });
  const pressedFor = useRef(-1);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (!running) return;
    let n = 0;
    const id = setInterval(() => {
      if (n++ >= 20) {
        clearInterval(id); setRunning(false);
        const { hits, targets, falses } = stats.current;
        const sc = targets ? Math.max(0, ((hits - falses) / targets) * 100) : 100;
        setDone(Math.round(sc)); finishRef.current(sc);
        return;
      }
      const prev = hist.current;
      const force = Math.random() < 0.25 && prev.length >= 2;
      const tone = force ? prev[prev.length - 1] : Math.random() < 0.5 ? 400 : 800;
      hist.current = [...prev, tone];
      beep(tone, 200);
      const h = hist.current, L = h.length;
      if (L >= 3 && h[L - 1] === h[L - 2] && h[L - 2] === h[L - 3]) stats.current.targets++;
    }, 900);
    return () => clearInterval(id);
  }, [running]);

  const start = () => { hist.current = []; stats.current = { hits: 0, targets: 0, falses: 0 }; pressedFor.current = -1; setDone(null); setRunning(true); };
  const press = () => {
    const h = hist.current, L = h.length;
    if (pressedFor.current === L) return;
    pressedFor.current = L;
    const isTarget = L >= 3 && h[L - 1] === h[L - 2] && h[L - 2] === h[L - 3];
    if (isTarget) stats.current.hits++; else stats.current.falses++;
  };

  return (
    <>
      <p className="game-hint">Turn your sound on. Press when you hear the same tone 3 times in a row.</p>
      {running
        ? <button className="focus-btn" onClick={press}>PRESS</button>
        : <button className="arena-btn" onClick={start}>{done !== null ? 'Play Again' : 'Start'}</button>}
      {done !== null && <p className="game-result">Accuracy score: {done}</p>}
    </>
  );
}
