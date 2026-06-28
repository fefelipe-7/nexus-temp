import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout'
import { HomeScreen } from '@/features/home'
import { ProfileScreen } from '@/features/profile'
import { SettingsScreen } from '@/features/settings'
import { AuthScreen } from '@/features/auth'
import { Toaster } from '@/components/ui/sonner'

type Screen = 'auth' | 'home' | 'profile' | 'settings'

function getScreen(path: string): Screen {
  if (path === '/profile') return 'profile'
  if (path === '/settings') return 'settings'
  if (path === '/auth') return 'auth'
  return 'home'
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    getScreen(window.location.pathname)
  )

  useEffect(() => {
    const handlePop = () => setScreen(getScreen(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  if (screen === 'auth') {
    return (
      <>
        <AuthScreen />
        <Toaster />
      </>
    )
  }

  const renderScreen = () => {
    switch (screen) {
      case 'profile':
        return <ProfileScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <AppShell>
      {renderScreen()}
      <Toaster />
    </AppShell>
  )
}
