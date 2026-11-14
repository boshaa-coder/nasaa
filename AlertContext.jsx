import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { startSiren, stopSiren } from '../utils/sound';
import { db } from '../utils/storage';
import useStorage from '../hooks/useStorage';
import { useAuth } from './AuthContext';

const AlertCtx = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(AlertCtx);

export function AlertProvider({ children }) {
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [remote] = useStorage('remoteAlerts', []);
  const seen = useRef(null); // highest remoteAlerts id already handled by this tab

  // source: 'admin' when triggered remotely, otherwise 'self' (onClick passes an event, so it is ignored)
  const trigger = (source) => {
    setActive(true);
    try { startSiren(); } catch { /* audio can be blocked until the page gets a click */ }
    // keep a record so the admin can see the incident
    db.set('incidents', [
      { email: user?.email, name: user?.name, time: new Date().toISOString(), source: source === 'admin' ? 'admin' : 'self' },
      ...db.get('incidents', []),
    ]);
  };
  const clear = () => { setActive(false); stopSiren(); };

  useEffect(() => { seen.current = null; }, [user?.email]);

  // Admin-triggered Alert Mode: only alerts created AFTER this member's tab loaded are handled.
  useEffect(() => {
    if (!user?.email || user.role !== 'user') return;
    const maxId = remote.reduce((m, r) => Math.max(m, r.id || 0), 0);
    if (seen.current === null) { seen.current = maxId; return; }
    const fresh = remote.some((r) => r.id > seen.current && (r.to === 'all' || r.to === user.email));
    seen.current = Math.max(seen.current, maxId);
    if (fresh && !active) trigger('admin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote, user?.email]);

  return <AlertCtx.Provider value={{ active, trigger, clear }}>{children}</AlertCtx.Provider>;
}
