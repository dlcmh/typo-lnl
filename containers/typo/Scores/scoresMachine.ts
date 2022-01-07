import { assign } from '@xstate/immer'
import { Realtime } from 'ably'
import { fetchScores } from 'helpers/cosmosdb/fetchScores'
import { createMachine, DoneInvokeEvent, send } from 'xstate'

const ABLY_API_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY
const ABLY_CHANNEL_NAME = process.env.NEXT_PUBLIC_ABLY_CHANNEL_NAME

export enum State {
  active = 'active',
  fetchingScores = 'fetchingScores',
}
enum Event {
  SCORES_FETCHED = 'SCORES_FETCHED',
  SCORE_FROM_ABLY = 'SCORE_FROM_ABLY',
}
type MachineEvent =
  | { type: Event.SCORE_FROM_ABLY; value: Score }
  | { type: Event.SCORES_FETCHED }
interface MachineContext {
  scores: Score[]
}
enum Service {
  ablySubscriber = 'ablySubscriber',
}
enum Action {
  updateWithFetchedScores = 'updateWithFetchedScores',
  updateWithScoreFromAbly = 'updateWithScoreFromAbly',
}
type Score = {
  id: string
  userHandle: string
  completed: string
  averageWpm: number
}

const fetchScoresStates = {
  initial: 'fetching',
  states: {
    fetching: {
      invoke: {
        src: () => fetchScores,
        onDone: 'fetched',
      },
    },
    fetched: {
      type: 'final',
    },
  },
}

export const scoresMachine = createMachine<MachineContext, MachineEvent>(
  {
    id: 'scores',
    initial: State.fetchingScores,
    context: {
      scores: [],
    },
    states: {
      [State.fetchingScores]: {
        on: {
          [Event.SCORES_FETCHED]: {
            actions: [Action.updateWithFetchedScores],
            target: State.active,
          },
        },

        // child states
        initial: 'lol',
        states: {
          lol: {
            invoke: [
              {
                src: () => fetchScores,
                onDone: {
                  actions: [
                    send((_context, event) => {
                      console.log('dlc event', event)
                      return {
                        type: Event.SCORES_FETCHED,
                        data: event.data,
                      }
                    }),
                  ],
                },
              },
            ],
          },
        },
      },
      [State.active]: {
        on: {
          [Event.SCORE_FROM_ABLY]: {
            actions: [Action.updateWithScoreFromAbly],
          },
        },
        invoke: [
          { src: Service.ablySubscriber },
          // {
          //   src: () => fetchScores,
          //   onDone: { actions: [Action.updateWithFetchedScores] },
          // },
        ],
        // initial: 'lol',
        // states: {
        //   lol: {
        //     entry: () => {
        //       console.log('lol')
        //     },
        //   },
        // },
      },
    },
  },
  {
    actions: {
      // onDone/onError events in machine options
      // https://xstate.js.org/docs/guides/typescript.html#ondone-onerror-events-in-machine-options
      [Action.updateWithFetchedScores]: assign((context, e: any) => {
        const event: DoneInvokeEvent<Score[]> = e
        const { data } = event

        context.scores = data.map((score) => ({
          id: score.id,
          userHandle: score.userHandle,
          completed: score.completed,
          averageWpm: score.averageWpm,
        }))
      }),

      // Events in machine options
      // https://xstate.js.org/docs/guides/typescript.html#events-in-machine-options
      [Action.updateWithScoreFromAbly]: assign((context, event) => {
        if (event.type !== Event.SCORE_FROM_ABLY) return
        const { value } = event

        const scores = context.scores
        const index = scores.findIndex(
          (score) => score.userHandle === value.userHandle
        )

        // https://immerjs.github.io/immer/update-patterns/#array-mutations
        if (index !== -1) {
          scores[index] = value
        } else {
          scores.push(value)
        }
      }),
    },
    services: {
      // invoking callbacks - https://gist.github.com/dlcmh/40a8a6bcaf0a2e947c2b03aa9b6bf675#gistcomment-4018384
      // - callback sends events back to the parent
      // - onReceive listens for events sent from parent
      [Service.ablySubscriber]: () => (callback) => {
        const ablyClient = new Realtime(ABLY_API_KEY)
        const channel = ablyClient.channels.get(ABLY_CHANNEL_NAME)

        channel.subscribe((ablyMessage) => {
          const { data }: { data: Score } = ablyMessage

          callback({
            type: Event.SCORE_FROM_ABLY,
            value: data,
          })
        })

        // perform cleanup
        return () => channel.unsubscribe()
      },
    },
  }
)
