import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { absoluteUrl } from '../config/site';
import { findRoute } from '../data/routes';
import { trackView } from '../lib/track';

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/**
 * Runs on every client-side navigation:
 * - updates title / description / canonical / Open Graph tags,
 * - restores scroll (top of page, or the #hash target),
 * - starts reveal-on-scroll for the new page.
 */
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    trackView(pathname);
    const meta = findRoute(pathname);
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[name="twitter:title"]', 'content', meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.description);
    if (meta.index) {
      setMeta('link[rel="canonical"]', 'href', absoluteUrl(meta.path));
      setMeta('meta[property="og:url"]', 'content', absoluteUrl(meta.path));
    }
  }, [pathname]);

  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    // Wait for the page transition to mount the new content.
    const t = window.setTimeout(
      () => {
        if (hash) {
          const target = document.getElementById(decodeURIComponent(hash.slice(1)));
          if (target) {
            target.scrollIntoView({ block: 'start' });
            return;
          }
        }
        if (!isFirst) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
          document.getElementById('main')?.focus({ preventScroll: true });
        }
      },
      isFirst ? 0 : 380,
    );
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const observe = () =>
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    observe();
    // New content arrives after the exit transition; also catch late-mounted nodes.
    const t1 = window.setTimeout(observe, 400);
    const mo = new MutationObserver(observe);
    const main = document.getElementById('root');
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(t1);
    };
  }, [pathname]);

  return null;
}
