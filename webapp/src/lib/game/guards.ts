import type { SharedGameContext } from '$lib/game/types'

export const sharedGuards: { [key: string]: (details: { context: SharedGameContext }) => boolean } =
  {
    // TODO
    gameFinished: () => false,
    /** All users have been assigned a side, and there is at least one admin on both sides */
    allSidesAssigned: ({ context }) =>
      context.users.every((user) => user.isSideAssigned) &&
      !!context.users.find((user) => user.side === 'defense' && user.isAdmin) &&
      !!context.users.find((user) => user.side === 'attack' && user.isAdmin),
    /** The admin said that they finished assigning the sides */
    finishedAssigningSides: ({ context }) => context.finishedAssigningSides,
    /** Both, defense and attack has all players configured */
    allRolesAssigned: ({ context }) =>
      context.attack.attacker.isConfigured &&
      context.defense.defenders.every((defender) => defender.isConfigured),
    // TODO
    finishedAssigningRoles: ({ context }) =>
      context.attack.finishedAssigning && context.defense.finishedAssigning,
    attackerShouldBeVisible: () => false,
    attackerShouldBeInvisible: () => false,
  }
