import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react'

export interface BaseButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  buttonType?: 'primary' | 'danger'
}

export const BaseButton: FC<BaseButtonProps> = ({
  buttonType = 'primary',
  children,
  ...rest
}) => {
  return (
    <button className={`btn btn-${buttonType}`} {...rest}>
      {children}
    </button>
  )
}
