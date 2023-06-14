import { onDestroy } from 'svelte'
import { type Readable, readable } from 'svelte/store'
import {
  type AnyStateMachine,
  type AreAllImplementationsAssumedToBeProvided,
  type InternalMachineImplementations,
  interpret,
  type InterpreterFrom,
  type InterpreterOptions,
  type StateFrom,
} from 'xstate'

type Prop<T, K> = K extends keyof T ? T[K] : never

type RestParams<TMachine extends AnyStateMachine> = AreAllImplementationsAssumedToBeProvided<
  TMachine['__TResolvedTypesMeta']
> extends false
  ? [
      options: InterpreterOptions<TMachine> &
        InternalMachineImplementations<
          TMachine['__TContext'],
          TMachine['__TEvent'],
          TMachine['__TResolvedTypesMeta'],
          true
        >,
    ]
  : [
      options?: InterpreterOptions<TMachine> &
        InternalMachineImplementations<
          TMachine['__TContext'],
          TMachine['__TEvent'],
          TMachine['__TResolvedTypesMeta']
        >,
    ]

export type UseMachineReturn<
  TMachine extends AnyStateMachine,
  TInterpreter = InterpreterFrom<TMachine>,
> = {
  state: Readable<StateFrom<TMachine>>
  send: Prop<TInterpreter, 'send'>
  service: TInterpreter
}

export function useMachine<TMachine extends AnyStateMachine>(
  machine: TMachine,
  ...[options = {}]: RestParams<TMachine>
): UseMachineReturn<TMachine> {
  const { guards, actions, actors, delays, ...interpreterOptions } = options

  const machineConfig = {
    guards,
    actions,
    actors,
    delays,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedMachine = machine.provide(machineConfig as any)

  const service = interpret(resolvedMachine, interpreterOptions).start()

  onDestroy(() => service.stop())

  const state = readable(service.getSnapshot(), (set) => {
    return service.subscribe((state) => {
      if (state.changed) {
        set(state)
      }
    }).unsubscribe
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { state, send: service.send, service } as any
}
