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
    --_width: var(--width-content-max);
    --_bg: transparent;

    &.bg-light {
      --_bg: var(--color-bg-secondary);
    }
    &.bg-fade {
      --_bg: linear-gradient(to bottom, transparent, #232c41);
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
      padding: 5rem 1rem;
      max-width: var(--_width);
    }
  }
  .width-sm {
    --_width: var(--width-md);
    --_padding-x: max(var(--size-default-px), (100vw - var(--width-md)) / 2);
  }
  .width-md {
    --_width: var(--width-lg);
    --_padding-x: max(var(--size-default-px), (100vw - var(--width-lg)) / 2);
  }
  .width-lg {
    --_width: var(--width-content-max);
  }
</style>
