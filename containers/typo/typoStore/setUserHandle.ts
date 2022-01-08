import { typoStore } from '.'

export function setUserHandle(userHandle: string) {
  typoStore.setState({ userHandle })
}
