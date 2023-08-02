import type { Seo } from '$lib/components/Seo.svelte'

export const prerender = true

export const load = async () => {
  return {
    seo: { title: 'Contact' } satisfies Seo,
  }
}
