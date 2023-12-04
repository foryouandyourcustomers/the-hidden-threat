<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let group: any | undefined = undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let value: any

  $: checked = value == group

  export let disabled = false
</script>

<label class="radio-container" class:with-title={$$slots.title} class:disabled>
  <input type="radio" bind:group {value} {checked} {disabled} {...$$restProps} on:select />
  {#if $$slots.title}
    <div class="title"><slot name="title" /></div>
  {/if}
  <div class="content">
    <slot />
  </div>
</label>

<style lang="postcss">
  .radio-container {
    display: flex;
    position: relative;
    gap: 0.5rem;
    cursor: pointer;
    border-radius: var(--radius-sm);
    background: var(--color-white-80);
    background: color-mix(in oklab, var(--color-white-80), transparent 60%);
    padding: 0.5rem;
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .content {
      flex: 1;
      border-radius: var(--radius-xs);
      background-color: var(--color-bg-strong);
      padding: 0.25rem;
    }
    &:not(.with-title) {
      input {
        margin-top: 0.75rem;
      }
    }
    .title {
      margin-right: 1.5rem;
    }
    &.with-title {
      flex-direction: column;
      input {
        position: absolute;
        top: 0.7rem;
        right: 0.5rem;
      }
    }
  }
  input {
    --_border-width: 0.0875rem;
    --_size: 1rem;
    --_checked-size: 0.5rem;

    position: relative;
    appearance: none;
    margin: 0;
    outline: none;
    border: var(--_border-width) solid var(--color-blue-spielbrett);
    border-radius: var(--radius-full);
    background-color: white;
    inline-size: var(--_size);
    block-size: var(--_size);

    &:checked {
      --_border-width: 0.125rem;
      &::before {
        display: block;
        position: absolute;

        top: calc((var(--_size) - var(--_border-width) * 2 - var(--_checked-size)) / 2);
        left: calc((var(--_size) - var(--_border-width) * 2 - var(--_checked-size)) / 2);
        border-radius: var(--radius-full);
        background: var(--color-blue-spielbrett);
        inline-size: var(--_checked-size);
        block-size: var(--_checked-size);
        content: '';
      }
    }
  }
</style>
