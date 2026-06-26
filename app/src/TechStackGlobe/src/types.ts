export interface TechItem {
  /** Display name shown in tooltip and panel header, e.g. "PostgreSQL" */
  name: string;
  /** Used for the accent colour in the panel. Must match a key in DEFAULT_CATEGORY_COLORS
   *  or be supplied via the `categoryColors` prop on TechStackGlobe. */
  category: string;
  /** Simple Icons slug — https://simpleicons.org. Drives the CDN logo URL.
   *  Falls back to a two-letter monogram when the CDN has no entry. */
  slug: string;
  /** One-sentence description of what the tool is. */
  description: string;
  /** Why this tool is chosen over alternatives. Optional — omit to hide the row. */
  whyUsed?: string;
  /** Prose summary of hands-on experience. Written as complete sentences separated by
   *  `. ` or `; ` — each sentence becomes its own bullet in the panel.
   *  Optional — omit to hide the section. */
  myExperience?: string;
}

/** Built-in category → accent colour mappings.
 *  Import this to see which categories are available out of the box, or to
 *  extend/override via the `categoryColors` prop on TechStackGlobe. */
export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  'AI/ML':     'var(--color-accent, #2dd4bf)',
  'Backend':   'var(--color-accent-blue, #60a5fa)',
  'Cloud':     'var(--color-green, #4ade80)',
  'Databases': 'var(--color-amber, #fbbf24)',
};
