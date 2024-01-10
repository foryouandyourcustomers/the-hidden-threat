import type { Seo } from '$lib/components/Seo.svelte'

export const load = async () => ({
  seo: { title: 'Nutzungsbedingungen' } satisfies Seo,
})
