import { useMachine } from '@xstate/react'
import { Button, Col, Input, Row } from 'antd'
import { BorderedBox } from 'components/boxes'
import { CenterFlexWrap } from 'components/flex'
import { MarginBottom3, MarginTop3 } from 'components/margins'
import { FC, useEffect } from 'react'
import type { CompletedChallenge } from '../Challenge/challengeMachine'
import styles from './styles.module.scss'
import { Event, State, typingSpeedMachine } from './typingSpeedMachine'

interface Props {
  challengeString: string
  onDone?: (args: Pick<CompletedChallenge, 'wpm'>) => void
}

export const TypingSpeed: FC<Props> = ({ challengeString, onDone }) => {
  const [state, send] = useMachine(typingSpeedMachine)

  useEffect(() => {
    send(Event.INIT, { challengeString })
  }, [challengeString])

  useEffect(() => {
    if (!state.matches(State.completed)) return
    if (!onDone) return

    onDone({ wpm: state.context.wordsPerMinute })
    send(Event.INIT)
  }, [state.value])

  return (
    <section className={styles.styles}>
      <p>typingSpeedMachine: {state.value}</p>
      <CenterFlexWrap>
        <BorderedBox>
          Characters: {state.context.characterCount} (
          {state.context.charactersPerSecond} chars/s)
        </BorderedBox>
        <BorderedBox>
          Words: {state.context.wordCount} ({state.context.wordsPerMinute}{' '}
          words/min)
        </BorderedBox>
        <BorderedBox>
          Elapsed duration: {state.context.elapsedDurationInSeconds} second(s)
        </BorderedBox>
        <BorderedBox>State: {state.value}</BorderedBox>
      </CenterFlexWrap>
      <MarginTop3>
        <div className={styles.resultString}>
          {state.context.resultString.map((elem, idx) => (
            <span className={styles[elem.status]} key={idx}>
              {elem.char}
            </span>
          ))}
        </div>
      </MarginTop3>
      <MarginBottom3>
        <Row gutter={8}>
          <Col span={20}>
            <Input
              autoFocus
              allowClear
              autoCapitalize="off"
              autoComplete="bday" // autocomplete="bday" stops Safari auto suggestions
              autoCorrect="off"
              disabled={state.matches(State.stopped)}
              value={state.context.value}
              onChange={(e) =>
                send(Event.DID_TYPE, { value: e.currentTarget.value })
              }
            />
          </Col>
          <Col span={2}>
            <Button
              danger
              type="primary"
              disabled={!state.matches(State.active)}
              onClick={() => send(Event.STOP_TYPING)}
            >
              Abort!
            </Button>
          </Col>
        </Row>
      </MarginBottom3>
    </section>
  )
}
