import { FC } from 'react'
import { Box, BoxProps } from './Box'

export const OrangeBox: FC<BoxProps> = ({ children, customCss }) => (
  <Box backgroundColor="orange" customCss={customCss}>
    {children}
  </Box>
)
