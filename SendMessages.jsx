import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Radio } from 'lucide-react';
import useStorage from '../../hooks/useStorage';

const MAX = 500;

export default function SendMessages() {
  const [params] = useSearchParams();
  const [users] = useStorage('users', []);
  const [inbox, setInbox] = useStorage('inbox', []);
  const [sel, setSel] = useState(params.get('to') || 'all');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const logRef = useRef(null);

  const crew = users.filter((u) => u.role === 'user');
  const target = sel === 'all' || crew.some((u) => u.email === sel) ? sel : 'all';
  const targetUser = crew.find((u) => u.email === target);
  const thread = inbox.filter((m) => (target === 'all' ? m.to === 'all' : m.to === target || m.to === 'all'));

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [thread.length, target]);

  const send = () => {
    const t = text.trim();
    if (crew.length === 0) { setError('There are no crew members to message yet.'); return; }
    if (!t) { setError('Type a message first.'); return; }
    if (t.length > MAX) { setError(`Message is too long (max ${MAX} characters).`); return; }
    setInbox((cur) => [...cur, { id: Date.now(), to: target, text: t, time: new Date().toISOString() }]);
    setText('');
    setError('');
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Send Messages</h1>
        <p>Write to one crew member or the whole crew. Messages appear in their Messages page instantly.</p>
      </div>

      <div className="glass-card chat-card">
        <div className="recipient-bar">
          <label htmlFor="recipient">To</label>
          <select id="recipient" value={target} onChange={(e) => { setSel(e.target.value); setError(''); }}>
            <option value="all">All crew ({crew.length})</option>
            {crew.map((u) => <option key={u.email} value={u.email}>{u.name} — {u.email}</option>)}
          </select>
        </div>

        <div className="chat-log" ref={logRef}>
          {thread.length === 0 && (
            <div className="chat-empty">
              <Radio size={28} />
              <p>No messages yet.</p>
              <p>Type below to message {targetUser ? targetUser.name : 'all crew'}.</p>
            </div>
          )}
          {thread.map((m) => (
            <div key={m.id} className="bubble me">
              {target !== 'all' && m.to === 'all' && <span className="bubble-tag">BROADCAST</span>}
              <div>{m.text}</div>
              <div className="bubble-time">{new Date(m.time).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {error && <p className="auth-error" style={{ padding: '0 24px 12px' }}>{error}</p>}
        <div className="chat-input">
          <input
            value={text}
            maxLength={MAX}
            placeholder={targetUser ? `Message ${targetUser.name}…` : 'Message all crew…'}
            onChange={(e) => { setText(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          />
          <button onClick={send} aria-label="Send"><Send size={18} /></button>
        </div>
      </div>
    </section>
  );
}