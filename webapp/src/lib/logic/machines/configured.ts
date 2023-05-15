import { machine } from '$lib/logic/machines/machine'
import { assign } from 'xstate'

export const configuredMachine = ({ gameId }: { gameId: string }) => {
  return machine.withConfig(
    {
      actions: {
        consoleLogValue: (context, event) => {
          console.log(event.value)
        },
        consoleLogValueAgain: (context) => {
          console.log('context value 2: ', context)
        },
      },
      services: {
        loadParticipants: async () => {
          return ['a', 'b']
        },
      },
    },
    {
      gameId,
    },
  )
}
