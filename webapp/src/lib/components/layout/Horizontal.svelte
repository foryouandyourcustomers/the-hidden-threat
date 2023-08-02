<script lang="ts">
  export let partition: '1-1' | '1-2' | '2-1' = '1-1'
</script>

<div class="horizontal partition-{partition}">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style lang="postcss">
  .horizontal {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    & .left,
    & .right {
      position: relative;
    }

    @media screen and (min-width: 800px) {
      grid-template-rows: 1fr;

      & .left,
      & .left {
        display: block;
        min-width: 0;
      }

      &.partition-1-1 {
        grid-template-columns: 1fr 1fr;
      }
      &.partition-1-2 {
        grid-template-columns: 1fr 2fr;
      }
      &.partition-2-1 {
        grid-template-columns: 2fr 1fr;
      }
    }
  }
</style>
