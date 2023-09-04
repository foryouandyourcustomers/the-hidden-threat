<script lang="ts">
  import CloseIcon from '~icons/lucide/x-circle'
  let expanded = false
</script>

<div class="expandable" class:expanded>
  <button class="unstyled icon" on:click={() => (expanded = true)}><slot name="icon" /></button>
  <div class="content">
    <slot name="content" />
    <button class="unstyled icon" on:click={() => (expanded = false)}><CloseIcon /></button>
  </div>
</div>

<style lang="postcss">
  .expandable {
    position: relative;
    color: black;
    .icon {
      display: grid;
      place-content: center;
      border-radius: var(--radius-full);
      background: white;
      width: 1.5rem;
      height: 1.5rem;
      :global(svg) {
        display: block;
        width: 1rem;
        height: 1rem;
      }
    }
    &.expanded {
      .content {
        display: block;
      }
    }
    .content {
      --_padding: 0.25rem;
      display: none;
      position: absolute;
      top: calc(0px - var(--_padding));
      right: calc(0px - var(--_padding));
      border-radius: var(--radius-full);
      background: white;
      padding: var(--_padding);
      height: calc(1.5rem + var(--_padding) * 2);
    }
  }
</style>
