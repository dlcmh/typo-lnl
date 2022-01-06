import { FC } from 'react'
import { BaseButton, BaseButtonProps } from './BaseButton'

export const DangerButton: FC<BaseButtonProps> = ({ children, ...rest }) => {
  return (
    <BaseButton buttonType="danger" {...rest}>
      {children}
    </BaseButton>
  )
}
