import { machine } from './machine'
import { fromPromise } from 'xstate'

export const clientMachine = machine.provide({
  actions: {
    consoleLogValue: ({ event }) => {
      console.log(event.value)
    },
    consoleLogValueAgain: ({ context }) => {
      console.log('context value 2: ', context)
    },
  },
  actors: {
    loadParticipants: fromPromise(async () => {
      return ['a', 'b']
    }),
  },
})
