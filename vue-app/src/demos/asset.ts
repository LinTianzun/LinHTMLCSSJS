/**
 * Resolve a /public asset path against the deploy base.
 *
 * Demos reference shared assets under /demos/... (copied to vue-app/public/demos).
 * Absolute "/demos/..." breaks when the site is deployed under a subpath
 * (GitHub Pages: /LinHTMLCSSJS/), so every runtime reference must go through
 * this helper to get "<BASE_URL>/demos/...".
 *
 * @param path public path starting with "/", e.g. "/demos/motion/img/XK.webp"
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  return base.replace(/\/+$/, '') + path
}
