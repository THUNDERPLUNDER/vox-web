// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const { STORYBLOK_DELIVERY_API_TOKEN = '' } = env;

const storyblokIntegration =
  STORYBLOK_DELIVERY_API_TOKEN.trim() !== ''
    ? storyblok({
        accessToken: STORYBLOK_DELIVERY_API_TOKEN,
        apiOptions: { region: 'eu' },
        bridge: false,
        livePreview: false,
      })
    : null;

// https://astro.build/config
export default defineConfig({
  site: 'https://thunderplunder.github.io',
  base: '/',

  integrations: [...(storyblokIntegration ? [storyblokIntegration] : [])],

  vite: {
    plugins: [tailwindcss()],
  },
});
