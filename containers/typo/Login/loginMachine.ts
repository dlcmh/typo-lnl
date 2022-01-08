import { assign } from '@xstate/immer'
import { createMachine } from 'xstate'
import { setUserHandle } from '../typoStore/setUserHandle'

export const MIN_USER_HANDLE_LENGTH = 3

export enum State {
  ready = 'ready',
  userHandleIsValid = 'handleIsValid',
  submitted = 'submitted',
}

export enum Event {
  USER_HANDLE_ENTRY = 'USER_HANDLE_ENTRY',
  LOG_IN = 'LOG_IN',
}

enum Action {
  updateUserHandle = 'updateUserHandle',
}

const userHandleIsValid = (handle: string) =>
  (handle || '').length >= MIN_USER_HANDLE_LENGTH

export const loginMachine = createMachine<any>(
  {
    id: 'login',
    initial: State.ready,
    context: {
      userHandle: undefined,
    },
    states: {
      [State.ready]: {
        always: {
          target: State.userHandleIsValid,
          cond: (context) => userHandleIsValid(context.userHandle),
        },
        on: {
          [Event.USER_HANDLE_ENTRY]: { actions: [Action.updateUserHandle] },
        },
      },
      [State.userHandleIsValid]: {
        always: {
          target: State.ready,
          cond: (context) => !userHandleIsValid(context.userHandle),
        },
        on: {
          [Event.LOG_IN]: {
            target: [State.submitted],
          },
          [Event.USER_HANDLE_ENTRY]: { actions: [Action.updateUserHandle] },
        },
      },
      [State.submitted]: {
        // https://xstate.js.org/docs/guides/final.html#api
        // https://xstate.js.org/docs/guides/communication.html#done-data
        type: 'final',
      },
    },
  },
  {
    actions: {
      [Action.updateUserHandle]: assign((context, { value }) => {
        context.userHandle = value
        setUserHandle(value)
      }),
    },
  }
)
