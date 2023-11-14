import type { Action } from 'svelte/action'

/**
 * An action that triggers the `outclick` event when the user clicks outside of
 * the element.
 *
 * Usage:
 *
 *     <div use:clickOutside on:outclick={...}>
 */
export const clickOutside: Action = (node) => {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as HTMLElement)) {
      node.dispatchEvent(new CustomEvent('outclick'))
    }
  }

  document.addEventListener('click', handleClick, true)

  return {
    destroy: () => document.removeEventListener('click', handleClick, true),
  }
}
