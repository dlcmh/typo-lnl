import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import backgroundColors from './background-colors.module.scss'

interface Props {
  backgroundColor?: string
}

export type BoxProps = ComponentProps & Props

export const Box: FC<BoxProps> = ({
  backgroundColor = 'gray',
  customCss,
  children,
}) => {
  return (
    <div className={classNames(backgroundColors[backgroundColor], customCss)}>
      {children}
    </div>
  )
}
