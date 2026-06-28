import { cn } from '@/lib/utils'
import { Home, User, Settings, type LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: 'Início', icon: Home, href: '/home' },
  { label: 'Perfil', icon: User, href: '/profile' },
  { label: 'Ajustes', icon: Settings, href: '/settings' },
]

interface NavBarProps {
  currentPath?: string
}

export function NavBar({ currentPath = '/home' }: NavBarProps) {
  return (
    <nav className="flex items-center justify-around border-t bg-background px-2 py-2">
      {navItems.map((item) => {
        const isActive = currentPath === item.href
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-1 text-xs transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
