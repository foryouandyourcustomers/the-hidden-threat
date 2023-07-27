<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { z, AnyZodObject } from 'zod'
  import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'

  // eslint-disable-next-line no-undef
  type T = $$Generic<AnyZodObject>

  export let form: SuperForm<ZodValidation<T>, unknown>
  export let field: FormPathLeaves<z.infer<T>>

  const { value, errors } = formFieldProxy(form, field)

  $: boolValue = value as Writable<boolean>
</script>

<label>
  <input type="checkbox" name={field} value="true" bind:checked={$boolValue} {...$$restProps} />
  <span class="display-name"><slot /></span>
</label>
{#if $errors}<span class="invalid">{$errors}</span>{/if}

<style lang="postcss">
  label {
    display: block;
    margin-block: 0.5rem;
  }
  .invalid {
    color: indianred;
  }
</style>
