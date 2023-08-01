import Tooltip from '$lib/components/ui/TooltipFromAction.svelte'
export function tooltip(element: HTMLElement) {
  const title = element.getAttribute('title')
  if (!title)
    return {
      destroy() {
        // Nothing todo without a title
      },
    }
  let tooltipComponent: Tooltip | undefined

  function mouseOver(event: MouseEvent) {
    // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
    // remember to set it back on `mouseleave`
    element.removeAttribute('title')

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
    // NOTE: restore the `title` attribute
    element.setAttribute('title', title ?? '')
  }

  element.addEventListener('mouseover', mouseOver)
  element.addEventListener('mouseleave', mouseLeave)
  element.addEventListener('mousemove', mouseMove)

  return {
    destroy() {
      tooltipComponent?.$destroy()
      element.removeEventListener('mouseover', mouseOver)
      element.removeEventListener('mouseleave', mouseLeave)
      element.removeEventListener('mousemove', mouseMove)
    },
  }
}
