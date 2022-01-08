import { useMachine } from '@xstate/react'
import { Button, Input } from 'antd'
import { FC } from 'react'
import {
  Event,
  loginMachine,
  MIN_USER_HANDLE_LENGTH,
  State,
} from './loginMachine'
import styles from './styles.module.scss'

const nullOnLogin = () => {}

interface Props {
  onLogin?: ({ userHandle }: { userHandle: string }) => void
}

export const Login: FC<Props> = ({ onLogin = nullOnLogin }) => {
  const [state, send] = useMachine(loginMachine)

  const logIn = () => onLogin({ userHandle: state.context.userHandle })

  return (
    <div className={styles.styles}>
      <h4>loginMachine {state.value}</h4>
      <p>
        Enter your user handle ({MIN_USER_HANDLE_LENGTH} characters minimum):
      </p>
      <p>
        <Input
          autoFocus
          autoCorrect="off"
          onChange={(event: any) => {
            send({
              type: Event.USER_HANDLE_ENTRY,
              value: event.target.value,
            })
          }}
          onKeyPress={(event: any) => {
            if (
              event.key === 'Enter' &&
              state.matches(State.userHandleIsValid)
            ) {
              logIn()
            }
          }}
        />
      </p>
      <p>
        <Button
          disabled={!state.matches(State.userHandleIsValid)}
          onClick={() => logIn()}
          type="primary"
        >
          Log in
        </Button>
      </p>
    </div>
  )
}
