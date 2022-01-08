import { useMachine } from '@xstate/react'
import { Button } from 'antd'
import { BorderTop } from 'components/borders'
import { FC } from 'react'
import { Event, profileMachine } from './profileMachine'

const nullOnLogout = () => {}

interface Props {
  onLogout: () => void
}

export const Profile: FC<Props> = ({ onLogout = nullOnLogout }) => {
  const [state, send] = useMachine(profileMachine)

  return (
    <BorderTop>
      <h3>{state.context.userHandle} in da house!</h3>
      <h4>profileMachine {state.value}</h4>
      <p>
        <Button
          danger
          onClick={() => {
            send(Event.LOG_OUT)
            onLogout()
          }}
          type="primary"
        >
          Log out
        </Button>
      </p>
    </BorderTop>
  )
}
