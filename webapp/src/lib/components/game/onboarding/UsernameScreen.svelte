<script lang="ts">
  import type { CreateGameSchema, JoinGameSchema } from '$lib/client/forms'
  import Board from '$lib/components/game/Board.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Checkbox from '$lib/components/ui/Checkbox.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import TextInput from '$lib/components/ui/TextInput.svelte'
  import type { SuperValidated } from 'sveltekit-superforms'
  import { superForm } from 'sveltekit-superforms/client'

  export let data: SuperValidated<CreateGameSchema | JoinGameSchema>

  const form = superForm(data)
</script>

<Board paddedContent>
  <Heading separator>
    Username vergeben

    <svelte:fragment slot="info">Schritt 1 von 3</svelte:fragment>
  </Heading>

  <Paragraph>
    Willkommen zum Online-Spiel The Hidden Threat*. Gleich geht es los. Nach der Vergabe des
    Usernamen werden Sie in die Lobby geleitet.
  </Paragraph>

  <form method="post" use:form.enhance>
    <div class="field">
      <Heading centered>Dein Username</Heading>

      <Paragraph>Bitte gib Dir einen Username mit maximal 20 Buchstaben.</Paragraph>

      <TextInput
        {form}
        field="userName"
        placeholder="z.B. Vor-und Nachname, Spitzname, Initalen, etc."
      />
    </div>

    <Checkbox {form} field="acceptedTos">
      Hiermit stimme ich der Speicherung meiner eingegebenen Daten zu und bestätige dass ich
      mindestens 18 Jahre alt bin.*
    </Checkbox>

    <Actions>
      <Button href="/">Abbrechen</Button>
      <Button type="submit" primary>Start</Button>
    </Actions>
  </form>
</Board>

<style lang="postcss">
  form {
    width: 44rem;
  }
  .field {
    background: var(--color-blue-transp-760);
    padding: 1rem 2rem;
  }
</style>