<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { isDefenderId, type DefenderId, type PlayerId, type Side } from '$lib/game/types'
  import { onMount } from 'svelte'

  export let playerId: PlayerId

  const side = (isDefenderId(playerId) ? 'defender' : 'attacker') as Side

  const { machine } = getGameContext()

  const player = useSelector(machine.service, ({ context }) => {
    return side === 'attacker'
      ? context.attack.attacker
      : context.defense.defenders[playerId as DefenderId]
  })

  const usersOnThisSide = useSelector(machine.service, ({ context }) =>
    context.users.filter((user) => user.side === side),
  )

  let userId = $player.userId
  let face = $player.face
  let role = $player.role

  onMount(
    player.subscribe((player) => {
      userId = player.userId
      face = player.face
    }),
  )

  const sendUpdate = () => {
    machine.send({
      type: 'assign role',
      role,
      playerId,
      userId,
      face,
    })
  }
</script>

<div class="configurator">
  <select on:blur={sendUpdate} bind:value={userId}>
    <option>--PLEASE SELECT--</option>
    {#each $usersOnThisSide as user}
      <option value={user.id}>{user.name}</option>
    {/each}
  </select>

  <select on:blur={sendUpdate} bind:value={face}>
    <option value="man">Man</option>
    <option value="woman">Woman</option>
    <option value="other">Other</option>
  </select>

  <button on:click={() => machine.send({ type: 'stop editing player', side })}>Close</button>
</div>

<style lang="postcss">
  .configurator {
    display: grid;
    position: fixed;
    place-content: center;
    z-index: 100000;
    inset: 0;
    background: #fffe;
  }
</style>
