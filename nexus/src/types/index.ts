export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface AppState {
  user: User | null
  theme: Theme
  isReady: boolean
}

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
