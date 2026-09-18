import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://www.webgrouth.com',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
});
