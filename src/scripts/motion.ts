// Page motion: intro loader, scroll reveals, scroll-linked tickers, magnetic hero portrait.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const root = document.documentElement;

/* ───────── Handwriting: script text is uncovered left to right, like a pen writing it ─────────
   Negative insets leave room for the script font's swashes, which spill outside the text box.
   The hidden state matches the CSS in global.css, so nothing flashes before this runs. */
const UNWRITTEN = 'inset(-30% 100% -60% -12%)';
const WRITTEN = 'inset(-30% -12% -60% -12%)';
const writeTime = (el: Element) => gsap.utils.clamp(0.8, 1.8, (el.textContent?.trim().length ?? 12) * 0.055);
const writeIn = (el: Element, vars: gsap.TweenVars = {}) =>
  gsap.fromTo(el, { clipPath: UNWRITTEN }, { clipPath: WRITTEN, duration: writeTime(el), ease: 'sine.inOut', ...vars });

/* ───────── Landing intro, then hero entrance ─────────
   1. The name fades in, large and centred.
   2. It holds for a moment.
   3. It shrinks and glides onto the header logo (top-left) while the white layer fades out
      and the hero content rises in. The real logo takes over the moment the name lands.
   A click, key press, scroll or touch fast-forwards the whole sequence. */
export function initLoaderAndHero() {
  const heroIn = () => {
    gsap.fromTo('[data-hero]', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' });
    // Inner pages: the script line above the title writes itself in.
    document.querySelectorAll('.page-head__script').forEach((el) => writeIn(el, { delay: 0.3 }));
    // Then the teacher's red-pen marks draw themselves in, one after the other (home page only).
    const marks = document.querySelectorAll('.mark__svg path');
    if (marks.length) gsap.to(marks, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.45, delay: 0.9 });
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
      .set(name, { autoAlpha: 1 })
      .add(writeIn(name, { duration: writeTime(name) + 0.3 })) // the name is handwritten onto the page
      .to({}, { duration: 0.5 }) // hold
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

/* ───────── Paper plane: loops through "What I've been up to", drawing its trail as you scroll ───────── */
export function initPaperPlane() {
  const svg = document.querySelector<SVGSVGElement>('[data-paper-plane]');
  const trail = svg?.querySelector<SVGPathElement>('.paper-plane__trail');
  const reveal = svg?.querySelector<SVGPathElement>('.paper-plane__reveal');
  const plane = svg?.querySelector<SVGGElement>('.paper-plane__plane');
  if (!svg || !trail || !reveal || !plane) return;
  // Only where the plane is shown (CSS hides it on phones). Reverting puts it back at rest.
  gsap.matchMedia().add('(min-width: 48rem)', () => {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 30%', scrub: 1 },
    })
      // Plane and trail both move at constant speed along the path, so the trail ends at the plane.
      .fromTo(reveal, { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0)
      .to(plane, { motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], autoRotate: true }, immediateRender: true }, 0);
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
