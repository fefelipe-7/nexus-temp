import { ScrollArea } from '@/components/ui/scroll-area'
import { NavBar } from './nav-bar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh w-full flex-col">
      <ScrollArea className="flex-1">
        <main className="mx-auto w-full max-w-lg px-4 py-6">
          {children}
        </main>
      </ScrollArea>
      <NavBar />
    </div>
  )
}
