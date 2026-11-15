import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createDotGrid } from './dotgrid.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
(window as unknown as { __siteReady: boolean }).__siteReady = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

initDotGrid();
initPortraitReveal();
initMenu();
initCopy();
initLearningFilter();
initCaseToc();
initCursor();

// Motion runs only when allowed AND the JS-gated CSS is still active. If this script arrived after
// the 3 s failsafe in Base.astro removed `js`, content is already visible: don't hide it again.
if (!reduced.matches && root.classList.contains('js')) {
  initLoaderAndHero();
  initHeaderHide();
  initReveal();
  initScrollMotion();
  initMagnetic();
} else {
  root.classList.remove('ldr-on');
  document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', ''));
}

/* ───────── Interactive dot-grid background (falls back to the CSS dots without WebGL2) ───────── */
function initDotGrid() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-dotgrid]');
  if (!canvas) return;
  const destroy = createDotGrid(canvas, {
    baseColor: '#cccccc',
    activeColor: '#ff4c00',
    shape: 'circle',
    dotSize: 3,
    gap: 29,
    proximity: 140,
    strength: 0.5,
    bounce: 0.3,
    tension: 0.4,
    returnDuration: 1.4,
    shockRadius: 320,
    shockStrength: 5,
    swell: 0.6,
    stretch: 0.2,
    glow: 0.25,
    fade: 0,
    intro: true,
  });
  if (destroy) root.classList.add('has-dotgrid');
  else canvas.parentElement?.remove();
}

/* ───────── Mobile menu ───────── */
function initMenu() {
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
function initHeaderHide() {
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

/* ───────── Intro loader, then hero entrance ───────── */
function initLoaderAndHero() {
  const heroIn = () =>
    gsap.fromTo('[data-hero]', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' });

  if (!root.classList.contains('ldr-on')) { heroIn(); return; }
  const finish = () => {
    root.classList.add('ldr-out');
    setTimeout(heroIn, 250);
    setTimeout(() => root.classList.remove('ldr-on', 'ldr-out'), 750);
  };
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => setTimeout(finish, 1300));
}

/* ───────── Reveal on scroll (CSS transitions, toggled by attribute) ───────── */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-revealed', '');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

/* ───────── Scroll-linked tickers and gallery drift ───────── */
function initScrollMotion() {
  const vw = (n: number) => () => (window.innerWidth * n) / 100;
  const presets: Record<string, { from: number; to: number; minWidth?: number }> = {
    'ticker-a': { from: 0, to: -45 },
    'ticker-b': { from: -45, to: 20 },
    drift: { from: 0, to: -35, minWidth: 768 },
  };
  const mm = gsap.matchMedia();
  document.querySelectorAll<HTMLElement>('[data-scroll]').forEach((el) => {
    const p = presets[el.dataset.scroll ?? ''];
    if (!p) return;
    mm.add(p.minWidth ? `(min-width: ${p.minWidth}px)` : 'all', () => {
      gsap.fromTo(
        el,
        { x: vw(p.from) },
        {
          x: vw(p.to),
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
        },
      );
    });
  });
}

/* ───────── Magnetic hero circle (desktop) ───────── */
function initMagnetic() {
  const desktop = window.matchMedia('(min-width: 992px)');
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    // quickTo reuses one tween per axis: smooth, frame-rate independent, no hand-rolled rAF loop.
    const toX = gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      if (!desktop.matches || e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const x = Number(gsap.getProperty(el, 'x'));
      const y = Number(gsap.getProperty(el, 'y'));
      const h = (e.clientX - (r.left - x)) / r.width; // 0..1 across the resting circle
      const v = (e.clientY - (r.top - y)) / r.height;
      toX((-2 + 4 * h) * (window.innerWidth / 100) * 0.7);
      toY((-5 + 10 * v) * (window.innerHeight / 100) * 0.3);
    }, { passive: true });
    el.addEventListener('pointerleave', () => { toX(0); toY(0); });
  });
}

/* ───────── Portrait colour reveal: opens from the entry point, closes toward the exit ───────── */
function initPortraitReveal() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const layer = el.querySelector<HTMLElement>('.magnetic__hover');
    if (!layer) return;
    const setOrigin = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      layer.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      layer.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      // Move the collapsed circle to the entry point instantly (no transition), then open it,
      // so it grows from where the pointer came in instead of sliding over from the centre.
      layer.style.transition = 'none';
      setOrigin(e);
      void getComputedStyle(layer).clipPath;
      layer.style.transition = '';
      el.classList.add('is-revealed');
    });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      setOrigin(e);
      el.classList.remove('is-revealed');
    });
  });
}

/* ───────── Custom cursor: glowing trail, "View" ring, click burst ───────── */
function initCursor() {
  const box = document.querySelector<HTMLElement>('[data-cursor]');
  const canvas = box?.querySelector<HTMLCanvasElement>('[data-cursor-canvas]');
  const wrap = box?.querySelector<HTMLElement>('[data-cursor-wrap]');
  const label = box?.querySelector<HTMLElement>('[data-cursor-label-el]');
  const ctx = canvas?.getContext('2d');
  if (!box || !canvas || !wrap || !label || !ctx || !finePointer.matches) return;
  const wide = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  if (!wide.matches) return;

  box.setAttribute('data-active', '');
  root.setAttribute('data-custom-cursor', '');

  const COLORS = ['#ff4c00', '#ff7a2f', '#ffb347', '#ffd66e', '#fff3c4'];
  const TARGETS = '[data-cursor-label], .project-card__image, .gallery__tile';
  type Pt = { x: number; y: number; t: number };
  type Spark = { x: number; y: number; vx: number; vy: number; born: number; life: number; size: number; color: string; streak: boolean };
  const trail: Pt[] = [];
  const sparks: Spark[] = [];
  let mx = -100, my = -100, inside = false, bursting = false, burstAt = 0, frame = 0, dpr = 1, last = performance.now();

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  };
  resize();
  window.addEventListener('resize', resize);
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };

  function draw(now: number) {
    frame = 0;
    const dt = Math.min(48, now - last);
    last = now;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    let busy = false;

    // Trail: fading line segments behind the pointer
    while (trail.length && now - trail[0].t > 300) trail.shift();
    if (trail.length > 1) {
      ctx!.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) {
        const k = 1 - (now - trail[i].t) / 300;
        ctx!.strokeStyle = `rgba(255, ${Math.round(150 + 70 * (1 - k))}, ${Math.round(70 + 70 * (1 - k))}, ${0.5 * k * k})`;
        ctx!.lineWidth = 0.5 + 3.3 * k;
        ctx!.beginPath();
        ctx!.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx!.lineTo(trail[i].x, trail[i].y);
        ctx!.stroke();
      }
      busy = true;
    }

    // Sparks
    const f = dt / 16.7;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const k = (now - s.born) / s.life;
      if (k < 0) { busy = true; continue; }
      if (k >= 1) { sparks.splice(i, 1); continue; }
      const px = s.x, py = s.y;
      s.vx *= Math.pow(s.streak ? 0.93 : 0.96, f);
      s.vy = s.vy * Math.pow(s.streak ? 0.93 : 0.96, f) + (s.streak ? 0.06 : 0.015) * f;
      s.x += s.vx * f;
      s.y += s.vy * f;
      ctx!.globalAlpha = 1 - k * k;
      if (s.streak) {
        ctx!.strokeStyle = s.color;
        ctx!.lineWidth = s.size * (1 - k * 0.6);
        ctx!.beginPath();
        ctx!.moveTo(px - s.vx * 1.5, py - s.vy * 1.5);
        ctx!.lineTo(s.x, s.y);
        ctx!.stroke();
      } else {
        ctx!.fillStyle = s.color;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size * (1 - k * 0.5), 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      busy = true;
    }

    // Dot (hidden while the ring is showing)
    if (inside && box!.dataset.state !== 'ring') {
      const grow = bursting ? Math.min(1, (now - burstAt) / 160) : 0;
      if (grow < 1) {
        ctx!.save();
        ctx!.globalAlpha = 1 - grow;
        ctx!.shadowColor = 'rgba(255, 176, 64, 0.8)';
        ctx!.shadowBlur = 8;
        ctx!.fillStyle = '#ff4c00';
        ctx!.beginPath();
        ctx!.arc(mx, my, 5 * (1 + grow * 1.4), 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
        if (bursting) busy = true;
      }
    }
    if (busy) schedule();
  }

  const burst = (x: number, y: number) => {
    const now = performance.now();
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const v = 4.2 + Math.random() * 3;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, born: now, life: 560 + Math.random() * 260, size: 2 + Math.random() * 1.2, color: COLORS[Math.floor(Math.random() * COLORS.length)], streak: true });
    }
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.8 + Math.random() * 2.4;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, born: now + 80, life: 700 + Math.random() * 400, size: 0.9 + Math.random() * 1.3, color: COLORS[2 + Math.floor(Math.random() * 3)], streak: false });
    }
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || bursting) return;
    const dx = e.clientX - mx, dy = e.clientY - my;
    mx = e.clientX; my = e.clientY;
    wrap.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (!inside) { inside = true; trail.length = 0; }
    else if (!reduced.matches) {
      if (Math.hypot(dx, dy) > 160) trail.length = 0;
      trail.push({ x: mx, y: my, t: performance.now() });
      if (Math.hypot(dx, dy) > 5 && Math.random() < 0.45) {
        sparks.push({ x: mx, y: my, vx: -dx * 0.04 + (Math.random() - 0.5) * 0.5, vy: -dy * 0.04 + (Math.random() - 0.5) * 0.5, born: performance.now(), life: 380 + Math.random() * 260, size: 0.7 + Math.random() * 1.1, color: COLORS[2 + Math.floor(Math.random() * 3)], streak: false });
      }
    }
    schedule();
  }, { passive: true });

  const setTarget = (target: EventTarget | null) => {
    const t = target instanceof Element ? target.closest<HTMLElement>(TARGETS) : null;
    if (t) label.textContent = t.dataset.cursorLabel ?? 'View';
    box.dataset.state = t ? 'ring' : 'idle';
    schedule();
  };
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'mouse' && !bursting) setTarget(e.target);
  });
  // Scrolling moves content under a still pointer without firing pointerover; re-check so the
  // "View" ring doesn't stay stuck after a card scrolls away.
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued || !inside || bursting) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; setTarget(document.elementFromPoint(mx, my)); });
  }, { passive: true });
  root.addEventListener('pointerleave', () => { inside = false; if (!bursting) box.dataset.state = 'idle'; schedule(); });

  // Burst, then navigate, for internal card links
  document.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('.project-card a[href], .gallery a[href], .teaser__tile[href], .magnetic[href]') : null;
    if (!link || bursting || reduced.matches || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const dest = new URL(link.href, location.href);
    if (dest.origin !== location.origin || link.target === '_blank' || (dest.pathname === location.pathname && dest.hash)) return;
    e.preventDefault();
    mx = e.clientX; my = e.clientY;
    bursting = true; burstAt = performance.now();
    box.dataset.state = 'burst';
    burst(mx, my);
    schedule();
    setTimeout(() => window.location.assign(dest.href), 650);
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) { bursting = false; sparks.length = 0; trail.length = 0; box.dataset.state = 'idle'; schedule(); }
  });
}

/* ───────── Case study: reading progress + active section ───────── */
function initCaseToc() {
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
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

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
function initLearningFilter() {
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
function initCopy() {
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
