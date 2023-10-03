import { throwIfNotFound } from '$lib/utils'
import isEqual from 'lodash/isEqual'
import type { Coordinate } from '../types'
import type { StageId } from './stages'

export type BoardStage = {
  id: StageId
  supplyChainId: number
  coordinate: Coordinate
}

export const BOARD_SUPPLY_CHAINS: BoardStage[][] = [
  [
    { supplyChainId: 0, id: 'supply', coordinate: [2, 0] },
    { supplyChainId: 0, id: 'production', coordinate: [0, 0] },
    { supplyChainId: 0, id: 'storage', coordinate: [1, 2] },
    { supplyChainId: 0, id: 'datacenter', coordinate: [1, 3] },
    { supplyChainId: 0, id: 'logistics', coordinate: [2, 3] },
    { supplyChainId: 0, id: 'sales', coordinate: [0, 4] },
  ],
  [
    { supplyChainId: 1, id: 'supply', coordinate: [1, 6] },
    { supplyChainId: 1, id: 'production', coordinate: [3, 6] },
    { supplyChainId: 1, id: 'storage', coordinate: [4, 5] },
    { supplyChainId: 1, id: 'datacenter', coordinate: [5, 6] },
    { supplyChainId: 1, id: 'logistics', coordinate: [5, 7] },
    { supplyChainId: 1, id: 'sales', coordinate: [6, 6] },
  ],
  [
    { supplyChainId: 2, id: 'supply', coordinate: [7, 4] },
    { supplyChainId: 2, id: 'production', coordinate: [8, 3] },
    { supplyChainId: 2, id: 'storage', coordinate: [7, 1] },
    { supplyChainId: 2, id: 'logistics', coordinate: [5, 1] },
    { supplyChainId: 2, id: 'datacenter', coordinate: [4, 1] },
    { supplyChainId: 2, id: 'sales', coordinate: [4, 3] },
  ],
]

export const getStageAt = (coordinate: Coordinate): BoardStage =>
  BOARD_SUPPLY_CHAINS.flat().find((stage) => isEqual(stage.coordinate, coordinate)) ??
  throwIfNotFound()
