// Entry point: wires up every page behaviour. Each module owns one job.
import { initDotGrid } from './background';
import { initCursor } from './cursor';
import { initHeaderHide, initMenu, initCaseToc, initLearningFilter, initCopy } from './ui';
import { initLoaderAndHero, initReveal, initScrollMotion, initMagnetic, initPortraitReveal } from './motion';

const root = document.documentElement;
(window as unknown as { __siteReady: boolean }).__siteReady = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

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
