<script lang="ts">
  export let disabled = false
</script>

<button {disabled} class="unstyled" on:click>
  {#if $$slots.icon}
    <div class="icons">
      <slot name="icon" />
    </div>
  {/if}

  <slot />
</button>

<style lang="postcss">
  button {
    text-wrap: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline: 0.75rem;
    width: 100%;
    height: 1.75rem;
    font-size: var(--scale-000);
    &:hover {
      background: #d5d9e34d;
      font-weight: 700;
    }
    .icons {
      flex-shrink: 0;
      :global(svg) {
        display: block;
      }
    }
  }
</style>
