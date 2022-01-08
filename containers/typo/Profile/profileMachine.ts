import { assign } from '@xstate/immer'
import { createMachine } from 'xstate'
import { typoStore } from '../typoStore'

export enum State {
  userHandleIsValid = 'handleIsValid',
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
}

export enum Event {
  LOG_OUT = 'LOG_OUT',
}

interface Context {
  userHandle: string
}

export const profileMachine = createMachine<Context>({
  id: 'newProfile',
  initial: State.loggedIn,
  context: {
    userHandle: '',
  },
  states: {
    [State.loggedIn]: {
      entry: assign((context) => {
        context.userHandle = typoStore.getState().userHandle || ''
      }),
      on: {
        [Event.LOG_OUT]: [State.loggedOut],
      },
    },
    [State.loggedOut]: { type: 'final' },
  },
})
