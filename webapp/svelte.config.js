import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import slug from 'rehype-slug'
import toc from '@jsdevtools/rehype-toc'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      rehypePlugins: [slug, toc],
    }),
  ],

  extensions: ['.svelte', '.svx', '.md'],

  kit: {
    adapter: adapter(),
  },
}

export default config
