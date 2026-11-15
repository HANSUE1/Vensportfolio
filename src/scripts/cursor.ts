// Custom cursor (desktop mouse only): glowing trail, "View" ring over links, spark burst on click.

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/* ───────── Custom cursor: glowing trail, "View" ring, click burst ───────── */
export function initCursor() {
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
  // Only real links get the ring; static covers (e.g. Leadership) keep the plain dot.
  const TARGETS = '[data-cursor-label], a.project-card__image, .gallery__tile';
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
