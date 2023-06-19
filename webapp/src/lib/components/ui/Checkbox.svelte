<script lang="ts">
  export let value: string | undefined
  export let checked: boolean | undefined
  export let errors: string[] | undefined = undefined
</script>

<label>
  <input type="checkbox" {value} bind:checked {...$$restProps} />
  <span class="display-name"><slot /></span>
</label>
{#if errors}<span class="invalid">{errors}</span>{/if}

<style lang="postcss">
  label {
    display: block;
    margin-block: var(--size-2);
  }
  .invalid {
    color: indianred;
  }
</style>
