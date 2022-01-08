import { useMachine } from '@xstate/react'
import { Button } from 'antd'
import { FC } from 'react'
import { Event, profileMachine } from './profileMachine'

const nullOnLogout = () => {}

interface Props {
  onLogout: () => void
}

export const Profile: FC<Props> = ({ onLogout = nullOnLogout }) => {
  const [state, send] = useMachine(profileMachine)

  return (
    <div>
      <h4>s {state.context.userHandle}</h4>
      <h3>{state.context.userHandle} in da house!</h3>
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
    </div>
  )
}
