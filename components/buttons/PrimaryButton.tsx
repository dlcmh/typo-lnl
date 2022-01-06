import { FC } from 'react'
import { BaseButton, BaseButtonProps } from './BaseButton'

export const PrimaryButton: FC<BaseButtonProps> = ({ children, ...rest }) => {
  return <BaseButton {...rest}>{children}</BaseButton>
}
