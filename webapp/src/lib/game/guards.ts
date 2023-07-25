import type { SharedGameContext } from '$lib/game/types'

export const sharedGuards = {
  // TODO
  gameNotStarted: () => true,
  // TODO
  gameFinished: () => false,
  gameStarted: () => false,
  allSidesAssigned: ({ context }: { context: SharedGameContext }) =>
    context.users.find((user) => user.side === undefined) === undefined &&
    !!context.users.find((user) => user.side === 'defender' && user.isAdmin) &&
    !!context.users.find((user) => user.side === 'attacker' && user.isAdmin),
  finishedAssigningSides: () => false,
  allRolesAssigned: () => false,
  finishedAssigningRoles: () => false,
  attackerShouldBeVisible: () => false,
  attackerShouldBeInvisible: () => false,
}
