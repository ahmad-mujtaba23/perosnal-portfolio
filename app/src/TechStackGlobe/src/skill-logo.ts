export function getLogoSrc(slug: string, overrides: Record<string, string> = {}): string {
  return overrides[slug] ?? `https://cdn.simpleicons.org/${slug}`;
}

export function getMonogram(name: string): string {
  return name.split(/[\s.]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
