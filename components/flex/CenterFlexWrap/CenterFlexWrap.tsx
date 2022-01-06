import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import { FlexWrap } from '..'
import styles from './styles.module.scss'

export const CenterFlexWrap: FC<ComponentProps> = ({ customCss, children }) => {
  return (
    <FlexWrap customCss={classNames(styles.styles, customCss)}>
      {children}
    </FlexWrap>
  )
}
