<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'

  let visible = true
</script>

{#if visible}
  <GameDialog title="Joker eingesetzt" on:close={() => (visible = false)}>
    <Paragraph>
      Der/Die Angreifer:in hat einen Joker eingesetzt um der Frage auszuweichen.
    </Paragraph>
  </GameDialog>
{/if}
