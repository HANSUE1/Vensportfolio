/** Prefix a path with the deploy base (e.g. "/Vensportfolio/" on GitHub Pages). */
export const url = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
