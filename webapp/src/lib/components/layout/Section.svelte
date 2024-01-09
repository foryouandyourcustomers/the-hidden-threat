<script lang="ts">
  export let width: 'sm' | 'md' | 'lg' = 'md'
  export let bg: 'none' | 'light' | 'fade' = 'none'
  export let bgFill: 'content' | 'full' = 'full'
</script>

<section class="width-{width} bg-{bg} bg-fill-{bgFill}">
  <div class="wrapper">
    <slot />
  </div>
</section>

<style lang="postcss">
  section {
    --_width: 100%;
    --_bg: transparent;
    isolation: isolate;

    &.bg-light {
      --_bg: var(--color-bg-secondary);
      margin-inline: var(--size-content-px);
    }
    &.bg-fade {
      --_bg: linear-gradient(to bottom, transparent 50%, #232c41);
    }

    &.bg-fill-full {
      background: var(--_bg);
    }
    &.bg-fill-content {
      .wrapper {
        background: var(--_bg);
      }
    }

    .wrapper {
      position: relative;
      margin-inline: auto;
      border-radius: var(--radius-md);
      isolation: isolate;
      padding: 5rem var(--size-content-px);
      max-width: calc(var(--_width) + 2 * var(--size-content-px));
    }
  }
  .width-sm {
    --_width: var(--width-md);
  }
  .width-md {
    --_width: var(--width-lg);
  }
  .width-lg {
    --_width: 100%;
  }
</style>
