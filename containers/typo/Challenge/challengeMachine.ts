import { assign } from '@xstate/immer'
import { Realtime } from 'ably'
import { upsertScore } from 'helpers/cosmosdb/upsertScore'
import { sumBy } from 'lodash'
import { createMachine, EventObject, send } from 'xstate'

const ABLY_API_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY
const ABLY_CHANNEL_NAME = process.env.NEXT_PUBLIC_ABLY_CHANNEL_NAME

export enum State {
  ready = 'ready',
  init = 'init',
  playing = 'playing',
  finished = 'finished',
}

export enum Event {
  DONE = 'DONE',
  SET_CHALLENGES = 'SET_CHALLENGES',
  INIT = 'INIT',
  START = 'START',
}

enum Action {
  addCompletedChallenge = 'addCompletedChallenge',
  init = 'init',
  startNextChallenge = 'startNextChallenge',
  publishToAbly = 'publishToAbly',
  writeToCosmos = 'writeToCosmos',
}

enum Service {
  ablyPublisher = 'ablyPublisher',
}

export interface CompletedChallenge {
  challengeSequence: number
  wpm: number
}

export const challengeMachine = createMachine(
  {
    id: 'challenge',
    initial: State.init,
    context: {
      averageWpm: 0,
      challenges: [] as string[],
      completedChallenges: [] as CompletedChallenge[],
      currentChallenge: '',
      userHandle: '',
      currentChallengeSequence: 0,
      totalChallenges: 0,
      score: {},
    },
    states: {
      [State.init]: {
        on: {
          [Event.INIT]: {
            actions: [Action.init],
            target: State.ready,
          },
        },
      },
      [State.ready]: {
        on: {
          [Event.START]: {
            target: State.playing,
          },
        },
      },
      [State.playing]: {
        entry: [Action.startNextChallenge],
        always: {
          target: State.init,
          cond: (context) =>
            context.currentChallengeSequence > context.totalChallenges,
        },
        invoke: [{ src: Service.ablyPublisher }],
        on: {
          [Event.DONE]: {
            actions: [
              Action.addCompletedChallenge,
              Action.publishToAbly,
              Action.writeToCosmos,
              Action.startNextChallenge,
            ],
          },
        },
      },
      [State.finished]: { type: 'final' },
    },
  },
  {
    actions: {
      [Action.addCompletedChallenge]: assign(
        (
          context,
          { challengeSequence, wpm }: EventObject & CompletedChallenge
        ) => {
          context.completedChallenges.push({ challengeSequence, wpm })
          context.averageWpm = Math.floor(
            sumBy(context.completedChallenges, (obj) => obj.wpm) /
              context.completedChallenges.length
          )

          context.score = {
            userHandle: context.userHandle,
            completed: context.completedChallenges
              .map(
                (elem: CompletedChallenge) =>
                  `${elem.challengeSequence}:${elem.wpm}`
              )
              .join(','),
            averageWpm: context.averageWpm,
          }
        }
      ),

      // https://xstate.js.org/docs/guides/actions.html#send-action
      [Action.publishToAbly]: send(
        (context: any) => {
          return {
            type: Event.DONE,
            value: context.score,
          }
        },
        { to: Service.ablyPublisher }
      ),

      [Action.init]: assign((context, { userHandle, challenges }: any) => {
        context.challenges = challenges
        context.userHandle = userHandle
        context.totalChallenges = challenges.length
      }),
      [Action.startNextChallenge]: assign((context) => {
        context.currentChallengeSequence += 1
        context.currentChallenge =
          context.challenges[context.currentChallengeSequence - 1]
      }),
      [Action.writeToCosmos]: (context) => {
        upsertScore(context.score)
      },
    },
    services: {
      [Service.ablyPublisher]: () => (_callback, onReceive) => {
        const ablyClient = new Realtime(ABLY_API_KEY)
        const channel = ablyClient.channels.get(ABLY_CHANNEL_NAME)

        onReceive((eventFromParent) => {
          const { value: data } = eventFromParent

          channel.publish({ name: ABLY_CHANNEL_NAME, data })
        })

        // perform cleanup
        return () => channel.unsubscribe()
      },
    },
  }
)
