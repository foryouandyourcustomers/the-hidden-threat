import type { Seo } from '$lib/components/Seo.svelte'

export const load = async () => ({
  seo: { title: 'Datenschutzerklärung' } satisfies Seo,
})
