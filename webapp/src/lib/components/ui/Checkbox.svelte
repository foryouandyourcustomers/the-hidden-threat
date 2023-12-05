<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { z, AnyZodObject } from 'zod'
  import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms'
  import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
  import CheckMark from '~icons/lucide/check'

  // eslint-disable-next-line no-undef
  type T = $$Generic<AnyZodObject>

  export let form: SuperForm<ZodValidation<T>, unknown>
  export let field: FormPathLeaves<z.infer<T>>

  const { value, errors } = formFieldProxy(form, field)

  $: boolValue = value as Writable<boolean>
</script>

<label>
  <div class="checkbox">
    <input type="checkbox" name={field} value="true" bind:checked={$boolValue} {...$$restProps} />
    <div class="symbol">
      <CheckMark />
    </div>
  </div>
  <span class="display-name"><slot /></span>
</label>
{#if $errors}<span class="invalid">{$errors}</span>{/if}

<style lang="postcss">
  label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    margin-block: 0.5rem;
  }
  .checkbox {
    .symbol {
      display: grid;
      position: relative;
      place-content: center;
      margin-top: 0.22rem;
      border: 1px solid white;
      border-radius: var(--radius-xs);
      width: 1.25rem;
      height: 1.25rem;
      :global(svg) {
        display: block;
        opacity: 0;
        transition: all 0.1s ease-in-out;
        width: 1rem;
      }
    }
    input {
      position: absolute;
      left: -9999px;
      opacity: 0;
      &:focus-visible + .symbol {
        outline: 2px solid white;
      }
      &:checked + .symbol {
        :global(svg) {
          opacity: 1;
        }
      }
    }
  }
  .invalid {
    color: indianred;
  }
</style>
