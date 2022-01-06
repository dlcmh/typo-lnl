import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  canCancel?: boolean
  stopAutoCorrections?: boolean
}

const STOP_AUTOCOMPLETE_VALUE = 'bday' // autocomplete="bday" stops Safari auto suggestions
const STOP_AUTOCORRECTIONS_VALUE = 'off'

export const TextInput: FC<Props> = ({
  canCancel = true,
  stopAutoCorrections = false,
  ...rest
}) => {
  return (
    <input
      className="form-control"
      type={canCancel ? 'search' : 'text'}
      autoComplete={stopAutoCorrections ? STOP_AUTOCOMPLETE_VALUE : undefined}
      autoCapitalize={
        stopAutoCorrections ? STOP_AUTOCORRECTIONS_VALUE : undefined
      }
      autoCorrect={stopAutoCorrections ? STOP_AUTOCORRECTIONS_VALUE : undefined}
      {...rest}
    />
  )
}
