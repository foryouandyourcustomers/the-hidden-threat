<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Face from '$lib/components/icons/Face.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import type { DefenderId } from '$lib/game/types'
  import { getCharacter } from '$lib/game/utils/player'
  import PlayerConfigurator from './PlayerConfigurator.svelte'

  const { machine, user } = getGameContext()

  const editingPlayerId = useSelector(
    machine.service,
    ({ context }) => ($user.side === 'attack' ? context.attack : context.defense).editingPlayerId,
  )

  const players = useSelector(machine.service, ({ context }) =>
    $user.side === 'attack' ? [context.attack.attacker] : context.defense.defenders,
  )
  const canEdit = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'start editing player', playerId: 'attacker' }),
  )
  const canContinue = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'next step' }),
  )

  const toDefenderId = (playerId: number) => `defender${playerId}` as DefenderId

  const users = useSelector(machine.service, ({ context }) => context.users)
</script>

<Heading separator>
  Rollenverteilung

  <svelte:fragment slot="info">Schritt 3 von 3</svelte:fragment>
</Heading>

<section>
  <Heading centered>{$user.side === 'attack' ? 'Angriff' : 'Verteidigung'}</Heading>

  <Paragraph width="full">
    Die Rollenverteilung wird von der Spielleitung übernommen. Es müssen für jede Rolle ein:e
    Spieler:in bestimmt und bestätigt werden. Die restlichen Teilnehmenden können das Spielgeschehen
    beobachten und das Team beraten.
  </Paragraph>

  <div class="players">
    {#each $players as player, i}
      <div class="player">
        {#if player.isConfigured}
          <Heading centered spacing="none" size="sm">{getCharacter(player.character).name}</Heading>
          {$users.find((user) => user.id === player.userId)?.name}
          <div class="face">
            <Face faceId={player.faceId} />
          </div>
        {/if}
        <Button
          size="small"
          disabled={!$canEdit}
          on:click={() =>
            machine.send({
              type: 'start editing player',
              playerId: $user.side === 'attack' ? 'attacker' : toDefenderId(i),
            })}
        >
          Rolle {player.isConfigured ? 'wechseln' : `${i + 1} bestimmen`}
        </Button>
      </div>
    {/each}
  </div>
</section>

<Actions>
  <Button
    primary
    disabled={!$canContinue}
    disabledReason={$user.isAdmin
      ? 'Alle Rollen müssen zugewiesen sein'
      : 'Nur Administrator:innen dürfen bestätigen'}
    on:click={() => machine.send({ type: 'next step' })}
  >
    Weiter zum Spiel
  </Button>
</Actions>

{#if $editingPlayerId !== undefined}
  {#key $editingPlayerId}
    <!-- Using #key here to make sure that the player configurator is not reused
    when switching the player that is being edited. -->
    <PlayerConfigurator playerId={$editingPlayerId} />
  {/key}
{/if}

<style lang="postcss">
  section {
    margin-top: 1.5rem;
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    padding: 1rem 1.25rem;
  }
  .players {
    grid-gap: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
    margin-top: 1.25rem;
    .player {
      display: grid;
      justify-items: center;
      gap: 1rem;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      padding: 1.25rem;

      .face {
        width: 6rem;
        height: 6rem;
      }
    }
  }
</style>
