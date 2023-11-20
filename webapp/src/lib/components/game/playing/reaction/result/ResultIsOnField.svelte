<script lang="ts">
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'

  let visible = true
</script>

{#if visible}
  <!--
  This can only be shown if the attacker is not on this field, otherwise the
  game would be over.
-->
  <GameDialog title="Frage stellen" on:close={() => (visible = false)}>
    <Paragraph>Der/die Angreifer:in ist leider nicht auf diesem Feld.</Paragraph>
    <Actions>
      <Button on:click={() => (visible = false)} inverse size="small">Weiter geht's!</Button>
    </Actions>
  </GameDialog>
{/if}
