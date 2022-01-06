import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import styles from './styles.module.scss'

function ItemFn(elem: any) {
  return <div>{elem}</div>
}

interface Props {
  items: any[]
  renderItem?: (elem: any) => JSX.Element
}

export const FlexBoxes: FC<ComponentProps & Props> = ({
  customCss,
  items,
  renderItem = ItemFn,
}) => {
  return (
    <div className={classNames(styles.base, customCss)}>
      {items.map((elem, idx) => {
        return (
          <div key={idx} className={styles.card}>
            {renderItem(elem)}
          </div>
        )
      })}
    </div>
  )
}
