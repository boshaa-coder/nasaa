import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '../utils/storage';

const rawOf = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const subscribe = (fn) => {
  window.addEventListener('local-db', fn);
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener('local-db', fn);
    window.removeEventListener('storage', fn);
  };
};

// Reactive localStorage value: [value, set]. Reacts to this tab and to other tabs.
export default function useStorage(key, initial) {
  const initialRef = useRef(initial);
  const [value, setValue] = useState(() => db.get(key, initial));
  const lastRaw = useRef(undefined);

  useEffect(() => {
    const sync = () => {
      const raw = rawOf(key);
      if (raw === lastRaw.current) return;
      lastRaw.current = raw;
      setValue(db.get(key, initialRef.current));
    };
    lastRaw.current = undefined;
    sync();
    return subscribe(sync);
  }, [key]);

  const set = useCallback((next) => {
    const cur = db.get(key, initialRef.current);
    db.set(key, typeof next === 'function' ? next(cur) : next);
  }, [key]);

  return [value, set];
}

// Re-renders the component on ANY localStorage change (for per-member keys like vitals:{email}).
export function useStorageVersion() {
  const [n, setN] = useState(0);
  useEffect(() => subscribe(() => setN((x) => x + 1)), []);
  return n;
}

// Ticking clock, used to detect members who stopped sending vitals (offline).
export function useNow(ms = 2000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}