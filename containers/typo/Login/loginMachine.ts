import { assign } from '@xstate/immer'
import { createMachine } from 'xstate'

export const MIN_USER_HANDLE_LENGTH = 3

export enum State {
  userHandleIsValid = 'handleIsValid',
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
}

export enum Event {
  USER_HANDLE_ENTRY = 'USER_HANDLE_ENTRY',
  LOG_IN = 'LOG_IN',
}

enum Action {
  updateUserHandle = 'updateUserHandle',
}

export const loginMachine = createMachine<any>(
  {
    id: 'login',
    initial: State.loggedOut,
    context: {
      userHandle: undefined,
    },
    states: {
      [State.loggedIn]: {
        // https://xstate.js.org/docs/guides/final.html#api
        // https://xstate.js.org/docs/guides/communication.html#done-data
        type: 'final',
      },
      [State.loggedOut]: {
        always: {
          target: State.userHandleIsValid,
          cond: (context) =>
            (context.userHandle || '').length >= MIN_USER_HANDLE_LENGTH,
        },
        on: {
          [Event.USER_HANDLE_ENTRY]: { actions: [Action.updateUserHandle] },
        },
      },
      [State.userHandleIsValid]: {
        on: {
          [Event.LOG_IN]: {
            target: [State.loggedIn],
          },
          [Event.USER_HANDLE_ENTRY]: { actions: [Action.updateUserHandle] },
        },
      },
    },
  },
  {
    actions: {
      [Action.updateUserHandle]: assign((context, { value }) => {
        context.userHandle = value
      }),
    },
  }
)
