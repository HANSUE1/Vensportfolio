// Custom cursor (desktop mouse only).
//
// Layers:
//   - .cursor__dot / .cursor__ring / .cursor__label: real DOM elements that follow the pointer.
//     They can never leave marks behind because nothing is "painted" for them.
//   - <canvas>: only the short trail and the click burst. It is wiped in device pixels at the
//     start of every frame (zoom-safe), and the loop stops as soon as nothing is moving.

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');

const TRAIL_MS = 160; // how long the trail lingers behind the pointer
const LINK_TARGETS = '[data-cursor-label], a.project-card__image, .gallery__tile'; // show the "View" ring
const BURST_LINKS = '.project-card a[href], .gallery a[href], .teaser__tile[href], .magnetic[href]';
const COLORS = ['#ff4c00', '#ff7a2f', '#ffb347', '#ffd66e', '#fff3c4'];

type Point = { x: number; y: number; t: number };
type Spark = { x: number; y: number; vx: number; vy: number; born: number; life: number; size: number; color: string };

export function initCursor() {
  const box = document.querySelector<HTMLElement>('[data-cursor]');
  const canvas = box?.querySelector<HTMLCanvasElement>('[data-cursor-canvas]');
  const wrap = box?.querySelector<HTMLElement>('[data-cursor-wrap]');
  const label = box?.querySelector<HTMLElement>('[data-cursor-label-el]');
  const ctx = canvas?.getContext('2d');
  if (!box || !canvas || !wrap || !label || !ctx || !desktop.matches) return;

  box.setAttribute('data-active', '');
  root.setAttribute('data-custom-cursor', '');

  const trail: Point[] = [];
  const sparks: Spark[] = [];
  let x = -100, y = -100, raf = 0, last = 0, dpr = 1, leaving = false;

  /* ── Canvas sizing: follows window size AND zoom (zoom changes devicePixelRatio) ── */
  const resize = () => {
    dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    schedule();
  };
  window.addEventListener('resize', resize);
  resize();

  /* ── Render loop: runs only while the trail or sparks exist ── */
  function schedule() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(48, now - last) : 16.7;
    last = now;

    // Wipe the whole bitmap in device pixels, whatever the zoom level.
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
    drawTrail(now);
    drawSparks(now, dt / 16.7);

    if (trail.length > 1 || sparks.length) schedule();
    else last = 0; // idle: canvas is already blank, loop sleeps until the next move
  }

  function drawTrail(now: number) {
    if (trail.length < 2) return;
    ctx!.lineCap = 'round';
    for (let i = 1; i < trail.length; i++) {
      const k = 1 - (now - trail[i].t) / TRAIL_MS; // 1 = newest, 0 = about to vanish
      ctx!.strokeStyle = `rgba(255, ${Math.round(110 + 80 * (1 - k))}, ${Math.round(40 + 60 * (1 - k))}, ${0.35 * k})`;
      ctx!.lineWidth = 0.5 + 2.5 * k;
      ctx!.beginPath();
      ctx!.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx!.lineTo(trail[i].x, trail[i].y);
      ctx!.stroke();
    }
  }

  function drawSparks(now: number, f: number) {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const k = (now - s.born) / s.life;
      if (k >= 1) { sparks.splice(i, 1); continue; }
      s.vx *= Math.pow(0.92, f);
      s.vy = s.vy * Math.pow(0.92, f) + 0.05 * f;
      s.x += s.vx * f;
      s.y += s.vy * f;
      ctx!.globalAlpha = 1 - k * k;
      ctx!.strokeStyle = s.color;
      ctx!.lineWidth = s.size * (1 - k * 0.6);
      ctx!.beginPath();
      ctx!.moveTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
      ctx!.lineTo(s.x, s.y);
      ctx!.stroke();
    }
    ctx!.globalAlpha = 1;
  }

  /* ── Pointer tracking ── */
  const place = () => { wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`; };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || leaving) return;
    const jump = Math.hypot(e.clientX - x, e.clientY - y) > 160; // don't draw a line across a big jump
    x = e.clientX;
    y = e.clientY;
    place();
    box.removeAttribute('data-hidden');
    if (jump) trail.length = 0;
    if (!reduced.matches) {
      trail.push({ x, y, t: performance.now() });
      schedule();
    }
  }, { passive: true });

  // Hide everything when the mouse leaves the window, and drop the trail so it can't reappear.
  const hide = () => { box.setAttribute('data-hidden', ''); trail.length = 0; schedule(); };
  document.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide);

  /* ── "View" ring over links ── */
  const setTarget = (target: EventTarget | null) => {
    const t = target instanceof Element ? target.closest<HTMLElement>(LINK_TARGETS) : null;
    if (t) label.textContent = t.dataset.cursorLabel ?? 'View';
    box.dataset.state = t ? 'ring' : 'idle';
  };
  document.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse' && !leaving) setTarget(e.target); });
  // Scrolling moves content under a still pointer without a pointerover; re-check once per frame.
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued || leaving) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; setTarget(document.elementFromPoint(x, y)); });
  }, { passive: true });

  /* ── Click on a card: spark burst, then navigate ── */
  document.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>(BURST_LINKS) : null;
    if (!link || leaving || reduced.matches || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const dest = new URL(link.href, location.href);
    if (dest.origin !== location.origin || link.target === '_blank' || (dest.pathname === location.pathname && dest.hash)) return;
    e.preventDefault();
    leaving = true;
    box.dataset.state = 'burst';
    trail.length = 0;
    const now = performance.now();
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const v = 4 + Math.random() * 3;
      sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, born: now, life: 520 + Math.random() * 240, size: 1.6 + Math.random() * 1.2, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    }
    schedule();
    setTimeout(() => window.location.assign(dest.href), 600);
  });

  // Coming back with the browser's Back button restores a frozen page: reset it.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    leaving = false;
    sparks.length = 0;
    trail.length = 0;
    box.dataset.state = 'idle';
    schedule();
  });
}
