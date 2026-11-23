/**
 * Anonymous counting of page views and WhatsApp-button clicks (see /api/track.php).
 * No cookies and no personal data: the browser only remembers whether it has visited before
 * (to count unique visitors) and on which day it last visited.
 */
const ENDPOINT = '/api/track.php';

const store = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage blocked: the visit is still counted */
    }
  },
};

const enabled = () =>
  typeof window !== 'undefined' &&
  !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) &&
  !navigator.webdriver;

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
  } catch {
    /* fall through to fetch */
  }
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true, credentials: 'same-origin' }).catch(() => {});
}

/** Random ID for this browser tab's visit, so the pages of one visit can be shown together. */
function visitId(): string {
  try {
    let id = window.sessionStorage.getItem('pym_s');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      window.sessionStorage.setItem('pym_s', id);
    }
    return id;
  } catch {
    return '';
  }
}

const todayIST = () => new Date(Date.now() + 19800000).toISOString().slice(0, 10);

export function trackView(path: string) {
  if (!enabled()) return;
  const isNew = !store.get('pym_v');
  const day = todayIST();
  const isNewToday = store.get('pym_d') !== day;
  store.set('pym_v', '1');
  store.set('pym_d', day);
  send({ t: 'view', v: visitId(), p: path, n: isNew ? 1 : 0, d: isNewToday ? 1 : 0, r: isNew || isNewToday ? document.referrer : '' });
}

export function trackWhatsApp(source: 'floating' | 'contact' | 'footer') {
  if (!enabled()) return;
  send({ t: 'wa', v: visitId(), s: source, p: window.location.pathname });
}
