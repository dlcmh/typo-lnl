// https://dev.to/coolgoose/quick-and-easy-way-of-counting-utf-8-characters-in-javascript-23ce

import { getUtfCharacters } from './getUtfCharacters'

export function getUtfCharacterCount(str: string) {
  return getUtfCharacters(str).length
}
