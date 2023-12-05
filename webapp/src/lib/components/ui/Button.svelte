<script lang="ts" context="module">
  export const BUTTON_SIZES = ['default', 'big', 'small'] as const
  export type ButtonSize = (typeof BUTTON_SIZES)[number]
</script>

<script lang="ts">
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  export let size: ButtonSize = 'default'
  export let disabled = false
  export let disabledReason: string | undefined = undefined
  export let primary = false
  export let inverse = false
  export let href: string | undefined = undefined
  export let title: string | undefined = undefined
  export let target: string | undefined = undefined
  export let type: 'button' | 'submit' | 'reset' | undefined = undefined
  export let tabIndex = 0

  $: tooltipText = disabled && disabledReason ? disabledReason : title
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
  class:inverse
  {type}
  {target}
  {href}
  disabled={disabled ? true : undefined}
  ><slot>Press me</slot>

  {#if tooltipText}
    <Tooltip position="left">{tooltipText}</Tooltip>
  {/if}
</svelte:element>

<!-- class={`button ${size} ${accent ? 'accent' : ''}`} -->
<style lang="postcss">
  .button {
    --_padding-inline: 1.5rem;
    --_scale: var(--scale-2);
    --_color-text: var(--color-text);
    --_color-bg: transparent;
    --_color-bg-hover: var(--color-blue-transparent);
    --_color-border: var(--color-border);
    --_radius: var(--radius-full);
    --_height: 3rem;

    display: inline-flex;
    position: relative;
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

    &:hover:not([disabled]) {
      box-shadow: 0 0 6px var(--color-shadow);
      background-color: var(--_color-bg-hover);
    }

    &.primary {
      --_color-bg: var(--color-bg-strong);
      --_color-bg-hover: var(--color-bg-strong);
      --_color-text: var(--color-text-onstrong);
      --_color-border: transparent;
    }

    &.inverse {
      --_color-bg: var(--color-bg);
      --_color-bg-hover: var(--color-bg-secondary);
      --_color-text: var(--color-text);
      --_color-border: transparent;
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
      --_color-text: var(--color-text-disabled);
      cursor: not-allowed;
      /* --_color-border: var(--color-border-disabled); */
      background: color-mix(in oklab, var(--_color-bg), transparent 60%);
      &.inverse {
        --_color-text: var(--color-text-disabled-inverse);
        opacity: 0.6;
        background: var(--color-grey-light);
      }
      &.primary {
        --_color-text: var(--color-text-disabled-onstrong);
        --_color-bg: var(--color-bg-disabled-strong);
        --_color-border: transparent;
      }
    }

    &:focus-visible {
      outline: 3px solid #fff8;
    }
  }
</style>
