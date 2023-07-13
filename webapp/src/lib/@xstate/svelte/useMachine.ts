import { onDestroy } from 'svelte'
import { readable, type Readable } from 'svelte/store'
import type {
  AnyStateMachine,
  AreAllImplementationsAssumedToBeProvided,
  InternalMachineImplementations,
  InterpreterFrom,
  InterpreterOptions,
  StateFrom,
} from 'xstate'
import { interpret } from 'xstate'

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

type UseMachineReturn<
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

  let snapshot = service.getSnapshot()

  const state = readable(snapshot, (set) => {
    return service.subscribe((nextSnapshot) => {
      if (snapshot !== nextSnapshot) {
        snapshot = nextSnapshot
        set(snapshot)
      }
    }).unsubscribe
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { state, send: service.send, service } as any
}
