<script context="module" lang="ts">
  export type Seo = { title: string; description?: string }
</script>

<script lang="ts">
  import { page } from '$app/stores'

  $: seo = $page.data.seo as Seo | undefined
  $: title = seo?.title
</script>

<svelte:head>
  <title>The Hidden Threat {title ? ` - ${title}` : ''}</title>
  <meta name="description" content="Die digitale Variante zum Tabletop" />
</svelte:head>
