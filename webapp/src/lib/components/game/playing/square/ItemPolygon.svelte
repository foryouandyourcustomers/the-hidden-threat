<script lang="ts">
  import type { Side } from '$lib/game/types'

  export let side: Side
</script>

{#if side === 'attack'}
  <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.3571 26L6.61664 0L4.64282 26H21.3571Z" fill="#51514F" />
    <path d="M21.357 10.7388L6.61658 0L21.357 26V10.7388Z" fill="#292521" />
  </svg>
{:else}
  <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.9792 26L17.8865 17.8076L5 0L6.9792 26Z" fill="#9C9A9F" />
    <path d="M17.8741 17.814L22 2.25865L5 0L17.8741 17.814Z" fill="#7D797D" />
  </svg>
{/if}

<style lang="postcss">
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
