<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  export let id: string | undefined = undefined
  export let separator = false
  export let centered = false
  export let tag: 'h1' | 'h2' | 'h3' | 'h4' | undefined = undefined

  const defaultSizeTags: { [key in typeof size]: typeof tag } = {
    xl: 'h1',
    lg: 'h2',
    md: 'h3',
    sm: 'h4',
  }

  if (!tag) tag = defaultSizeTags[size]
</script>

<div class="heading size-{size}" class:separator class:centered>
  <svelte:element this={tag} {id} class="h">
    <slot />
  </svelte:element>

  {#if $$slots.info}
    <div class="info">
      <slot name="info" />
    </div>
  {/if}
</div>

<style lang="postcss">
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 0;
    margin-bottom: 1.25rem;
    &.separator {
      border-bottom: var(--px) solid var(--color-border);
      padding-bottom: 0.75rem;
    }
    &.centered {
      justify-content: center;
    }
    .h {
      font-weight: 500;
      font-family: var(--font-display);
      text-transform: uppercase;
    }
    &.size-md {
      .h {
        font-size: 2.25rem;
      }
    }
    &.size-sm {
      .h {
        font-size: 1.5rem;
      }
    }
    .info {
      font-size: var(--scale-00);
    }
  }
</style>
