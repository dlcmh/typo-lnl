import { getWords } from './getWords'

export function getSanitizedString(str: string) {
  return getWords(str).join(' ')
}
