<script lang="ts">
  export let title: string
  export let subtitle: string
  export let downloadLink: string
</script>

<div class="card">
  <header>
    <h2>{title}</h2>
  </header>

  <div class="content">
    <h3>{subtitle}</h3>

    <p>
      <slot />
    </p>

    <a href={downloadLink}>Download starten</a>
  </div>
</div>

<style lang="postcss">
  .card {
    box-shadow: 0 0 1.75rem #1c252677;
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    overflow: hidden;
    & header {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      background-color: var(--color-bg);
      background: var(--background-image) no-repeat center;
      background-size: cover;
      height: 9rem;
    }
    .content {
      padding: 1rem;
    }
    & h2 {
      border-top-right-radius: var(--radius-md);
      background: var(--color-bg-secondary);
      padding: 0.5rem 1rem;
      font: var(--display-h3);
      text-transform: uppercase;
    }
    & h3 {
      font: var(--display-h5);
    }
    & p {
      font: var(--text-regular);
    }
  }
</style>
