import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import styles from './styles.module.scss'

export const BlueBox: FC<ComponentProps> = ({ customCss, children }) => {
  return <div className={classNames(styles.styles, customCss)}>{children}</div>
}
