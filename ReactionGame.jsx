import { useRef, useState } from 'react';

export default function ReactionGame({ onFinish }) {
  const [state, setState] = useState('idle'); // idle | wait | go | done
  const [msg, setMsg] = useState('');
  const start = useRef(0);
  const timer = useRef();

  const begin = () => {
    setState('wait'); setMsg('');
    timer.current = setTimeout(() => { start.current = performance.now(); setState('go'); }, 1000 + Math.random() * 2500);
  };
  const click = () => {
    if (state === 'wait') { clearTimeout(timer.current); setState('idle'); setMsg('Too early! Wait for green.'); return; }
    if (state === 'go') {
      const t = Math.round(performance.now() - start.current);
      const score = Math.max(0, Math.min(100, 100 - (t - 200) / 6));
      setMsg(`${t} ms · Score ${Math.round(score)}`); setState('done');
      onFinish(score);
    }
  };
  const idle = state === 'idle' || state === 'done';
  return (
    <>
      <p className="game-hint">Press START, wait for the circle to turn green, then click as fast as you can.</p>
      <button className={`react-circle ${state}`} onClick={idle ? begin : click}>
        {idle ? (state === 'done' ? 'AGAIN' : 'START') : state === 'wait' ? 'WAIT…' : 'CLICK!'}
      </button>
      {msg && <p className="game-result">{msg}</p>}
    </>
  );
}