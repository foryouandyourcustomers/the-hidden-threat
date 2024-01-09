<script lang="ts">
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import AnalogGameCard from './AnalogGameCard.svelte'
</script>

<Section width="lg" bg="light" bgFill="content">
  <div class="bg-polygon-blue">
    <Polygon color="blue" />
  </div>
  <div class="bg-polygon-black">
    <Polygon color="black" />
  </div>

  <Heading centered size="lg">Analoge Spielelemente zum Download</Heading>
  <Paragraph centered size="lg">
    Doch lieber analog? Das Spiel kann auch zusammen am Tisch gespielt werden. Alles was dazu
    gebraucht wird, ist hier zum Download bereitgestellt. Laden Sie alle Spielmaterialien herunter
    und drucken Sie diese einfach aus.
  </Paragraph>

  <div class="cards">
    <AnalogGameCard
      title="Spielkarten"
      subtitle="Sie benötigen noch weitere Spielkarten?"
      downloadLink=""
      --background-image="url('/images/analog-cards.jpg')"
    >
      Hier finden Sie das komplette Kartendeck.
    </AnalogGameCard>
    <AnalogGameCard
      title="Spielbrett"
      subtitle="Sie brauchen ein weiteres Spielbrett für den Angreifer?"
      downloadLink=""
      --background-image="url('/images/analog-board.jpg')"
    >
      Es liegt für Sie im A4-Format zum Download bereit.
    </AnalogGameCard>
    <AnalogGameCard
      title="Spielregeln"
      subtitle="Nicht mehr alle Regeln oder Gegenstände parat?"
      downloadLink=""
      --background-image="url('/images/analog-rules.jpg')"
    >
      Finden Sie alles in den Spielregeln für das Brettspiel.
    </AnalogGameCard>
  </div>
</Section>

<style lang="postcss">
  .bg-polygon-blue {
    position: absolute;
    top: 15rem;
    left: 1.5rem;
    transform-origin: top left;
    rotate: -20deg;
    z-index: -1;
    width: 15rem;
    height: 15rem;
  }
  .bg-polygon-black {
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: -1;
    width: 10rem;
    height: 10rem;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1.5rem;
    margin-inline: auto;
    margin-top: 2.5rem;
    max-width: 56rem;
  }
</style>
