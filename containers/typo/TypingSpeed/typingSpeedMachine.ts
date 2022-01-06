import { assign } from '@xstate/immer'
import { createMachine } from 'xstate'
import { getUtfCharacterCount, getWords } from './utils'

export enum Event {
  DID_TYPE = 'DID_TYPE',
  INIT = 'INIT',
  STOP_TYPING = 'STOP_TYPING',
  TICK = 'TICK',
  NEXT_CHALLENGE_INIT = 'NEXT_CHALLENGE_INIT',
}

export enum State {
  active = 'active',
  init = 'init',
  ready = 'ready',
  stopped = 'stopped',
  completed = 'completed',
}

enum Action {
  setup = 'setup',
  updateTypedValue = 'updateTypedValue',
  updateTimer = 'updateTimer',
}

const Service = {
  timer: { src: 'timer' },
}

enum Status {
  correct = 'correct',
  unattempted = 'unattempted',
  wrong = 'wrong',
}
type Statuses = `${Status}`

export const typingSpeedMachine = createMachine(
  {
    id: 'typing-speed',
    initial: State.init,
    context: {
      characterCount: 0,
      wordCount: 0,
      value: '',
      intervalInSeconds: 1,
      elapsedDurationInSeconds: 0,
      charactersPerSecond: 0,
      wordsPerMinute: 0,
      challengeString: 'defaultChallengeString',
      resultString: [] as {
        char: string
        status: Statuses
      }[],
    },
    states: {
      [State.init]: {
        on: {
          [Event.INIT]: {
            actions: [Action.setup],
            target: State.ready,
          },
        },
      },
      [State.ready]: {
        on: {
          [Event.DID_TYPE]: {
            actions: [Action.updateTypedValue],
            target: State.active,
          },
        },
      },
      [State.active]: {
        invoke: [Service.timer],
        always: {
          // https://xstate.js.org/docs/guides/transitions.html#eventless-always-transitions
          target: State.completed,
          cond: (context) => context.challengeString === context.value,
        },
        on: {
          [Event.DID_TYPE]: [
            {
              actions: [Action.updateTypedValue],
            },
          ],
          [Event.STOP_TYPING]: { target: State.stopped },
          [Event.TICK]: { actions: [Action.updateTimer] },
        },
      },
      [State.stopped]: {},
      [State.completed]: {
        on: {
          [Event.INIT]: State.init,
        },
      },
    },
  },
  {
    actions: {
      [Action.setup]: assign((context, { challengeString }: any) => {
        context.value = ''

        context.elapsedDurationInSeconds = 0
        context.charactersPerSecond = 0
        context.wordsPerMinute = 0

        const resultString = [...challengeString].map((char) => ({
          char,
          status: Status.unattempted,
        }))
        context.challengeString = challengeString
        context.resultString = resultString
      }),
      [Action.updateTypedValue]: assign((context, { value }: any) => {
        const words = getWords(value)
        context.wordCount = words.length
        context.characterCount = getUtfCharacterCount(words.join(''))
        context.value = value

        const typedChars = [...value]
        context.resultString = [...context.challengeString].map((char, idx) => {
          let status: Statuses
          const typedChar = typedChars[idx]
          if (typedChar === undefined) {
            status = Status.unattempted
          } else if (typedChar !== char) {
            status = Status.wrong
          } else {
            status = Status.correct
          }
          return {
            char,
            status,
          }
        })
      }),
      [Action.updateTimer]: assign((context) => {
        const newDuration =
          context.elapsedDurationInSeconds + context.intervalInSeconds

        context.elapsedDurationInSeconds = newDuration
        context.charactersPerSecond = Math.floor(
          context.characterCount / newDuration
        )
        context.wordsPerMinute = Math.floor(
          context.wordCount / (newDuration / 60)
        )
      }),
    },
    services: {
      [Service.timer.src]: (context) => (callback) => {
        // https://xstate.js.org/docs/tutorials/7guis/timer.html#coding
        const interval = setInterval(() => {
          callback(Event.TICK)
        }, 1000 * context.intervalInSeconds)

        // perform cleanup
        return () => clearInterval(interval)
      },
    },
  }
)
