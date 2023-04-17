import type { Seo } from '$lib/components/Seo.svelte'

export const prerender = true

export const load = async ({ data }) => {
  return {
    helpers: ['a', 'b', 'c'],
    website: data.website,
    seo: { title: 'help' } satisfies Seo,
  }
}
