import { useState, useCallback } from 'react'
import type { User, Theme, AppState } from '@/types'

const initialState: AppState = {
  user: null,
  theme: 'system',
  isReady: false,
}

let listeners: Array<(state: AppState) => void> = []
let state = { ...initialState }

function notify() {
  listeners.forEach((l) => l(state))
}

export function getState() {
  return state
}

export function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial }
  notify()
}

export function useAppStore() {
  const [local, setLocal] = useState(state)

  const subscribe = useCallback(() => {
    listeners.push(setLocal)
    return () => {
      listeners = listeners.filter((l) => l !== setLocal)
    }
  }, [])

  return { state: local, subscribe }
}

export function setUser(user: User | null) {
  setState({ user })
}

export function setTheme(theme: Theme) {
  setState({ theme })
}
