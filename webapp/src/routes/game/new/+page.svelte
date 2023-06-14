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
      name="userName"
      label="Dein Name"
      bind:value={$form.userName}
      errors={$errors.userName}
      constraints={$constraints.userName}
    />
    <TextInput
      name="gameName"
      label="Optionaler Spiel Name"
      bind:value={$form.gameName}
      errors={$errors.gameName}
      constraints={$constraints.gameName}
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
