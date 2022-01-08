import { assign } from '@xstate/immer'
import { createMachine } from 'xstate'
import { clearUserHandle } from './typoStore'

export enum State {
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
}

export enum Event {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
}

enum Action {
  logIn = 'logIn',
}

export const typoMachine = createMachine<any>(
  {
    id: 'typo',
    initial: State.loggedOut,
    context: {
      userHandle: undefined,
    },
    states: {
      [State.loggedIn]: {
        on: {
          [Event.LOG_OUT]: {
            actions: assign((context) => {
              context.userHandle = undefined
              clearUserHandle()
            }),
            target: State.loggedOut,
          },
        },
      },
      [State.loggedOut]: {
        on: {
          [Event.LOG_IN]: {
            actions: [Action.logIn],
            target: State.loggedIn,
          },
        },
      },
    },
  },
  {
    actions: {
      [Action.logIn]: assign((context, { userHandle }) => {
        context.userHandle = userHandle
      }),
    },
  }
)
