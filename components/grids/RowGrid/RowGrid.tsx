import classNames from 'classnames'
import grid from 'components/defaults/grid.module.scss'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import rowGrid from './RowGrid.module.scss'

export const RowGrid: FC<ComponentProps> = ({ customCss, children }) => {
  return (
    <div className={classNames(grid.base, rowGrid.base, customCss)}>
      {children}
    </div>
  )
}
