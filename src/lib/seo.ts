export const SITE_URL = 'https://www.webgrouth.com';

export const canonicalUrl = (path: string) => {
  const url = new URL(path, SITE_URL);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  return `${SITE_URL}${pathname}`;
};

export const jsonLd = (value: unknown) => JSON.stringify(value)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');

export const breadcrumb = (path: string, name: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name, item: canonicalUrl(path) },
  ],
});
