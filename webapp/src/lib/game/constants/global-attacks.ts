import type { DefenseItemId } from './items'
import type { StageId } from './stages'

export type GlobalAttack = {
  targets: { stageId: StageId; requiredItems: DefenseItemId[] }[]
  description: string
}

type GlobalAttackScenario = { description: string; attacks: GlobalAttack[] }

export const GLOBAL_ATTACK_SCENARIOS: GlobalAttackScenario[] = [
  {
    description: 'Beschreibung des Szenarios',
    attacks: [
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
    ],
  },
  {
    description: 'Beschreibung des Szenarios',
    attacks: [
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
    ],
  },
  {
    description: 'Beschreibung des Szenarios',
    attacks: [
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
      {
        targets: [
          { stageId: 'supply', requiredItems: ['alarm-system', 'certificate', 'extinguisher'] },
          { stageId: 'datacenter', requiredItems: ['insurance', 'gps-tracker', 'firewall'] },
        ],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowieKundenbeschwerden.',
      },
    ],
  },
]
