import { onDestroy } from 'svelte'
import { type Readable, readable } from 'svelte/store'
import {
  type AnyStateMachine,
  type AreAllImplementationsAssumedToBeProvided,
  type InternalMachineImplementations,
  createActor,
  type ActorOptions,
  type StateFrom,
  type TODO,
  Actor,
} from 'xstate'

type Prop<T, K> = K extends keyof T ? T[K] : never

type RestParams<TMachine extends AnyStateMachine> = AreAllImplementationsAssumedToBeProvided<
  TMachine['__TResolvedTypesMeta']
> extends false
  ? [
      options: ActorOptions<TMachine> &
        InternalMachineImplementations<
          TMachine['__TContext'],
          TMachine['__TEvent'],
          TODO,
          TODO,
          TODO,
          TMachine['__TResolvedTypesMeta'],
          true
        >,
    ]
  : [
      options?: ActorOptions<TMachine> &
        InternalMachineImplementations<
          TMachine['__TContext'],
          TMachine['__TEvent'],
          TODO,
          TODO,
          TODO,
          TMachine['__TResolvedTypesMeta']
        >,
    ]

type UseMachineReturn<TMachine extends AnyStateMachine, TInterpreter = Actor<TMachine>> = {
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

  const service = createActor(resolvedMachine, interpreterOptions).start()

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
