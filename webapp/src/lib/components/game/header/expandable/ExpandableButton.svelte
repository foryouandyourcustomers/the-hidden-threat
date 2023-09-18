<script lang="ts">
  export let disabled = false
</script>

<button {disabled} class="unstyled" on:click>
  <slot />

  {#if $$slots.icon}
    <div class="icons">
      <slot name="icon" />
    </div>
  {/if}
</button>

<style lang="postcss">
  button {
    text-wrap: nowrap;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-inline: 1rem;
    width: 100%;
    height: 1.375rem;
    &:hover {
      background: #d5d9e34d;
    }
    .icons {
      flex-shrink: 0;
      :global(svg) {
        display: block;
      }
    }
  }
</style>
