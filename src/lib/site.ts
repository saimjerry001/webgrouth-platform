export const SITE = {
  name: 'Web Grouth',
  url: 'https://webgrouth.com',
  email: 'hello@webgrouth.com',
  defaultTitle: 'Web Grouth | Guest Posting, Backlinks & SEO',
  defaultDescription:
    'Web Grouth helps businesses grow Google visibility and authority through high-quality guest posting, backlinks, link building, content, and digital PR.',
  twitter: '',
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/guest-posting', label: 'Guest Posting' },
  { href: '/seo-services', label: 'SEO Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const CATEGORIES = [
  'SEO',
  'Guest Posting',
  'Link Building',
  'Content Marketing',
  'Digital PR',
] as const;

export const NICHES = [
  'SaaS',
  'Finance',
  'Health',
  'Technology',
  'Marketing',
  'Ecommerce',
  'Legal',
  'Travel',
  'Education',
  'Home & Lifestyle',
] as const;
