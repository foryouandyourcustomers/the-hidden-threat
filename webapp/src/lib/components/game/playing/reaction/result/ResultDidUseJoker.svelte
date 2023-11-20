<script lang="ts">
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'

  let visible = true
</script>

{#if visible}
  <GameDialog title="Frage stellen" on:close={() => (visible = false)}>
    <Paragraph>
      <strong>Du erhältst keine Antwort auf deine Frage.</strong>
    </Paragraph>
    <Paragraph>
      Leider erhältst du diesmal keine Antwort. Der/die Angreifer:in hat ihren Joker eingesetzt, um
      auf die Frage nicht antworten zu müssen. Was das wohl bedeutet?
    </Paragraph>
    <Actions>
      <Button on:click={() => (visible = false)} size="small" inverse>Weiter geth's!</Button>
    </Actions>
  </GameDialog>
{/if}
