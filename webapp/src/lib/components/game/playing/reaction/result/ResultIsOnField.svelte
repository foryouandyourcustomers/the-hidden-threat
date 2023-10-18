<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
</script>

<!--
  This can only be shown if the attacker is not on this field, otherwise the
  game would be over.
-->
<GameDialog title="Angreifer:in nicht auf dem Feld" on:close>
  <Paragraph>Der/die Angreifer:in ist leider nicht auf diesem Feld.</Paragraph>
</GameDialog>
