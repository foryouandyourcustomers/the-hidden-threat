import type { BoardItem, Side } from './types'

export type Item = {
  id: string
  name: string
  description: string
  side: Side
}

export const ITEMS = [
  {
    id: 'certificate',
    name: 'Zertifikat',
    description:
      'Mit diesem Zertifikat können Unternehmen nachweisen, dass sie geeignete Schutzmaßnahmen gegen potenzielle Bedrohungen implementiert haben. Es ist ein wichtiges Instrument, um das Vertrauen der Kunden und Geschäftspartner in die Lieferkette zu stärken.',
    side: 'defense',
  },
  {
    id: 'insurance',
    name: 'Versicherung',
    description:
      'Die Versicherung bietet den Spielern Schutz und eine Absicherung gegen potenzielle Schäden, die durch Angriffe auf die Lieferkette entstehen können. Sie kann verwendet werden, um die Kosten für Reparaturen oder Ersatzteile zu decken und hilft, finanzielle Verluste zu vermeiden.',
    side: 'defense',
  },
  {
    id: 'security-camera',
    name: 'Sicherheitskamera',
    description:
      'Die Sicherheitskamera bieten Schutz gegen Angriffe in der Lieferkette. Sie helfen dabei, verdächtige Aktivitäten zu erkennen und aufzuzeichnen, um mögliche Bedrohungen zu identifizieren. Die Kameras ermöglichen eine bessere Überwachung der Lieferkette und können dazu beitragen, potenzielle Sicherheitsprobleme frühzeitig zu erkennen.',
    side: 'defense',
  },
  {
    id: 'alarm-system',
    name: 'Alarmanlage',
    description:
      'Die Alarmanlage erkennt verdächtige Bewegungen oder Geräusche und löst sofort ein akustisches und visuelles Warnsignal aus, um unerwünschte Eindringlinge abzuschrecken. Mit dieser Karte können Spieler ihre Lieferkette vor möglichen Bedrohungen schützen und das Vertrauen ihrer Kunden wahren.',
    side: 'defense',
  },
  {
    id: 'lock',
    name: 'Sicherheitsschloss',
    description:
      'Das Sicherheitsschloss ist ein Gegenstand, der oft verwendet wird, um die Sicherheit von Gegenständen und Räumen zu gewährleisten. Es hilft, unerwünschten Zugang zu verhindern und kann als zusätzliche Schutzmaßnahme in Kombination mit anderen Sicherheitsvorkehrungen eingesetzt werden, um das Risiko eines Angriffs auf eine Lieferkette zu minimieren.',
    side: 'defense',
  },
  {
    id: 'gps-tracker',
    name: 'GPS-Tracker',
    description:
      'Der GPS-Tracker kann verwendet werden, um den Spielern einen Vorteil zu verschaffen, indem sie jederzeit den genauen Standort ihrer Waren verfolgen können und so auf mögliche Angriffe schnell reagieren können.',
    side: 'defense',
  },
  {
    id: 'license',
    name: 'License',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    side: 'defense',
  },
  {
    id: 'encrypted-data',
    name: 'Verschlüsselte Daten',
    description:
      'Verschlüsselte Daten bieten Schutz vor Angriffen auf die Lieferkette, indem sie sicherstellt, dass sensible Informationen in einer undurchdringlichen Verschlüsselung aufbewahrt werden. Dadurch wird verhindert, dass Hacker oder andere Angreifer auf wichtige Daten zugreifen können, selbst wenn sie in das System eindringen.',
    side: 'defense',
  },
  {
    id: 'extinguisher',
    name: 'Feuerlöscher',
    description:
      'Feuerlöscher sind ein wichtiges Element des Arbeitsschutzes und tragen zur Sicherheit von Mensch und Material bei. Im Falle eines Brandes können Feuerlöscher schnell eingesetzt werden, um das Feuer zu löschen oder einzudämmen. In der Lieferkette können Feuerlöscher dazu beitragen, Brandrisiken zu minimieren und Schäden zu begrenzen.',
    side: 'defense',
  },
  {
    id: 'firewall',
    name: 'Firewall',
    description:
      'Die Firewall ist ein mächtiges Schutzwerkzeug, das eine digitale Barriere um das Netzwerk errichtet, um unautorisierten Zugriff zu verhindern. Durch das Blockieren von bösartigem Verkehr und das Überwachen des Datenverkehrs hilft die Firewall, die Systeme vor Angriffen und Datenverlust zu schützen und die Integrität der Lieferkette zu gewährleisten.',
    side: 'defense',
  },
  {
    id: 'digital-footprint',
    name: 'Digital Footprint',
    description:
      'Ein Digital Footprint, kann zum Schutz vor Angriffen auf die Lieferkette verwendet werden. Es bezieht sich auf die Spuren, die digitale Aktivitäten hinterlassen, und kann helfen, potenzielle Schwachstellen in der Lieferkette aufzudecken und zu minimieren.',
    side: 'defense',
  },
  {
    id: 'fake-identity-card',
    name: 'Gefälschter Ausweis',
    description:
      'Der Ausweis kann dazu genutzt werden, um sich unbefugt Zugang zu verschiedenen Orten und Informationen zu verschaffen. Er kann verwendet werden, um Sicherheitsmaßnahmen zu umgehen und das Vertrauen anderer Mitarbeiter zu gewinnen, um auf geschützte Ressourcen zuzugreifen.',
    side: 'attack',
  },
  {
    id: 'usb-stick',
    name: 'USB-Stick',
    description:
      'Der USB-Stick dient zur Übertragung von Daten und Informationen zwischen verschiedenen Stationen der Lieferkette, um einen reibungslosen Ablauf sicherzustellen. Er ist ein wichtiger Bestandteil des Prozesses und enthält vertrauliche Informationen, die bei einem Missbrauch zu erheblichen Schäden führen können.',
    side: 'attack',
  },
  {
    id: 'blueprint',
    name: 'Gebäudeplan',
    description:
      'Der Gebäudeplan zeigt die Struktur und Aufteilung des Firmengebäudes. Mit ihm kann man schnell und gezielt wichtige Bereiche wie das IT-Zentrum oder die Lagerhallen identifizieren und attackieren.',
    side: 'attack',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    description:
      'Die Cloud kann genutzt werden, um den Datenaustausch zwischen den verschiedenen Akteuren zu erleichtern und zu beschleunigen. Bei einem Angriff auf die Cloud können jedoch vertrauliche Informationen gestohlen, manipuliert oder gelöscht werden, was zu erheblichen Störungen der Lieferkette führen kann.',
    side: 'attack',
  },
  {
    id: 'virus',
    name: 'Computer Virus',
    description:
      'Der Virus kann das System infizieren, wodurch Daten gelöscht, verändert oder gestohlen werden können. Die Spieler müssen schnell handeln, um den Virus zu identifizieren und zu beseitigen, bevor er noch mehr Schaden anrichtet.',
    side: 'attack',
  },
  {
    id: 'tools',
    name: 'Werkzeug',
    description:
      'Das Werkzeug kann für einen Angriff eingesetzt werden, wenn es in die falschen Hände gerät, da es potenziell gefährliche Werkzeuge wie Sägen, Bohrer oder Schleifmaschinen enthält. Ein unautorisiertes Eindringen in das Lagerhaus oder ein Diebstahl des Werkzeugs kann die Lieferkette empfindlich stören und erheblichen Schaden verursachen.',
    side: 'attack',
  },
  {
    id: 'gun',
    name: 'Pistole',
    description:
      'Die Pistole kann eine Bedrohung darstellen und den Spielern zeigen, dass der Angreifer bereit ist, Gewalt einzusetzen, um seine Ziele zu erreichen.',
    side: 'attack',
  },
  {
    id: 'binoculars',
    name: 'Fernglas',
    description:
      'Das Fernglas ermöglicht den Spielern, einen genaueren Blick auf die Lieferkette zu werfen und mögliche Schwachstellen oder unerwartete Ereignisse zu erkennen. Durch das gezielte Beobachten können Risiken minimiert und Chancen genutzt werden.',
    side: 'attack',
  },
  {
    id: 'dynamite',
    name: 'Dynamit',
    description:
      'Dynamit enthält einen explosiven Stoff, der in der Lage ist, schwere Schäden an Gebäuden und Infrastrukturen zu verursachen. Es erfordert spezielle Vorsichtsmaßnahmen bei der Lagerung und Handhabung, um Verletzungen und Schäden zu vermeiden. In den falschen Händen kann es zu einem schwerwiegenden Angriff auf die Lieferkette führen.',
    side: 'attack',
  },
  {
    id: 'data-exchange',
    name: 'Datenaustausch',
    description:
      'Der Datenaustausch ermöglicht dem Angreifer den Zugriff auf vertrauliche Daten innerhalb der Lieferkette. Durch die Verwendung dieses Gegenstands kann der Angreifer Daten manipulieren, löschen oder kopieren, um seine Ziele zu erreichen und den Schaden für das Unternehmen zu maximieren.',
    side: 'attack',
  },
] as const satisfies readonly Item[]

export type DefenseItemId = Extract<(typeof ITEMS)[number], { side: 'defense' }>['id']
export type AttackItemId = Extract<(typeof ITEMS)[number], { side: 'attack' }>['id']
export type ItemId = DefenseItemId | AttackItemId

export const isDefenseItemId = (itemId: string): itemId is DefenseItemId =>
  ITEMS.find((item) => item.id === itemId)?.side === 'defense'
export const isAttackItemId = (itemId: string): itemId is AttackItemId => !isDefenseItemId(itemId)

export const isItemIdOfSide = <T extends Side>(
  itemId: string,
  side: T,
): itemId is T extends 'attack' ? AttackItemId : DefenseItemId =>
  side === 'attack' ? isAttackItemId(itemId) : isDefenseItemId(itemId)

// export const ABILITIES = ['collect', 'ask', 'teleport']

export type Character = {
  id: string
  name: string
  description: string
  ability: string
  side: Side
}

export const CHARACTERS = [
  {
    id: 'order-manager',
    name: 'Auftragsmanagement',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'defense',
  },
  {
    id: 'it-specialist',
    name: 'IT Fachkraft',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'defense',
  },
  {
    id: 'dispatch-manager',
    name: 'Speditionsleitung',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'defense',
  },
  {
    id: 'quality-manager',
    name: 'Qualitätsmanagement',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'defense',
  },
  {
    id: 'frustrated',
    name: 'Frustriert',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'attack',
  },
  {
    id: 'disappointed',
    name: 'Enttäuscht',
    description:
      'Die Auftragsmanagerin ist für die Koordination und Überwachung des Bestell- und Lieferprozesses des Unternehmens zuständig und kümmern sich auch um die Beauftragung vonGroßhandel und Lieferanten.',
    ability:
      'Darf den gesamten Spielzugablauf mit einer Verteidiger:in-Figur ihrer Wahl ausführen.',
    side: 'attack',
  },
] as const satisfies readonly Character[]

export type DefenseCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'defense' }>['id']
export type AttackCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'attack' }>['id']
export type CharacterId = DefenseCharacterId | AttackCharacterId

type Face = {
  id: number
}

export const FACES = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
] as const satisfies readonly Face[]

export type FaceId = (typeof FACES)[number]['id']

export const INITIAL_BOARD_ITEMS: BoardItem[] = [
  // Row 1
  { id: 'certificate', position: [1, 0] },
  { id: 'usb-stick', position: [1, 0] },
  { id: 'virus', position: [3, 0] },
  { id: 'binoculars', position: [3, 0] },
  { id: 'lock', position: [4, 0] },
  { id: 'data-exchange', position: [4, 0] },
  { id: 'gps-tracker', position: [5, 0] },
  { id: 'fake-identity-card', position: [5, 0] },
  { id: 'encrypted-data', position: [6, 0] },
  { id: 'dynamite', position: [6, 0] },
  { id: 'license', position: [7, 0] },
  { id: 'tools', position: [7, 0] },
  { id: 'security-camera', position: [8, 0] },
  { id: 'cloud', position: [8, 0] },
  // Row 2
  { id: 'security-camera', position: [0, 1] },
  { id: 'fake-identity-card', position: [0, 1] },
  { id: 'alarm-system', position: [1, 1] },
  { id: 'data-exchange', position: [1, 1] },
  { id: 'gun', position: [2, 1] },
  { id: 'blueprint', position: [2, 1] },
  { id: 'extinguisher', position: [3, 1] },
  { id: 'cloud', position: [3, 1] },
  { id: 'usb-stick', position: [6, 1] },
  { id: 'blueprint', position: [6, 1] },
  { id: 'lock', position: [8, 1] },
  { id: 'virus', position: [8, 1] },
  // Row 3
  { id: 'insurance', position: [0, 2] },
  { id: 'tools', position: [0, 2] },
  { id: 'dynamite', position: [2, 2] },
  { id: 'security-camera', position: [2, 2] },
  { id: 'usb-stick', position: [3, 2] },
  { id: 'license', position: [3, 2] },
  { id: 'digital-footprint', position: [4, 2] },
  { id: 'virus', position: [4, 2] },
  { id: 'binoculars', position: [5, 2] },
  { id: 'encrypted-data', position: [5, 2] },
  { id: 'security-camera', position: [6, 2] },
  { id: 'fake-identity-card', position: [6, 2] },
  { id: 'firewall', position: [7, 2] },
  { id: 'data-exchange', position: [7, 2] },
  { id: 'gun', position: [8, 2] },
  { id: 'dynamite', position: [8, 2] },
  // Row 4
  { id: 'virus', position: [0, 3] },
  { id: 'blueprint', position: [0, 3] },
  { id: 'data-exchange', position: [3, 3] },
  { id: 'insurance', position: [3, 3] },
  { id: 'cloud', position: [5, 3] },
  { id: 'alarm-system', position: [5, 3] },
  { id: 'tools', position: [6, 3] },
  { id: 'extinguisher', position: [6, 3] },
  { id: 'binoculars', position: [7, 3] },
  { id: 'digital-footprint', position: [7, 3] },
  // Row 5
  { id: 'digital-footprint', position: [1, 4] },
  { id: 'gun', position: [1, 4] },
  { id: 'lock', position: [2, 4] },
  { id: 'dynamite', position: [2, 4] },
  { id: 'tools', position: [3, 4] },
  { id: 'binoculars', position: [3, 4] },
  { id: 'gun', position: [4, 4] },
  { id: 'firewall', position: [4, 4] },
  { id: 'usb-stick', position: [5, 4] },
  { id: 'gps-tracker', position: [5, 4] },
  { id: 'data-exchange', position: [6, 4] },
  { id: 'insurance', position: [6, 4] },
  { id: 'blueprint', position: [8, 4] },
  { id: 'license', position: [8, 4] },
  // Row 6
  { id: 'usb-stick', position: [0, 5] },
  { id: 'blueprint', position: [0, 5] },
  { id: 'alarm-system', position: [1, 5] },
  { id: 'cloud', position: [1, 5] },
  { id: 'extinguisher', position: [2, 5] },
  { id: 'virus', position: [2, 5] },
  { id: 'fake-identity-card', position: [3, 5] },
  { id: 'certificate', position: [3, 5] },
  { id: 'blueprint', position: [5, 5] },
  { id: 'cloud', position: [5, 5] },
  { id: 'lock', position: [6, 5] },
  { id: 'virus', position: [6, 5] },
  { id: 'encrypted-data', position: [7, 5] },
  { id: 'dynamite', position: [7, 5] },
  { id: 'fake-identity-card', position: [8, 5] },
  { id: 'cloud', position: [8, 5] },
  // Row 7
  { id: 'binoculars', position: [0, 6] },
  { id: 'license', position: [0, 6] },
  { id: 'usb-stick', position: [2, 6] },
  { id: 'gun', position: [2, 6] },
  { id: 'digital-footprint', position: [4, 6] },
  { id: 'dynamite', position: [4, 6] },
  { id: 'certificate', position: [7, 6] },
  { id: 'binoculars', position: [7, 6] },
  { id: 'extinguisher', position: [8, 6] },
  { id: 'gun', position: [8, 6] },
  // Row 8
  { id: 'data-exchange', position: [0, 7] },
  { id: 'gun', position: [0, 7] },
  { id: 'gps-tracker', position: [1, 7] },
  { id: 'tools', position: [1, 7] },
  { id: 'firewall', position: [2, 7] },
  { id: 'fake-identity-card', position: [2, 7] },
  { id: 'virus', position: [3, 7] },
  { id: 'binoculars', position: [3, 7] },
  { id: 'encrypted-data', position: [4, 7] },
  { id: 'usb-stick', position: [4, 7] },
  { id: 'dynamite', position: [6, 7] },
  { id: 'tools', position: [6, 7] },
  { id: 'cloud', position: [7, 7] },
  { id: 'alarm-system', position: [7, 7] },
  { id: 'blueprint', position: [8, 7] },
  { id: 'insurance', position: [8, 7] },
]
