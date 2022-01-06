import classNames from 'classnames'
import grid from 'components/defaults/grid.module.scss'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import card from './Card.module.scss'

export const Card: FC<ComponentProps> = ({ customCss, children }) => {
  return (
    <div className={classNames(grid.base, card.base, customCss)}>
      {children}
    </div>
  )
}
