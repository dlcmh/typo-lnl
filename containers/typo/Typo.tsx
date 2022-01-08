import { useMachine } from '@xstate/react'
import { Col, Row } from 'antd'
import { AntdBasePage } from 'components/layouts'
import { Scores } from './Scores'
import styles from 'styles/Typo.module.css'
import { Challenge } from './Challenge'
import { Login } from './Login'
import { Profile } from './Profile'
import { Event, State, typoMachine } from './typoMachine'

export function Typo() {
  const [state, send] = useMachine(typoMachine)

  return (
    <AntdBasePage title="The Typo Challenge">
      <section className={styles.typo}>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <a href="https://github.com/dlcmh/typo-lnl">GitHub repo</a>
            </p>
            <h4>typoMachine {state.value}</h4>
            {state.matches(State.loggedOut) && (
              <Login
                onLogin={({ userHandle }) => {
                  send(Event.LOG_IN, { userHandle })
                }}
              />
            )}

            {state.matches(State.loggedIn) && (
              <Profile onLogout={() => send(Event.LOG_OUT)} />
            )}

            {state.matches(State.loggedIn) && (
              <Challenge userHandle={state.context.userHandle} />
            )}
          </Col>
          <Col span={12}>
            <Scores />
          </Col>
        </Row>
      </section>
    </AntdBasePage>
  )
}
