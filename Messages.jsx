import { useEffect } from 'react';
import { Crown, Radio } from 'lucide-react';
import { MESSAGES } from '../../data/content';
import { useAuth } from '../../context/AuthContext';
import useStorage from '../../hooks/useStorage';

export default function Messages() {
  const { user } = useAuth();
  const [inbox] = useStorage('inbox', []);
  const [read, setRead] = useStorage(`read:${user.email}`, 0);

  // messages from the admin addressed to me or to the whole crew, newest first
  const mine = inbox.filter((m) => m.to === 'all' || m.to === user.email).slice().reverse();

  // opening this page marks everything as read
  useEffect(() => {
    if (read !== mine.length) setRead(mine.length);
  }, [read, mine.length, setRead]);

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Mission Commander Directives</h1>
        <p>Official notes, schedule updates, and health observations from your spacecraft Team Leader</p>
      </div>
      <div className="messages-feed">
        {mine.map((m) => (
          <div key={m.id} className="glass-card commander-msg-card">
            <div className="msg-meta">
              <div className="sender-info">
                <span className="commander-badge"><Radio size={13} />MISSION CONTROL · {m.to === 'all' ? 'ALL CREW' : 'DIRECT'}</span>
                <span className="sender-name">Mission Admin</span>
              </div>
              <span className="msg-time">{new Date(m.time).toLocaleString()}</span>
            </div>
            <div className="msg-body">{m.text}</div>
          </div>
        ))}
        {MESSAGES.map((m) => (
          <div key={m.time} className="glass-card commander-msg-card">
            <div className="msg-meta">
              <div className="sender-info">
                <span className="commander-badge"><Crown size={13} />TEAM LEADER · COMMANDER</span>
                <span className="sender-name">Cmdr. Marcus Sterling</span>
              </div>
              <span className="msg-time">{m.time}</span>
            </div>
            <div className="msg-body">{m.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
