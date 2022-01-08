import { typoStore } from '.'

export function clearUserHandle() {
  typoStore.setState({ userHandle: '' })
}
