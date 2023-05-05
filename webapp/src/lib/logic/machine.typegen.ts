// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {
    loadParticipants: 'done.invoke.(machine).Ingame.Initial:invocation[0]'
  }
  missingImplementations: {
    actions: 'consoleLogValue' | 'consoleLogValueAgain' | 'setValue'
    delays: never
    guards: never
    services: 'loadParticipants'
  }
  eventsCausingActions: {
    consoleLogValue: 'userStartsGame'
    consoleLogValueAgain: 'userStartsGame'
    setValue: 'userStartsGame'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {}
  eventsCausingServices: {
    loadParticipants: 'userStartsGame'
  }
  matchesStates: 'Ingame' | 'Ingame.Initial' | 'Initial' | { Ingame?: 'Initial' }
  tags: never
}
