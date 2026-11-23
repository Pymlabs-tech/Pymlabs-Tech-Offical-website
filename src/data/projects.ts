/**
 * PORTFOLIO DATA
 * ---------------------------------------------------------------
 * Add verified projects only. Never list a client name, logo or result
 * without the client's permission. Each project appears automatically
 * on /portfolio/ with category filters and a detail view.
 *
 * Example (copy, fill in, and add to the `projects` array below):
 *
 * {
 *   slug: 'inventory-dashboard',
 *   title: 'Inventory dashboard',
 *   category: 'Web Application',
 *   year: 2026,
 *   summary: 'One sentence shown on the card.',
 *   description: ['Paragraph shown in the detail view.', 'Another paragraph.'],
 *   technologies: ['React', 'TypeScript', 'Node.js', 'MySQL'],
 *   client: 'Client name (only with permission) or "Internal project"',
 *   url: 'https://example.com',                 // optional live link
 *   image: '/images/projects/inventory.webp',   // optional; put the file in public/images/projects/
 *   imageAlt: 'Inventory dashboard showing stock levels by warehouse',
 * },
 */

export const projectCategories = [
  'Website',
  'Web Application',
  'Custom Software',
  'AI & Automation',
  'Product',
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  summary: string;
  description: string[];
  technologies: string[];
  client?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [];
