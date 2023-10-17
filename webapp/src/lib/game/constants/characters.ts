import type { Side } from '../types'

export type Character = {
  id: string
  name: string
  description: string
  ability?: AbilityId
  side: Side
}
export type DefenseCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'defense' }>['id']
export type AttackCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'attack' }>['id']
export type CharacterId = DefenseCharacterId | AttackCharacterId

export const ABILITIES = {
  'quarter-reveal':
    'Darf fragen, auf welchem Viertel des Spielbretts sich der/die Angreifer:in befindet.',
  'is-attacking-stage':
    'Darf fragen, ob der/die Angreifer:in, eine Stufe angreift, wenn sie sich auf dieser Stufe oder auf einem angrenzenden Feld zu dazu befindet.',
  'is-next-to-attacker':
    'Darf fragen, ob der/die Angreifer:in sich auf seinem oder einem angrenzenden Feld, befindet.',
  'exchange-digital-footprint':
    'Darf den Gegenstand „Digital Footprint“ als Joker für einen beliebigen Gegenstand einsetzen.',
} as const

export type AbilityId = keyof typeof ABILITIES

export const CHARACTERS = [
  {
    id: 'order-manager',
    name: 'Auftragsmanagement',
    description:
      'Die Auftragsmanager:innen sind für die Koordination und Überwachung des Bestell- und Lieferprozesses eines Unternehmens zuständig und kümmern sich auch um die Beauftragung von Großhandel und Lieferanten.',
    ability: 'quarter-reveal',
    side: 'defense',
  },
  {
    id: 'dispatch-manager',
    name: 'Speditionsleitung',
    description:
      'Die Leiter:innen in der Spedition müssen sicherstellen, das alle Produkte den hohen Qualitätsstandards entsprechen.',
    ability: 'is-attacking-stage',
    side: 'defense',
  },
  {
    id: 'quality-manager',
    name: 'Qualitätsmanagement',
    description:
      'Die Qualitätsmanager:innen sind für die Sicherstellung der Qualität der Produkte verantwortlich. Sie stellen sicher, dass alle Standards eingehalten werden',
    ability: 'is-next-to-attacker',
    side: 'defense',
  },
  {
    id: 'it-specialist',
    name: 'IT Fachkraft',
    description:
      'Die IT-Spezialist:innen sind für die Sicherstellung von Informations-Systeme zuständig. Sie kümmern sich auch um den Schutz der Systeme gegen Cyberangriffe',
    ability: 'exchange-digital-footprint',
    side: 'defense',
  },
  {
    id: 'frustrated',
    name: 'Frustration',
    description:
      'Du wurdest bei der letzten Beförderungsrunde übergangen – schon wieder! Frustriert über diese andauernde Ungerechtigkeit ziehst du den Schlussstrich und verlässt deine Firma; aber nicht, ohne dich vorher durch einen Sabotageakt bei ihr zu „bedanken“ – als ihr ehemaliger Risikomanager weißt du schließlich über die Schwachstellen im System Bescheid',
    side: 'attack',
  },
  {
    id: 'disappointed',
    name: 'Enttäuscht',
    description:
      'Als System-Administratorin hast du Zugriff auf die sensibelsten Daten. Durch einen Blick in die interne Kommunikation der Geschäftsführung erfährt deine Kollegin, dass länger geplant ist, eure Abteilung demnächst zu outsourcen. Zutiefst enttäuscht darüber, dass man euch vor vollendete Tatsachen stellen wird. Jetzt willst du ihnen einen Denkzettel verpassen',
    side: 'attack',
  },
] as const satisfies readonly Character[]
