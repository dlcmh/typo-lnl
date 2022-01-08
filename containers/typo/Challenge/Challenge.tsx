import { useMachine } from '@xstate/react'
import { Button } from 'antd'
import { FC, useEffect } from 'react'
import { useTypoStore } from '../typoStore/useTypoStore'
import { TypingSpeed } from '../TypingSpeed'
import { challengeMachine, Event, State } from './challengeMachine'
import styles from './styles.module.scss'
import { BorderTop } from 'components/borders'

// const CHALLENGES = ['The quick brown fox jumped over the lazy dog.']
const CHALLENGES = [
  'The quick brown fox jumped over the lazy dog.',
  "Around the table's verge was spread",
  'They debate with zeal economics, immigration, and labor questions.',
]

interface Props {
  userHandle: string
}

export const Challenge: FC<Props> = ({ userHandle }) => {
  const [state, send] = useMachine(challengeMachine)
  const handle = useTypoStore((state) => state.userHandle)

  useEffect(() => {
    send(Event.INIT, { userHandle, challenges: CHALLENGES })
  }, [])

  const {
    completedChallenges,
    currentChallenge,
    currentChallengeSequence,
    totalChallenges,
    challenges,
  } = state.context

  return (
    <BorderTop customCss={styles.styles}>
      <h4>handle {handle}</h4>
      <h4>
        challengeMachine {state.value}
        {state.matches(State.playing) &&
          `: ${currentChallengeSequence}/${totalChallenges}`}
      </h4>
      {state.matches(State.ready) && (
        <p>
          <Button onClick={() => send(Event.START)} type="primary">
            Start
          </Button>
        </p>
      )}
      {state.matches(State.playing) && (
        <TypingSpeed
          challengeString={currentChallenge}
          onDone={({ wpm }) =>
            send(Event.DONE, {
              challengeSequence: currentChallengeSequence,
              wpm,
            })
          }
        />
      )}
      {!!completedChallenges.length && (
        <div className={styles.ownScores}>
          <div>(seq:wpm:text)</div>
          {completedChallenges.map((completedChallenge: any) => {
            const { challengeSequence, wpm } = completedChallenge
            return (
              <li key={challengeSequence}>
                {challengeSequence}:{wpm}:{challenges[challengeSequence - 1]}
              </li>
            )
          })}
        </div>
      )}
    </BorderTop>
  )
}
