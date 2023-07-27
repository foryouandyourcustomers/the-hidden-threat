<script lang="ts" context="module">
  export const BUTTON_SIZES = ['default', 'big', 'small'] as const
  export type ButtonSize = (typeof BUTTON_SIZES)[number]
</script>

<script lang="ts">
  export let size: ButtonSize = 'default'
  export let disabled = false
  export let disabledReason: string | undefined = undefined
  export let primary = false
  export let href: string | undefined = undefined
  export let title: string | undefined = undefined
  export let target: string | undefined = undefined
  export let type: 'button' | 'submit' | 'reset' | undefined = undefined
  export let tabIndex = 0
</script>

<!--
  It's fine to ignore this warning, because we render either <a> or <button> tag
-->
<svelte:element
  this={href ? 'a' : 'button'}
  role="button"
  tabindex={tabIndex}
  on:click
  class={`button ${size}`}
  class:primary
  title={disabled && disabledReason ? disabledReason : title}
  {type}
  {target}
  {href}
  disabled={disabled ? true : undefined}><slot>Press me</slot></svelte:element
>

<!-- class={`button ${size} ${accent ? 'accent' : ''}`} -->
<style lang="postcss">
  .button {
    --_padding-inline: 1.5rem;
    --_scale: var(--scale-2);
    --_color-text: var(--color-text);
    --_color-bg: transparent;
    --_color-bg-hover: var(--color-bg-hover);
    --_color-border: var(--color-border);
    --_radius: var(--radius-full);
    --_height: 3rem;

    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    border: 0.125rem solid var(--_color-border);
    border-radius: var(--_radius);
    background-color: var(--_color-bg);
    padding-inline: var(--_padding-inline);
    height: var(--_height);
    color: var(--_color-text);
    font-weight: var(--weight-semibold);
    font-size: var(--_scale);
    font-family: BarlowCondensed, sans-serif;
    text-decoration: none;
    text-transform: uppercase;
    white-space: nowrap;

    &:hover {
      box-shadow: 0 0 6px var(--color-shadow);
      background-color: var(--_color-bg-hover);
    }

    &.primary {
      --_color-bg: var(--color-bg-contrast);
      --_color-bg-hover: var(--color-bg-contrast);
      --_color-text: var(--color-text-oncontrast);
    }

    &.big {
      --_height: 3rem;
      --_padding-inline: 1.5rem;
    }
    &.small {
      --_height: 2.5rem;
      --_padding-inline: 1.5rem;
    }

    &[disabled] {
      --_color-text: var(--color-grey-300);
      --_color-bg: var(--color-grey-500);
      cursor: not-allowed;
      &.accent {
        --_color-text: var(--color-grey-400);
        --_color-bg: var(--color-grey-600);
      }
    }
  }
</style>
