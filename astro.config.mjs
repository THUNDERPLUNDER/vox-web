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

// GitHub Pages project sites are served under https://<user>.github.io/<repo>/ — without this,
// hardcoded paths like /vis/ resolve to the domain root and 404. CI sets GITHUB_REPOSITORY=owner/repo.
const ghRepo =
  typeof process.env.GITHUB_REPOSITORY === 'string'
    ? process.env.GITHUB_REPOSITORY.split('/')[1]
    : '';
const base = ghRepo ? `/${ghRepo}/` : '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://thunderplunder.github.io',
  base,

  integrations: [...(storyblokIntegration ? [storyblokIntegration] : [])],

  vite: {
    plugins: [tailwindcss()],
  },
});
