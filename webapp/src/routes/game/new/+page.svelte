<script>
  import CenteredContent from '$lib/components/layout/CenteredContent.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Checkbox from '$lib/components/ui/Checkbox.svelte'
  import TextInput from '$lib/components/ui/TextInput.svelte'
  import { superForm } from 'sveltekit-superforms/client'

  export let data

  const form = superForm(data.form)
</script>

<CenteredContent>
  <form method="post" use:form.enhance>
    <h1>Neues Spiel</h1>

    <TextInput {form} field="userName">Dein Name *</TextInput>

    <Checkbox {form} field="acceptedTos">
      Ich habe die <a href="/privacy" target="_blank">Datenschutzerklärung</a>, die
      <a href="/tos" target="_blank">Nutzungsbedingungen</a> gelesen und akzeptiere sie und bin über
      18 Jahre alt. *
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
