import { Button } from 'antd'
import { BorderTop } from 'components/borders'
import { FC } from 'react'
import { useTypoStore } from '../typoStore'

interface Props {
  onLogout: () => void
}

export const Profile: FC<Props> = ({ onLogout }) => {
  const userHandle = useTypoStore((state) => state.userHandle)

  return (
    <BorderTop>
      <h3>{userHandle} in da house!</h3>
      <p>
        <Button
          danger
          onClick={() => {
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
