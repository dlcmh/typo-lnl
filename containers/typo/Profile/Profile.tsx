import { useMachine } from '@xstate/react'
import { Button } from 'antd'
import { FC } from 'react'
import { Event, profileMachine } from './profileMachine'

const nullOnLogout = () => {}

interface Props {
  onLogout: () => void
  userHandle?: string
}

export const Profile: FC<Props> = ({
  userHandle = '',
  onLogout = nullOnLogout,
}) => {
  const [state, send] = useMachine(profileMachine(userHandle))

  return (
    <div>
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
