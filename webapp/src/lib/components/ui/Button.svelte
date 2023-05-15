<script lang="ts" context="module">
  export const BUTTON_SIZES = ['default', 'big', 'small'] as const
  export type ButtonSize = (typeof BUTTON_SIZES)[number]
</script>

<script lang="ts">
  export let size: ButtonSize = 'default'
  export let disabled = false
  export let accent = false
  export let href: string | undefined = undefined
  export let title: string | undefined = undefined
  export let target: string | undefined = undefined
  export let type: 'button' | 'submit' | 'reset' | undefined = undefined
</script>

<!--
  It's fine to ignore this warning, because we render either <a> or <button> tag
-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={href ? 'a' : 'button'}
  on:click
  class={`button ${size}`}
  class:accent
  {type}
  {target}
  {title}
  {href}
  disabled={disabled ? true : undefined}><slot>Press me</slot></svelte:element
>

<!-- class={`button ${size} ${accent ? 'accent' : ''}`} -->
<style lang="postcss">
  .button {
    --_padding-inline: var(--size-4);
    --_scale: var(--scale-0);
    --_color-text: var(--color-grey-900);
    --_color-background: var(--color-grey-100);
    --_color-hover-background: var(--color-grey-200);
    --_radius: var(--radius-sm);
    --_height: var(--size-10);

    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    border: none;
    border-radius: var(--_radius);
    background-color: var(--_color-background);
    padding-inline: var(--_padding-inline);
    height: var(--_height);
    color: var(--_color-text);
    font-weight: var(--weight-semibold);
    font-size: var(--_scale);
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      background-color: var(--_color-hover-background);
    }

    &.accent {
      --_color-background: var(--color-blue-700);
      --_color-hover-background: var(--color-blue-500);
      --_color-text: white;
    }

    &.big {
      --_height: var(--size-12);
      --_padding-inline: var(--size-6);
    }
    &.small {
      --_height: var(--size-8);
      --_padding-inline: var(--size-3);
    }

    &[disabled] {
      --_color-text: var(--color-grey-300);
      --_color-background: var(--color-grey-500);
      cursor: not-allowed;
      &.accent {
        --_color-text: var(--color-grey-400);
        --_color-background: var(--color-grey-600);
      }
    }
  }
</style>
