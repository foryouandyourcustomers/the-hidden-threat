<script context="module" lang="ts">
  export type Seo = { title: string; description?: string }
</script>

<script lang="ts">
  import { page } from '$app/stores'

  $: seo = $page.data.seo as Seo | undefined
  $: title = seo?.title
</script>

<svelte:head>
  <title>UniBW - {title ?? 'Serious Game'}</title>
  <meta name="description" content="This is a serious game" />
</svelte:head>
