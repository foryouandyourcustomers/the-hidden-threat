import type { Side } from '../types'

export type Character = {
  id: string
  name: string
  description: string
  ability: string
  side: Side
}
export type DefenseCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'defense' }>['id']
export type AttackCharacterId = Extract<(typeof CHARACTERS)[number], { side: 'attack' }>['id']
export type CharacterId = DefenseCharacterId | AttackCharacterId

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
