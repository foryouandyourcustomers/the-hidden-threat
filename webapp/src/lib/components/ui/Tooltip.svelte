<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import CloseIcon from '~icons/lucide/x'

  export let position: 'top' | 'right' | 'bottom' | 'left' = 'bottom'

  /** Whether the tooltip should be shown on click or hover */
  export let click = false

  export let showOnCreate = false

  let visible = showOnCreate

  let timeout: number | undefined

  const onMouseEnter = () => {
    if (!click) {
      window.clearTimeout(timeout)
      visible = true
    }
  }
  const onMouseLeave = () => {
    if (!click) {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => (visible = false), 200)
    }
  }
  const onClick = () => {
    if (click && !visible) {
      visible = true
    }
  }

  let tooltipElement: HTMLDivElement

  const onOutsideClick = () => {
    if (click) visible = false
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (click && visible && event.key === 'Escape') {
      visible = false
    }
  }
  const onDocumentClick = (event: MouseEvent) => {
    const parent = tooltipElement.parentElement
    if (!parent) return

    if (
      !parent.contains(event.target as HTMLElement) &&
      !tooltipElement.contains(event.target as HTMLElement)
    ) {
      onOutsideClick()
    }
  }

  $: if (visible && click) {
    document.addEventListener('click', onDocumentClick, true)
    document.addEventListener('keydown', onKeyDown, true)
  } else if (click) {
    document.removeEventListener('click', onDocumentClick, true)
    document.removeEventListener('keydown', onKeyDown, true)
  }

  onMount(() => {
    const parent = tooltipElement.parentElement

    parent?.addEventListener('click', onClick)
    parent?.addEventListener('mouseenter', onMouseEnter)
    parent?.addEventListener('mouseleave', onMouseLeave)

    return () => {
      parent?.removeEventListener('click', onClick)
      parent?.removeEventListener('mouseenter', onMouseEnter)
      parent?.removeEventListener('mouseleave', onMouseLeave)
    }
  })

  onDestroy(() => {
    document.removeEventListener('click', onDocumentClick, true)
    document.removeEventListener('keydown', onKeyDown, true)
  })
</script>

<div
  role="dialog"
  class="tooltip {position}"
  class:visible
  bind:this={tooltipElement}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <button
    class="unstyled close"
    on:click={(e) => {
      e.preventDefault()
      e.stopPropagation()
      visible = false
    }}
  >
    <CloseIcon />
  </button>
  <slot />

  <svg class="arrow" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 0H0L5.3 8.3C5.47937 8.58942 5.72965 8.82826 6.02715 8.99388C6.32465 9.1595 6.65951 9.24643 7 9.24643C7.34049 9.24643 7.67535 9.1595 7.97285 8.99388C8.27035 8.82826 8.52063 8.58942 8.7 8.3L14 0Z"
      fill="white"
    />
  </svg>
</div>

<style lang="postcss">
  .tooltip {
    --_offset: calc(100% + 1rem);
    position: absolute;
    scale: 0.9;
    opacity: 0;
    z-index: var(--layer-top);
    transition: all 0.1s ease-in-out;
    cursor: initial;
    box-shadow: 0px 0px 10px 0px rgba(38, 45, 46, 0.25);
    border-radius: var(--radius-sm);
    background: white;
    padding: 0.75rem;
    width: max-content;
    max-width: 30ch;
    pointer-events: none;
    color: black;
    font: var(--text-regular);
    font-size: var(--scale-00);
    text-transform: none;
    white-space: initial;
    &.visible {
      scale: 1;
      opacity: 1;
      pointer-events: unset;
    }
    &.left,
    &.right {
      top: 50%;
      transform: translateY(-50%);
    }
    &.top,
    &.bottom {
      left: 50%;
      transform: translateX(-50%);
    }
    &.left {
      right: var(--_offset);
    }
    &.right {
      left: var(--_offset);
    }
    &.top {
      bottom: var(--_offset);
    }
    &.bottom {
      top: var(--_offset);
    }
  }

  .arrow {
    --_size: 0.875rem;
    --_offset: -0.85rem;
    display: block;
    position: absolute;
    width: var(--_size);
    height: var(--_size);

    .tooltip.left &,
    .tooltip.right & {
      top: 50%;
      translate: 0 -50%;
    }
    .tooltip.top &,
    .tooltip.bottom & {
      left: 50%;
      translate: -50% 0;
    }

    .tooltip.left & {
      right: var(--_offset);
      rotate: -0.25turn;
    }
    .tooltip.bottom & {
      top: var(--_offset);
      rotate: 0.5turn;
    }
    .tooltip.right & {
      left: var(--_offset);
      rotate: 0.25turn;
    }
    .tooltip.top & {
      bottom: var(--_offset);
    }
  }

  .close {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    padding: 0rem;
    width: 1.25rem;
    height: 1.25rem;
    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
