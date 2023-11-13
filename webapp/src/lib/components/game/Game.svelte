<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { Toaster } from 'svelte-sonner'
  import Board from './Board.svelte'
  import Finished from './finished/Finished.svelte'
  import InGame from './header/InGame.svelte'
  import Lobby from './lobby/Lobby.svelte'
  import Playing from './playing/Playing.svelte'
  import Sound from './Sound.svelte'
  import { didWarmup, warmup } from '$lib/sound'

  const { machine } = getGameContext()

  export let reportMousePosition: (position: [number, number]) => void
  type Section = 'Lobby' | 'Playing' | 'Finished' | undefined

  const section = useSelector(machine.service, (snapshot) => {
    let section: Section = undefined
    if (snapshot.matches('Lobby')) {
      section = 'Lobby'
    } else if (snapshot.matches('Playing')) {
      section = 'Playing'
    } else if (snapshot.matches('Finished')) {
      section = 'Finished'
    }
    return section
  })
</script>

<svelte:body on:click={() => !$didWarmup && warmup()} />

<Board {reportMousePosition} paddedContent={$section !== 'Playing'}>
  <InGame slot="header" />

  {#if $section === 'Lobby'}
    <Lobby />
  {:else if $section === 'Playing'}
    <Playing />
  {:else if $section === 'Finished'}
    <Finished />
  {:else}
    Unknown state
  {/if}

  <slot name="overlays" slot="overlays" />
</Board>

<Toaster position="top-right" closeButton duration={1000 * 60} theme="light" />

<Sound />
