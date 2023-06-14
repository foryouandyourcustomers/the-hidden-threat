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
    <h1>Spiel beitreten</h1>

    <TextInput
      name="userName"
      label="Dein Name"
      bind:value={$form.userName}
      errors={$errors.userName}
      constraints={$constraints.userName}
    />

    <div class="actions">
      <Button href="/">Abbrechen</Button>
      <Button type="submit" accent>Beitreten</Button>
    </div>
  </form>
</CenteredContent>

<style lang="postcss">
  .actions {
    display: flex;
    gap: var(--size-2);
  }
</style>
