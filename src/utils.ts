/** Prefix a root-relative path with the configured base (subpath-safe for GitHub Pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL
  return (base.endsWith('/') ? base : base + '/') + path.replace(/^\//, '')
}
