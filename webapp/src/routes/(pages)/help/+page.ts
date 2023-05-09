import type { Seo } from '$lib/components/Seo.svelte'

export const prerender = true

export const load = () => {
  return {
    seo: { title: 'Help' } satisfies Seo,
  }
}
