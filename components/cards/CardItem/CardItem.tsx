import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import styles from './styles.module.scss'

export const CardItem: FC<ComponentProps> = ({ children, customCss }) => {
  return <div className={classNames(styles.styles, customCss)}>{children}</div>
}
