import type { Coordinate } from '../types'
import type { StageId } from './stages'

export type BoardStage = {
  id: StageId
  coordinate: Coordinate
}

export const BOARD_SUPPLY_CHAINS: BoardStage[][] = [
  [
    { id: 'supply', coordinate: [2, 0] },
    { id: 'production', coordinate: [0, 0] },
    { id: 'storage', coordinate: [1, 2] },
    { id: 'datacenter', coordinate: [1, 3] },
    { id: 'logistics', coordinate: [2, 3] },
    { id: 'sales', coordinate: [0, 4] },
  ],

  [
    { id: 'supply', coordinate: [1, 6] },
    { id: 'production', coordinate: [3, 6] },
    { id: 'storage', coordinate: [4, 5] },
    { id: 'datacenter', coordinate: [5, 6] },
    { id: 'logistics', coordinate: [5, 7] },
    { id: 'sales', coordinate: [6, 6] },
  ],
  [
    { id: 'supply', coordinate: [7, 4] },
    { id: 'production', coordinate: [8, 3] },
    { id: 'storage', coordinate: [7, 1] },
    { id: 'logistics', coordinate: [5, 1] },
    { id: 'datacenter', coordinate: [4, 1] },
    { id: 'sales', coordinate: [4, 3] },
  ],
]
