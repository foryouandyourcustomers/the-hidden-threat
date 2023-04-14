<script lang="ts">
  import { onMount } from 'svelte'

  export let data

  const { helpers } = data
</script>

Here are your helpers:

<ul>
  {#each helpers as helper}
    <li>{helper}</li>
  {/each}
</ul>

{data.website}
