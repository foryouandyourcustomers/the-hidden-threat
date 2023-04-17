<script lang="ts">
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
