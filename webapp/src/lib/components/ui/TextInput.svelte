<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms'

  export let value: string | undefined
  export let label: string | undefined = undefined
  export let errors: string[] | undefined = undefined
  export let constraints: InputConstraint | undefined = undefined
</script>

<label>
  {#if label}<span class="display-name">{label}</span>{/if}
  <input type="text" bind:value {...constraints} {...$$restProps} />
</label>
{#if errors}<span class="invalid">{errors}</span>{/if}

<style lang="postcss">
  label {
    display: block;
    margin-block: var(--size-2);
  }
  input {
    display: block;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    padding-inline: var(--size-3);
    width: 100%;
    min-width: var(--size-72);
    height: var(--size-10);
  }

  .invalid {
    color: indianred;
  }
</style>
