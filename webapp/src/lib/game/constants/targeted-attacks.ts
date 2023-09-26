import type { AttackItemId } from './items'
import type { StageId } from './stages'

export type TargetedAttack = {
  target: { supplyChainId: 0 | 1 | 2; stageId: StageId; requiredItems: AttackItemId[] }
  description: string
}

export const TARGETED_ATTACKS: TargetedAttack[] = [
  {
    target: { supplyChainId: 0, stageId: 'supply', requiredItems: ['usb-stick', 'tools'] },

    description: `Schleust gefälschte und minderwertige Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle und Kundenbeschwerden.`,
  },
  {
    target: { supplyChainId: 2, stageId: 'supply', requiredItems: ['cloud', 'virus'] },

    description: `Startet eine Cyberattacke auf das Beschaffungssystem, um den Zugriff auf Bestelldaten, Lieferpläne und Zahlungsinformationen zu blockieren.`,
  },
  {
    target: {
      supplyChainId: 1,
      stageId: 'supply',
      requiredItems: ['usb-stick', 'fake-identity-card'],
    },
    description: `Infiltriert das Beschaffungssystem und manipuliert die Zahlungen. Der mangelnde Geldfluss wird zu Verzögerungen in den nachfolgenden Stufen führen.`,
  },

  // ----

  {
    target: { supplyChainId: 1, stageId: 'production', requiredItems: ['binoculars', 'tools'] },
    description: `Brecht ungesehen in die Produktion ein und ladet Schadsoftware auf den Betriebsserver hoch, um für Qualitätsprobleme und Produktionsausfälle zu sorgen.`,
  },
  {
    target: { supplyChainId: 2, stageId: 'production', requiredItems: ['virus', 'cloud'] },
    description: `Führt einen Malware-Angriff auf das Produktionssystem durch, um die Maschinen zu stoppen und die Produktion zu unterbrechen.`,
  },
  {
    target: {
      supplyChainId: 0,
      stageId: 'production',
      requiredItems: ['blueprint', 'dynamite'],
    },
    description: `Unterbrecht gezielt den reibungslosen Ablauf der Lieferkette, indem ihr wichtige Bestellungen verzögert.`,
  },

  // ----

  {
    target: { supplyChainId: 0, stageId: 'logistics', requiredItems: ['binoculars', 'gun'] },
    description: `Unterbrecht den Warentransport, indem ihr einen LKW entführt. Die „verschwundenen” Güter werden dafür sorgen, dass es zu Verzögerungen und Ausfällen kommt.`,
  },
  {
    target: { supplyChainId: 2, stageId: 'logistics', requiredItems: ['data-exchange', 'cloud'] },
    description: `Verbreitet gefälschte Informationen über Liefertermine oder Transportrouten, um Verwirrung zu stiften und Engpässe oder Verzögerungen zu verursachen.`,
  },
  {
    target: {
      supplyChainId: 1,
      stageId: 'logistics',
      requiredItems: ['data-exchange', 'cloud'],
    },
    description: `Führt einen DDoS-Angriff auf die Logistik-Website durch. Wenn Partner keinen Zugriff auf die Bestell- und Transportinformationen haben, verspäten sich Bestellungen.`,
  },

  // ----

  {
    target: {
      supplyChainId: 0,
      stageId: 'storage',
      requiredItems: ['fake-identity-card', 'dynamite'],
    },
    description: `Umgeht die Sicherheitsvorkehrungen und beschädigt die lagernden Waren. Die Verluste werden zu Engpässen in der Lieferkette führen.`,
  },
  {
    target: { supplyChainId: 1, stageId: 'storage', requiredItems: ['data-exchange', 'blueprint'] },
    description: `Manipuliert die Lagerbestände. Sobald der Bestand falsch angezeigt wird, kann die Logistik nicht mehr zuverlässig bedient werden.`,
  },
  {
    target: {
      supplyChainId: 2,
      stageId: 'storage',
      requiredItems: ['blueprint', 'fake-identity-card'],
    },
    description: `Nutzt Sicherheitslücken aus, um unbefugten Zugriff auf Lagerbestände zu erhalten, und stehlt wertvolle Waren aus dem Lager.`,
  },

  // ----

  {
    target: { supplyChainId: 1, stageId: 'sales', requiredItems: ['fake-identity-card', 'cloud'] },
    description: `Gebt falsche Bestellungen auf und tätigt gefälschte Zahlungen. Die Verzögerungen in der Lieferkette und die Umsatzverluste werden für das Unternehmen schmerzhaft sein.`,
  },
  {
    target: { supplyChainId: 2, stageId: 'sales', requiredItems: ['usb-stick', 'virus'] },
    description: `Verbreitet einen bösartigen Computervirus in den Systemen der Vertriebspartner. Der Virus tarnt sich als legitime Software und infiziert unbemerkt die Systeme.`,
  },
  {
    target: {
      supplyChainId: 0,
      stageId: 'sales',
      requiredItems: ['gun', 'tools'],
    },
    description: `Führt gezielte Diebstähle und Überfälle aus, um Warenbestände zu reduzieren und zu beschädigen.`,
  },

  // ----

  {
    target: { supplyChainId: 2, stageId: 'datacenter', requiredItems: ['data-exchange', 'virus'] },
    description: `Führe einen Netzwerkangriff auf das Rechenzentrum durch, indem du die Server mit Traffic flutest. Die Überlastung wird zu Systemausfällen und Unterbrechungen führen.`,
  },
  {
    target: { supplyChainId: 1, stageId: 'datacenter', requiredItems: ['data-exchange', 'cloud'] },
    description: `Sabotiert die Backup-Systeme, um Datenverluste zu verursachen und die Wiederherstellung der Systeme zu erschweren.`,
  },
  {
    target: {
      supplyChainId: 0,
      stageId: 'datacenter',
      requiredItems: ['fake-identity-card', 'cloud'],
    },
    description: `Versendet eine Phishing-E-Mail an einen Rechenzentrumsmitarbeiter, um Zugang zu seinen Anmeldedaten zu erhalten und das Rechenzentrum zu sabotieren.`,
  },
]
