import { createMachine } from 'xstate'

export enum State {
  userHandleIsValid = 'handleIsValid',
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
}

export enum Event {
  LOG_OUT = 'LOG_OUT',
}

export const profileMachine = (userHandle: string) =>
  createMachine<any>({
    id: 'profile',
    initial: State.loggedIn,
    context: {
      userHandle: userHandle,
    },
    states: {
      [State.loggedIn]: {
        on: {
          [Event.LOG_OUT]: [State.loggedOut],
        },
      },
      [State.loggedOut]: { type: 'final' },
    },
  })
