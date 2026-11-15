import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
(window as unknown as { __motionReady: boolean }).__motionReady = true;

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Features that work with or without motion
initReadingLog();
initCopyButtons();
initActiveNav();

// Motion layer: only when the visitor allows it and the JS-gated CSS is active
document.fonts.ready.then(() => {
  if (!root.classList.contains('js')) return;
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -72 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    heroIntro();
    reveals();
    penStrokes();
    highlights();
    counters();
    spines();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });
});

/* ───────── Hero: lines rise from a mask, then the pen underlines ───────── */
function heroIntro() {
  const title = document.querySelector<HTMLElement>('.hero-title');
  const bits = gsap.utils.toArray<HTMLElement>('[data-hero]');
  const pen = document.querySelector('[data-hero-pen] path');
  const note = gsap.utils.toArray<SVGPathElement>('.arrow-note path');

  if (title) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(title, { autoAlpha: 1 });
        return gsap.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'expo.out' });
      },
    });
  }

  const tl = gsap.timeline({ delay: 0.25, defaults: { ease: 'expo.out' } });
  tl.to(bits, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 });
  if (pen) tl.to(pen, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.55);
  if (note.length) tl.fromTo(note, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.25, ease: 'power2.inOut' }, 0.9);
}

/* ───────── Batched scroll reveals (one observer per batch, not per element) ───────── */
function reveals() {
  const show = (els: Element[]) =>
    gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08, ease: 'expo.out', overwrite: true });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', onEnter: show, onLeave: show, onEnterBack: show });
}

/* ───────── Red-pen underlines draw in on scroll ───────── */
function penStrokes() {
  gsap.utils.toArray<HTMLElement>('[data-pen]').forEach((el) => {
    const path = el.querySelector('.pen path');
    if (!path) return;
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.9,
      delay: 0.3,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });
}

/* ───────── Highlighter sweeps follow the scroll ───────── */
function highlights() {
  gsap.utils.toArray<HTMLElement>('.hl').forEach((el) => {
    gsap.to(el, {
      '--hl': '100%',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 58%', scrub: 0.6 },
    });
  });
}

/* ───────── Numbers count up once ───────── */
function counters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    gsap.to(state, {
      v: end,
      duration: 1.4,
      ease: 'power2.out',
      snap: { v: 1 },
      onStart: () => { el.textContent = '0'; },
      onUpdate: () => { el.textContent = String(state.v); },
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
    });
  });
}

/* ───────── Timeline spine grows with scroll ───────── */
function spines() {
  gsap.utils.toArray<HTMLElement>('.spine').forEach((el) => {
    gsap.to(el, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 65%', scrub: 0.5 },
    });
  });
}

/* ───────── Reading log: filter chips + "show all", animated with Flip ───────── */
function initReadingLog() {
  const log = document.querySelector<HTMLElement>('[data-log]');
  if (!log) return;
  const items = Array.from(log.querySelectorAll<HTMLElement>('li[data-theme]'));
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const more = document.querySelector<HTMLButtonElement>('[data-log-more]');
  const limit = Number(log.dataset.limit) || 8;
  let filter = 'all';
  let expanded = false;

  const apply = (animate: boolean) => {
    const state = animate ? Flip.getState(items) : null;
    let matches = 0;
    for (const li of items) {
      const match = filter === 'all' || li.dataset.theme === filter;
      if (match) matches++;
      li.hidden = !(match && (expanded || matches <= limit));
    }
    if (more) {
      more.hidden = matches <= limit;
      more.textContent = expanded ? 'Show fewer' : `Show all ${matches}`;
      more.setAttribute('aria-expanded', String(expanded));
    }
    if (state) {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.02 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.2 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      ScrollTrigger.refresh();
    }
  };

  const canAnimate = () => !reduceMotion.matches && root.classList.contains('js');

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter ?? 'all';
      expanded = false;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      apply(canAnimate());
    }),
  );
  more?.addEventListener('click', () => {
    const wasExpanded = expanded;
    expanded = !expanded;
    apply(canAnimate());
    if (wasExpanded) log.scrollIntoView({ block: 'start' });
  });
  apply(false);
}

/* ───────── Copy email with a drawn check mark ───────── */
function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('.label');
    const original = label?.textContent ?? '';
    let timer: number | undefined;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        btn.classList.add('is-done');
        if (label) label.textContent = 'Copied';
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          btn.classList.remove('is-done');
          if (label) label.textContent = original;
        }, 2400);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });
}

/* ───────── Mark the nav link for the chapter in view ───────── */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a[href*="#"]'));
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter((s): s is HTMLElement => !!s);
  if (!sections.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}
