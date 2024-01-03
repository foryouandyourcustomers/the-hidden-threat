<script>
  import Face from '$lib/components/icons/Face.svelte'
  import CloseIcon from '~icons/lucide/x'

  const close = () => {
    if (window.confirm('Möchtest du wirklich das Spiel verlassen?')) window.location.href = '/'
  }
</script>

<div class="faces">
  <Face faceId={3} />
  <Face faceId={2} />
  <Face faceId={6} />
  <Face faceId={5} />
</div>
<a href="/" on:click|preventDefault={close} class="close unstyled">
  <CloseIcon />
</a>

<style lang="postcss">
  .faces {
    display: flex;
    grid-area: jokers;
    gap: 0.5rem;
    :global(svg) {
      width: 2rem;
      height: 2rem;
    }
  }

  .close {
    position: relative;
    grid-area: options;
    :global(svg) {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
