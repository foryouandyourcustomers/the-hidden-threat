<script lang="ts">
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Horizontal from '$lib/components/layout/Horizontal.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { DOCS_URL } from '$lib/constants'
  import DownloadIcon from '~icons/lucide/arrow-down-to-line'
  import AnalogGame from './AnalogGame.svelte'
</script>

<Section width="sm" bg="fade">
  <h2 class="title auto">Die digitale Variante zum Tabletop</h2>
  <img src="/images/landing-page-teaser.png" alt="The physical board game" />

  <Paragraph size="lg">
    In diesem fesselnden Spiel werden Sie unmittelbar Zeuge von Angriffen auf Lieferketten.
    Schlüpfen Sie entweder in eine bedeutende Rolle in der Verteidigung oder arbeiten Sie im
    Verborgenen als Teil des Angriffs.
  </Paragraph>
  <Paragraph size="lg">
    Unvorhergesehene Ereignisse müssen gemeistert und unter Druck wichtige Entscheidungen getroffen
    werden, um die Lieferketten zu schützen und Resilienz aufzubauen. Durch Teamarbeit und
    strategisches Denken können Angriffe abgewehrt und die angreifende Person aufgespürt werden.
    Sind Sie bereit, diese Verantwortung anzunehmen und sich der Aufgabe zu stellen?
  </Paragraph>
  <Actions align="left">
    <Button primary href="/game/new">Neues Spiel starten</Button>
  </Actions>
</Section>

<Section width="md">
  <div class="bg-polygon-orange">
    <Polygon color="orange" />
  </div>
  <Horizontal>
    <img slot="left" src="/images/board-game.png" alt="The physical board game" />
    <div slot="right">
      <Heading size="md">Details zum Spiel</Heading>
      <Paragraph>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum.
        </p>
        <p>
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
          ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
          ut labore et dolore magna aliquyam erat,
        </p>
      </Paragraph>

      <Actions align="left">
        <Button target="_blank" href={DOCS_URL} size="small"
          ><DownloadIcon /> Spielanleitung herunterladen</Button
        >
      </Actions>
    </div>
  </Horizontal>
</Section>

<AnalogGame />

<style lang="postcss">
  .title {
    margin-bottom: 3rem;
    text-align: center;
  }
  .bg-polygon-orange {
    position: absolute;
    top: -4rem;
    right: 0rem;
    rotate: -60deg;
    width: 10rem;
  }
</style>
