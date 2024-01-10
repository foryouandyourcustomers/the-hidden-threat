import type { Seo } from '$lib/components/Seo.svelte'

export const load = async () => ({
  seo: { title: 'Impressum' } satisfies Seo,
})
