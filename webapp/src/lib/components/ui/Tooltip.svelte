<script lang="ts">
  import { tooltip } from '$lib/actions/tooltip'

  export let title: string | undefined
</script>

{#if title}
  <div use:tooltip={title}>
    <slot />
  </div>
{:else}
  <slot />
{/if}

<style lang="postcss">
  div {
    display: inline-block;
  }
</style>
