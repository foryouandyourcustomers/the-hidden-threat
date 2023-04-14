import type { Seo } from '$lib/Seo.svelte'

export const prerender = true

export const load = async () => {
  return {
    seo: { title: 'contact' } satisfies Seo,
  }
}
