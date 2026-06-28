import { useEffect } from 'react'
import { getState, setTheme as setStoreTheme } from '@/stores/app-store'
import type { Theme } from '@/types'

export function useTheme() {
  const { theme } = getState()

  useEffect(() => {
    const root = document.documentElement
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    root.classList.toggle('dark', resolved === 'dark')
  }, [theme])

  return {
    theme,
    setTheme: (t: Theme) => setStoreTheme(t),
  }
}
