import type { SharedGameContext } from '$lib/game/types'

export const sharedGuards = {
  // TODO
  gameNotStarted: () => true,
  // TODO
  gameFinished: () => false,
  gameStarted: () => false,
  allSidesAssigned: ({ context }: { context: SharedGameContext }) =>
    context.users.find((user) => user.side === undefined) === undefined,
  finishedAssigningSides: () => false,
  allRolesAssigned: () => false,
  finishedAssigningRoles: () => false,
  attackerShouldBeVisible: () => false,
  attackerShouldBeInvisible: () => false,
}
