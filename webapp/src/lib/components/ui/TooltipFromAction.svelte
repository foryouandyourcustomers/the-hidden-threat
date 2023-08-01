<script lang="ts">
  export let title: string
  export let x: number
  export let y: number
</script>

<div
  style="
		top: {y + 5}px;
		left: {x + 5}px;"
>
  {title}
</div>

<style lang="postcss">
  div {
    position: absolute;
    border-radius: 0.25rem;
    background: #34446a;
    padding: 0.5rem;
    color: white;
  }
</style>
