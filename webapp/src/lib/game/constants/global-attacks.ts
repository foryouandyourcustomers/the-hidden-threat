import type { StageId } from './stages'

export type GlobalAttack = {
  targets: { stageId: StageId }[]
  description: string
}

type GlobalAttackScenario = { description: string; attacks: GlobalAttack[] }

export const GLOBAL_ATTACK_SCENARIOS: GlobalAttackScenario[] = [
  {
    description: 'Beschreibung des Szenarios 1',
    attacks: [
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'production' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'production' }, { stageId: 'supply' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'sales' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'sales' }, { stageId: 'datacenter' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
    ],
  },
  {
    description: 'Beschreibung des Szenarios 2',
    attacks: [
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'production' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'production' }, { stageId: 'supply' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'sales' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'sales' }, { stageId: 'datacenter' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
    ],
  },
  {
    description: 'Beschreibung des Szenarios 3',
    attacks: [
      {
        targets: [{ stageId: 'datacenter' }, { stageId: 'production' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'production' }, { stageId: 'supply' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'logistics' }, { stageId: 'sales' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
      {
        targets: [{ stageId: 'sales' }, { stageId: 'datacenter' }],
        description:
          'Schleust minderwertige und gefälschte Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle sowie Kundenbeschwerden.',
      },
    ],
  },
]
