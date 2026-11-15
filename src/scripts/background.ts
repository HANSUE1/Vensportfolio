// Interactive dot-grid background. Falls back to the CSS dots when WebGL2 is unavailable.
import { createDotGrid } from './dotgrid.js';

const root = document.documentElement;

/* ───────── Interactive dot-grid background (falls back to the CSS dots without WebGL2) ───────── */
export function initDotGrid() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-dotgrid]');
  if (!canvas) return;
  const destroy = createDotGrid(canvas, {
    baseColor: '#cccccc',
    activeColor: '#ff4c00',
    shape: 'circle',
    dotSize: 3,
    gap: 29,
    proximity: 140,
    strength: 0.35,
    bounce: 0.3,
    tension: 0.4,
    returnDuration: 0.6,
    shockRadius: 320,
    shockStrength: 5,
    swell: 0.4,
    stretch: 0,
    glow: 0.12,
    fade: 0,
    intro: true,
  });
  if (destroy) root.classList.add('has-dotgrid');
  else canvas.parentElement?.remove();
}
