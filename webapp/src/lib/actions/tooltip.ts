import Tooltip from '$lib/components/ui/TooltipFromAction.svelte'
import type { Action } from 'svelte/action'

export const tooltip: Action<HTMLElement, string> = (element, title) => {
  let tooltipComponent: Tooltip | undefined

  function mouseOver(event: MouseEvent) {
    tooltipComponent =
      tooltipComponent ??
      new Tooltip({
        props: {
          title: title ?? '',
          x: event.pageX,
          y: event.pageY,
        },
        target: document.body,
      })
  }
  function mouseMove(event: MouseEvent) {
    tooltipComponent?.$set({
      x: event.pageX,
      y: event.pageY,
    })
  }
  function mouseLeave() {
    tooltipComponent?.$destroy()
    tooltipComponent = undefined
  }

  let didSetup = false
  const setup = () => {
    if (didSetup) return
    didSetup = true
    element.addEventListener('mouseover', mouseOver)
    element.addEventListener('mouseleave', mouseLeave)
    element.addEventListener('mousemove', mouseMove)
  }
  const tearDown = () => {
    didSetup = false
    tooltipComponent?.$destroy()
    element.removeEventListener('mouseover', mouseOver)
    element.removeEventListener('mouseleave', mouseLeave)
    element.removeEventListener('mousemove', mouseMove)
  }

  if (title) setup()

  return {
    destroy() {
      tearDown()
    },
    update(newTitle) {
      title = newTitle
      if (title) {
        setup()
      } else {
        tearDown()
      }
    },
  }
}
