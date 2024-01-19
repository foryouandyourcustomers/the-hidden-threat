<script lang="ts">
  import RollbackButton from './RollbackButton.svelte'
  import SwitchSidesButton from './SwitchSidesButton.svelte'
</script>

<div class="options">
  <p class="label">Optionen</p>
  <SwitchSidesButton />
  <RollbackButton />
</div>

<style lang="postcss">
  .options {
    padding-block: 0.5rem;
    min-width: 12rem;
  }
  .label {
    align-self: flex-start;
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
    padding-left: 0.75rem;
    font-weight: 700;
    font-size: var(--scale-00);
  }
</style>
