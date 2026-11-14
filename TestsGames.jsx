import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain, Target, Puzzle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { db } from '../../utils/storage';
import { rate } from '../../utils/rating';
import ReactionGame from './games/ReactionGame';
import MemoryGame from './games/MemoryGame';
import FocusGame from './games/FocusGame';
import PatternGame from './games/PatternGame';

const GAMES = [
  { id: 'reaction', title: 'Reaction Test', short: 'Measure response time', desc: 'Measures visual-motor response speed in milliseconds.', range: '180 – 250 ms', Icon: Zap, bg: 'rgba(245,158,11,.15)', fg: '#fbbf24', C: ReactionGame },
  { id: 'memory', title: 'Memory Test', short: 'Measure memory accuracy', desc: 'Evaluates short-term sequence recall under orbital stress.', range: 'Level 8+', Icon: Brain, bg: 'rgba(168,85,247,.15)', fg: '#c084fc', C: MemoryGame },
  { id: 'focus', title: 'Focus Test', short: 'Measure attention', desc: 'Tracks sustained attention and distraction filtering accuracy.', range: '90% – 100% accuracy', Icon: Target, bg: 'rgba(16,185,129,.15)', fg: '#34d399', C: FocusGame },
  { id: 'pattern', title: 'Pattern Test', short: 'Measure problem-solving', desc: 'Assesses logical problem-solving and pattern recognition.', range: '4 – 5 correct of 5', Icon: Puzzle, bg: 'rgba(14,165,233,.15)', fg: '#38bdf8', C: PatternGame },
];

export default function TestsGames() {
  const { user } = useAuth();
  const nav = useNavigate();
  const key = `scores:${user.email}`;
  const [scores, setScores] = useState(() => db.get(key, []));
  const [open, setOpen] = useState(null);

  const finish = (id, score) => {
    setScores((prev) => {
      const next = [...prev, { game: id, score: Math.round(score), date: new Date().toISOString() }];
      db.set(key, next);
      return next;
    });
  };

  const best = (id) => { const s = scores.filter((x) => x.game === id); return s.length ? Math.max(...s.map((x) => x.score)) : null; };
  const avgs = GAMES.map((g) => scores.filter((x) => x.game === g.id)).filter((a) => a.length).map((a) => a.reduce((s, x) => s + x.score, 0) / a.length);
  const average = avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : null;
  const rating = average !== null ? rate(average) : null;
  const game = GAMES.find((g) => g.id === open);

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Tests & Games</h1>
        <p>Challenge your cognitive reflexes and evaluate neurological health ratings</p>
      </div>

      <div className="glass-card rating-banner">
        <div>
          <p className="section-title">Overall average</p>
          {rating ? (
            <>
              <span className="rating-score">{Math.round(average)}/100</span>
              <span className={`rating-label rating-${rating.key}`}>{rating.label}</span>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>{rating.msg}</p>
            </>
          ) : <p style={{ color: 'var(--text-muted)' }}>Play a game to get your rating.</p>}
        </div>
        {rating?.key === 'average' && <div className="rating-actions"><button className="btn-primary" onClick={() => nav('/training')}>Go to Training</button></div>}
        {rating?.key === 'poor' && <div className="rating-actions"><button className="btn-primary" onClick={() => nav('/dr-ai')}>Talk to Dr AI</button></div>}
      </div>

      <div className="games-grid">
        {GAMES.map((g) => (
          <button key={g.id} className="glass-card game-card" onClick={() => setOpen(g.id)}>
            <div className="game-card-left">
              <div className="game-icon" style={{ background: g.bg, color: g.fg }}><g.Icon size={28} /></div>
              <div>
                <h3>{g.title}</h3>
                <p>{g.short}</p>
                <div className="best">Best: {best(g.id) ?? '—'}</div>
              </div>
            </div>
            <ArrowRight size={22} color="var(--accent-cyan)" />
          </button>
        ))}
      </div>

      {game && (
        <Modal onClose={() => setOpen(null)}>
          <div className="modal-head">
            <div className="game-icon" style={{ background: game.bg, color: game.fg, width: 52, height: 52 }}><game.Icon size={26} /></div>
            <div><h2>{game.title}</h2><p>{game.desc}</p></div>
          </div>
          <div className="rate-metrics-bar">
            <div className="rate-box"><span>Healthy Astronaut Range</span><strong>{game.range}</strong></div>
            <div className="rate-box"><span>Your Best Score</span><strong>{best(game.id) ?? '—'}</strong></div>
            <div className="rate-box"><span>Rating</span><strong>{best(game.id) !== null ? rate(best(game.id)).label : 'Not rated'}</strong></div>
          </div>
          <div className="game-arena"><game.C onFinish={(s) => finish(game.id, s)} /></div>
        </Modal>
      )}
    </section>
  );
}
