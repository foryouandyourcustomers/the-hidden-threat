import { machine } from '$lib/logic/machine'
import { assign } from 'xstate'

export const configuredMachine = () => {
  return machine.withConfig({
    actions: {
      consoleLogValue: (context, event) => {
        console.log('context value 1: ', context.value)
        console.log(event.value)
      },
      consoleLogValueAgain: (context) => {
        console.log('context value 2: ', context.value)
      },
      setValue: assign((context, event) => ({
        value: event.value,
      })),
    },
    services: {
      loadParticipants: async () => {
        return ['a', 'b']
      },
    },
  })
}
