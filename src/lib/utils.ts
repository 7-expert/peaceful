/**
 * Converts a product name into a URL-safe slug.
 * e.g. "Cryer Extracting Forceps (150)" → "cryer-extracting-forceps-150"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .trim();
}
