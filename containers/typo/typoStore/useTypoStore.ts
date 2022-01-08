import create from 'zustand'

type State = {
  userHandle?: string
}

export const useTypoStore = create<State>(() => ({}))
