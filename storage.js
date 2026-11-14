export const db = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => {
    localStorage.setItem(k, JSON.stringify(v));
    // same-tab listeners (the native 'storage' event only fires in OTHER tabs)
    window.dispatchEvent(new Event('local-db'));
  },
};