// Page UI that works with or without motion: menu, header, case-study contents, filters, copy button.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ───────── Mobile menu ───────── */
export function initMenu() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  if (!header || !button) return;
  const set = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    header.toggleAttribute('data-menu-open', open);
  };
  button.addEventListener('click', () => set(button.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('.site-header__link').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  window.matchMedia('(min-width: 62rem)').addEventListener('change', () => set(false));
}

/* ───────── Header hides on scroll down, returns on scroll up ───────── */
export function initHeaderHide() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = window.scrollY;
  let queued = false;
  const update = () => {
    queued = false;
    const y = window.scrollY;
    const delta = y - last;
    if (header.hasAttribute('data-menu-open')) return;
    if (y <= 0) header.classList.remove('is-hidden');
    else if (delta > 2) header.classList.add('is-hidden');
    else if (delta < -2) header.classList.remove('is-hidden');
    if (Math.abs(delta) > 2 || y <= 0) last = y;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
}

/* ───────── Case study: reading progress + active section ───────── */
export function initCaseToc() {
  const article = document.querySelector<HTMLElement>('[data-case]');
  const pct = document.querySelector<HTMLElement>('[data-toc-pct]');
  const bar = document.querySelector<HTMLElement>('[data-toc-bar]');
  if (!article || !pct || !bar) return;
  const update = () => {
    const r = article.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = Math.min(1, Math.max(0, total > 0 ? -r.top / total : 1));
    pct.textContent = `${Math.round(p * 100)}%`;
    bar.style.transform = `scaleX(${p})`;
  };
  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } };
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => (a.hash === `#${e.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach((a) => { const s = document.getElementById(a.hash.slice(1)); if (s) io.observe(s); });
}

/* ───────── Learning page: theme filter ───────── */
export function initLearningFilter() {
  const log = document.querySelector<HTMLElement>('[data-log]');
  if (!log) return;
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(log.querySelectorAll<HTMLElement>('li[data-theme]'));
  const years = Array.from(log.querySelectorAll<HTMLElement>('[data-year]'));
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter ?? 'all';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    items.forEach((li) => { li.hidden = f !== 'all' && li.dataset.theme !== f; });
    years.forEach((y) => { y.hidden = !y.querySelector('li:not([hidden])'); });
    if (!reduced.matches) {
      gsap.fromTo(items.filter((li) => !li.hidden), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.025, ease: 'expo.out' });
    }
    ScrollTrigger.refresh();
  }));
}

/* ───────── Copy email ───────── */
export function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    // One always-rendered live region whose text changes, so screen readers announce "Copied".
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const idle = label?.textContent ?? '';
    let timer = 0;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        if (label) label.textContent = 'Copied ✓';
        btn.classList.add('is-done');
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (label) label.textContent = idle;
          btn.classList.remove('is-done');
        }, 2200);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });
}
