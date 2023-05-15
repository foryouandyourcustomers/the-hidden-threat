<script>
  import CenteredContent from '$lib/components/layout/CenteredContent.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import TextInput from '$lib/components/ui/TextInput.svelte'
  import { superForm } from 'sveltekit-superforms/client'

  export let data

  const { form, enhance, errors, constraints } = superForm(data.form)
</script>

<CenteredContent>
  <form method="post" use:enhance>
    <h1>Neues Spiel</h1>

    <TextInput
      name="name"
      label="Name"
      bind:value={$form.name}
      errors={$errors.name}
      constraints={$constraints.name}
    />

    <div class="actions">
      <Button href="/">Abbrechen</Button>
      <Button type="submit" accent>Start</Button>
    </div>
  </form>
</CenteredContent>

<style lang="postcss">
  .actions {
    display: flex;
    gap: var(--size-2);
  }
</style>
