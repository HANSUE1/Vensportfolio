// Entry point: wires up every page behaviour. Each module owns one job.
import { initDotGrid } from './background';
import { initCursor } from './cursor';
import { initHeaderHide, initMenu, initCaseToc, initLearningFilter, initCopy, initGallery } from './ui';
import { initLoaderAndHero, initReveal, initScrollMotion, initMagnetic, initPortraitReveal, initPaperPlane } from './motion';

const root = document.documentElement;
(window as unknown as { __siteReady: boolean }).__siteReady = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

// One failing feature (e.g. no WebGL, an old browser API) must not take the rest of the page down.
const safe = (init: () => void) => {
  try {
    init();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

[initDotGrid, initPortraitReveal, initMenu, initCopy, initLearningFilter, initCaseToc, initGallery, initCursor].forEach(safe);

// Motion runs only when allowed AND the JS-gated CSS is still active. If this script arrived after
// the 3 s failsafe in Base.astro removed `js`, content is already visible: don't hide it again.
if (!reduced.matches && root.classList.contains('js')) {
  const ok = [initLoaderAndHero, initHeaderHide, initReveal, initScrollMotion, initMagnetic, initPaperPlane].map(safe).every(Boolean);
  // __siteReady already disarmed the failsafe, so if motion broke, reveal everything here instead.
  if (!ok) root.classList.remove('js', 'ldr-on');
} else {
  root.classList.remove('ldr-on');
  document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', ''));
}
