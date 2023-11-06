<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { getSharedGameContext } from '$lib/client/game/utils'
  import Score from '$lib/components/game/playing/game-status/Score.svelte'
  import type { SharedGameContext } from '$lib/game/types'
  import format from 'date-fns/esm/format'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)

  const sharedContext = useSelector(machine.service, ({ context }) => getSharedGameContext(context))

  $: sharedContextData = $sharedContext
    ? 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify($sharedContext, undefined, 2))
    : null

  const getFilename = (context: SharedGameContext) => {
    const date = new Date(context.timestamp)

    return `game-data-${format(date, 'yyyy-LL-dd')}.json`
  }
</script>

<Score />

{#if $isAdmin && $sharedContext && sharedContextData}
  {@const filename = getFilename($sharedContext)}
  Download Data:
  <a href={sharedContextData} download={filename}>{filename}</a>
{/if}
