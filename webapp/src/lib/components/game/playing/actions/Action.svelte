<script lang="ts">
  export let disabled = false
</script>

<button class="unstyled" {disabled} on:click>
  <slot />
</button>

<style lang="postcss">
  button {
    display: block;
    padding: 0.5rem 1rem;
    width: 100%;
    text-align: left;
    white-space: nowrap;
    &:hover {
      background: #d5d9e34d;
    }
  }
</style>
