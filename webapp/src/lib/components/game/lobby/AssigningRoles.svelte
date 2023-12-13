<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Face from '$lib/components/icons/Face.svelte'
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import type { DefenderId } from '$lib/game/types'
  import { getAbility, getCharacter } from '$lib/game/utils/player'
  import NextIcon from '~icons/lucide/chevron-right'
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

<div class="backdrop"><Polygon color="blue" /></div>

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
      <div class="player" class:configured={player.isConfigured}>
        {#if player.isConfigured}
          {@const character = getCharacter(player.character)}
          {@const ability = getAbility(character)}
          <div class="configured">
            <h3 class="auto character-name">
              {character.name}
            </h3>
            <div class="details">
              <div class="base-facts">
                <div class="face">
                  <Face faceId={player.faceId} />
                </div>
                <div class="user-name">
                  {$users.find((user) => user.id === player.userId)?.name}
                </div>
              </div>
              {#if ability}
                <div class="ability">
                  <h5 class="auto">Fähigkeit</h5>
                  <p class="text-sm">{ability}</p>
                </div>
              {/if}
            </div>
            <button
              class="change-role unstyled"
              disabled={!$canEdit}
              on:click={() =>
                machine.send({
                  type: 'start editing player',
                  playerId: $user.side === 'attack' ? 'attacker' : toDefenderId(i),
                })}
            >
              Rolle {player.isConfigured ? 'wechseln' : `${i + 1} bestimmen`}
            </button>
          </div>
        {:else}
          <button
            class="start-editing unstyled"
            disabled={!$canEdit}
            on:click={() =>
              machine.send({
                type: 'start editing player',
                playerId: $user.side === 'attack' ? 'attacker' : toDefenderId(i),
              })}
          >
            Rolle {i + 1} bestimmen
            <NextIcon />
          </button>
        {/if}
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
      justify-items: stretch;
      gap: 1rem;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      padding: 0;

      &.configured {
        align-self: stretch;
      }

      .configured {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;

        .character-name {
          text-align: center;
        }

        .details {
          border-radius: var(--radius-sm);
          background: var(--color-blue-transp-760);
          padding: 0.75rem;
          height: 100%;

          .base-facts {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            .face {
              width: 4.375rem;
              height: 4.375rem;
            }

            .user-name {
              overflow: hidden;
              font: var(--display-h5);
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .ability {
            margin-top: 0.75rem;
          }
        }
      }

      .face {
        width: 6rem;
        height: 6rem;
      }
    }
  }

  .backdrop {
    position: absolute;
    z-index: -1;
    inset: var(--size-header-height) 0 var(--size-game-footer-height) 0;
    overflow: hidden;
    pointer-events: none;

    :global(svg) {
      position: absolute;
      right: -9%;
      bottom: -20%;
      rotate: -15deg;
      width: 35rem;
    }
  }

  button.start-editing {
    display: flex;
    justify-content: center;
    align-items: center;

    gap: 0.25rem;
    padding: 0.5rem 1.25rem;
    width: 100%;
    font: var(--display-h3);
    text-transform: uppercase;
  }
  button.change-role {
    display: block;
    margin-block: 0.75rem 0.25rem;
    width: 100%;
    font-weight: 700;
    font-size: 0.875rem;
    text-align: center;
    text-decoration: underline;
  }
</style>
