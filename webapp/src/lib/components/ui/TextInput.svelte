<script lang="ts">
  import type { z, AnyZodObject } from 'zod'
  import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'

  // eslint-disable-next-line no-undef
  type T = $$Generic<AnyZodObject>

  export let form: SuperForm<ZodValidation<T>, unknown>
  export let field: FormPathLeaves<z.infer<T>>

  const { value, errors, constraints } = formFieldProxy(form, field)
</script>

<label>
  <span class="display-name"><slot /></span>
  <input
    name={field}
    type="text"
    aria-invalid={$errors ? 'true' : undefined}
    bind:value={$value}
    {...$constraints}
    {...$$restProps}
  />
</label>

{#if $errors}<span class="invalid">{$errors}</span>{/if}

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
