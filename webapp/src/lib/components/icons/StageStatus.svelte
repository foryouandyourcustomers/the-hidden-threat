<script lang="ts">
  export let status: 'attacked' | 'defended'
</script>

{#if status === 'attacked'}
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"
    ><circle cx="12" cy="12" r="10" fill="#F03A50" /><path
      d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6m-3 3 4 4m-1 1 2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4m-2-1-3 3m-1-1 2 2"
      stroke="#fff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    /></svg
  >
{:else}
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#B5BF39" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.4 1a1 1 0 0 0-.8 0l-8 3A1 1 0 0 0 3 5v7c0 3.4 2.3 6.2 4.3 8a22.7 22.7 0 0 0 4.2 2.9l.5-.9-.4.9c.2.1.6.1.8 0L12 22l.4.9a8.3 8.3 0 0 0 .4-.2 21 21 0 0 0 3.9-2.7c2-1.8 4.3-4.6 4.3-8V5a1 1 0 0 0-.6-1l-8-3Zm.3 19.4-.7.5a19.9 19.9 0 0 1-3.3-2.4c-2-1.7-3.7-4-3.7-6.5V5.7L12 3l7 2.6V12c0 2.6-1.7 4.8-3.7 6.5l-2.6 2Zm3-9.7a1 1 0 0 0-1.4-1.4L11 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l4-4Z"
      fill="#fff"
    />
  </svg>
{/if}

<style lang="postcss">
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
