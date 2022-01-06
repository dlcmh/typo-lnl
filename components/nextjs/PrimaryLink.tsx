import NextLink from 'next/link'
import { FC } from 'react'
import { DefaultChildren, DEFAULT_HREF } from './constants'

interface Props {
  href?: string
}

export const PrimaryLink: FC<Props> = ({
  children = <DefaultChildren />,
  href = DEFAULT_HREF,
}) => {
  return (
    <NextLink href={href}>
      <a className="link-primary">{children}</a>
    </NextLink>
  )
}
