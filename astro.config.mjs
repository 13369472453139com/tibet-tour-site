import { defineConfig } from "astro/config";
import mdx from '@astrojs/mdx';
import icon from "astro-icon";

export default defineConfig({
  site: 'https://tibet-tour.pages.dev',
  output: 'static',
  integrations: [icon(), mdx()],
});