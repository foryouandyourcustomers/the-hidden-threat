<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Score from '$lib/components/game/playing/game-status/Score.svelte'
  import { getGameSummary, getGameSummaryFilename, getSharedGameContext } from '$lib/game/utils'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)

  const sharedContext = useSelector(machine.service, ({ context }) => getSharedGameContext(context))

  $: sharedContextData = $sharedContext
    ? 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(getGameSummary($sharedContext), undefined, 2))
    : null
</script>

<Score />

{#if $isAdmin && $sharedContext && sharedContextData}
  {@const filename = getGameSummaryFilename($sharedContext)}
  Download Data:
  <a href={sharedContextData} download={filename}>{filename}</a>
{/if}
