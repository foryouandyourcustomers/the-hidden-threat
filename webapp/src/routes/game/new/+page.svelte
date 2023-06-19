<script>
  import CenteredContent from '$lib/components/layout/CenteredContent.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Checkbox from '$lib/components/ui/Checkbox.svelte'
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
      bind:value={$form.userName}
      errors={$errors.userName}
      constraints={$constraints.userName}
    >
      Dein Name
    </TextInput>
    <TextInput
      name="gameName"
      bind:value={$form.gameName}
      errors={$errors.gameName}
      constraints={$constraints.gameName}
    >
      Optionaler Spiel Name
    </TextInput>

    <Checkbox
      name="acceptedTos"
      value="true"
      bind:checked={$form.acceptedTos}
      errors={$errors.acceptedTos}
    >
      Ich habe die <a href="/privacy" target="_blank">Datenschutzerklärung</a> &amp;
      <a href="/tos" target="_blank">Nutzungsbedingungen</a> gelesen und akzeptiere sie.
    </Checkbox>
    <Checkbox name="over18" value="true" bind:checked={$form.over18} errors={$errors.over18}>
      Ich bin über 18 Jahre alt.
    </Checkbox>

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
