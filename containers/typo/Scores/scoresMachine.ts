import { assign } from '@xstate/immer'
import { Realtime } from 'ably'
import { fetchScores } from 'helpers/cosmosdb/fetchScores'
import { createMachine, EventObject } from 'xstate'

const ABLY_API_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY
const ABLY_CHANNEL_NAME = process.env.NEXT_PUBLIC_ABLY_CHANNEL_NAME

enum State {
  active = 'active',
}
enum Service {
  ablySubscriber = 'ablySubscriber',
}
enum Event {
  SCORE_FROM_ABLY = 'SCORE_FROM_ABLY',
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
type ScoresFetchedEvent = EventObject & {
  data?: Score[]
}
interface ScoreFromAblyEvent extends EventObject {
  value: Score
}

export const scoresMachine = createMachine(
  {
    id: 'scores',
    initial: State.active,
    context: {
      scores: [] as Score[],
    },
    states: {
      [State.active]: {
        on: {
          [Event.SCORE_FROM_ABLY]: {
            actions: [Action.updateWithScoreFromAbly],
          },
        },
        invoke: [
          { src: Service.ablySubscriber },
          {
            src: () => fetchScores,
            onDone: { actions: [Action.updateWithFetchedScores] },
          },
        ],
      },
    },
  },
  {
    actions: {
      [Action.updateWithFetchedScores]: assign((context, e: any) => {
        const { data = [] } = e as ScoresFetchedEvent
        context.scores = data.map((score) => ({
          id: score.id,
          userHandle: score.userHandle,
          completed: score.completed,
          averageWpm: score.averageWpm,
        }))
      }),
      [Action.updateWithScoreFromAbly]: assign((context, e: any) => {
        const { value } = e as ScoreFromAblyEvent
        // https://immerjs.github.io/immer/update-patterns/#array-mutations
        const scores = context.scores
        const index = scores.findIndex(
          (score) => score.userHandle === value.userHandle
        )
        if (index !== -1) {
          scores[index] = value
        } else {
          scores.push(value)
        }
      }),
    },
    services: {
      // https://egghead.io/lessons/xstate-invoke-callbacks-to-send-and-receive-events-from-a-parent-xstate-machine
      // XState: Why I Love Invoked Callbacks - https://dev.to/mpocock1/xstate-why-i-love-invoked-callbacks-2f6i
      // https://xstate.js.org/docs/guides/communication.html#invoking-callbacks
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
