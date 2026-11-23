import { absoluteUrl, site } from '../config/site';
import type { RouteMeta } from '../data/routes';

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Organization data limited to verified facts: name, URL, logo, email, founder, area served. */
export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      alternateName: site.brand,
      url: `${site.url}/`,
      logo: absoluteUrl('/logo-512.png'),
      email: site.email,
      description: site.description,
      founder: { '@type': 'Person', name: site.founder.name, jobTitle: site.founder.role },
      areaServed: ['Puducherry', 'Tamil Nadu', 'India', 'Worldwide'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: site.email,
        telephone: `+${site.whatsapp.number}`,
      },
      ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en-IN',
    },
  ],
});

/** Builds the per-page <head> tags used by the static pre-renderer. */
export const buildHead = (meta: RouteMeta) => {
  const canonical = meta.index ? absoluteUrl(meta.path) : undefined;
  const ogImage = absoluteUrl('/og-image.png');
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.index ? '<meta name="robots" content="index, follow" />' : '<meta name="robots" content="noindex" />',
    canonical ? `<link rel="canonical" href="${esc(canonical)}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}" />` : '',
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="PYMLABS — Building Technology. Creating Possibilities." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
  ];
  if (meta.path === '/') {
    // JSON.stringify output is safe inside <script> once "<" is escaped.
    const json = JSON.stringify(organizationJsonLd()).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.filter(Boolean).join('\n    ');
};
