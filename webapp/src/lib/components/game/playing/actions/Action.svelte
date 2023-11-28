<script lang="ts">
  import ArrowRight from '~icons/lucide/arrow-right'
  export let disabled = false
  export let title = ''
</script>

<button class="unstyled" {disabled} on:click>
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="content">
    <slot />
    <div class="arrow">
      <ArrowRight />
    </div>
  </div>
</button>

<style lang="postcss">
  .title {
    display: block;
    width: 100%;
    font-size: var(--scale-0000);
    text-align: left;
    white-space: nowrap;
  }
  button {
    display: block;
    padding: 0.5rem 1rem;
    width: 100%;
    text-align: left;
    white-space: nowrap;
    &:has(.title) {
      border-top: var(--px) solid #eee;
    }
    .arrow {
      translate: -0.5rem 0;
      opacity: 0;
      transition: all 200ms ease-out;
      :global(svg) {
        display: block;
      }
    }
    &:hover {
      background: #d5d9e34d;
      &:not([disabled]) .arrow {
        translate: 0 0;
        opacity: 1;
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
