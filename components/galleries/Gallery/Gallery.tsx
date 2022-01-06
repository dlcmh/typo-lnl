import classNames from 'classnames'
import { ComponentProps } from 'components/types'
import { FC } from 'react'
import gallery from './Gallery.module.scss'

function ItemFn(elem: any) {
  return <div>{elem}</div>
}

interface Props {
  items: any[]
  itemFn?: () => JSX.Element
}

export const Gallery: FC<ComponentProps & Props> = ({
  customCss,
  items,
  itemFn = ItemFn,
}) => {
  return (
    <div className={classNames(gallery.base, customCss)}>
      {items.map((elem, idx) => (
        <div key={idx} className={gallery.card}>
          {itemFn(elem)}
        </div>
      ))}
    </div>
  )
}
