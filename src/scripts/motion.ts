// Page motion: intro loader, scroll reveals, scroll-linked tickers, magnetic hero portrait.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;

/* ───────── Landing intro, then hero entrance ─────────
   1. The name fades in, large and centred.
   2. It holds for a moment.
   3. It shrinks and glides onto the header logo (top-left) while the white layer fades out
      and the hero content rises in. The real logo takes over the moment the name lands.
   A click, key press, scroll or touch fast-forwards the whole sequence. */
export function initLoaderAndHero() {
  const heroIn = () => {
    gsap.fromTo('[data-hero]', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' });
    // Then the teacher's red-pen marks draw themselves in, one after the other.
    gsap.to('.mark__svg path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.45, delay: 0.9 });
  };

  const ldr = document.querySelector<HTMLElement>('.ldr');
  const name = ldr?.querySelector<HTMLElement>('.ldr__name');
  const bg = ldr?.querySelector<HTMLElement>('.ldr__bg');
  const logo = document.querySelector<HTMLElement>('.site-header__logo');
  if (!root.classList.contains('ldr-on') || !ldr || !name || !bg || !logo) {
    root.classList.remove('ldr-on');
    heroIn();
    return;
  }

  let speed = 1;
  let active: gsap.core.Timeline | null = null;
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
  const skip = () => { speed = 4; active?.timeScale(speed); };
  skipEvents.forEach((type) => window.addEventListener(type, skip, { once: true, passive: true }));

  const finish = () => {
    skipEvents.forEach((type) => window.removeEventListener(type, skip));
    root.classList.remove('ldr-on');
    gsap.set([name, bg, logo], { clearProps: 'all' });
  };

  // Measured at flight time, so it lands exactly on the logo at any window size or zoom.
  const fly = () => {
    const from = name.getBoundingClientRect();
    const to = logo.getBoundingClientRect();
    ldr.style.pointerEvents = 'none'; // the page underneath is clickable as soon as it shows
    active = gsap.timeline({ onComplete: finish })
      .to(name, { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width, duration: 1.15, ease: 'expo.inOut' }, 0)
      .to(bg, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .add(heroIn, 0.55)
      .set(logo, { opacity: 1 }, 1.15) // real logo appears under the landed name...
      .to(name, { autoAlpha: 0, duration: 0.2 }, 1.15) // ...and the flying copy fades away
      .timeScale(speed);
  };

  // Wait for the script font so the name is measured in its final shape.
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
    active = gsap.timeline({ onComplete: fly })
      .fromTo(name, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' })
      .to({}, { duration: 0.7 }) // hold
      .timeScale(speed);
  });
}

/* ───────── Reveal on scroll (CSS transitions, toggled by attribute) ───────── */
export function initReveal() {
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
export function initScrollMotion() {
  const vw = (n: number) => () => (window.innerWidth * n) / 100;
  const presets: Record<string, { from: number; to: number; minWidth?: number }> = {
    'ticker-a': { from: 0, to: -45 },
    'ticker-b': { from: -65, to: 0 }, // ends at 0 so no gap opens on the left
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
export function initMagnetic() {
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
export function initPortraitReveal() {
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
