import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { User } from 'lucide-react'

export function ProfileScreen() {
  return (
    <div>
      <PageHeader title="Perfil" description="Suas informações" />
      <div className="flex flex-col items-center gap-4 py-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" alt="Avatar" />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Nome</p>
            <p className="text-sm text-muted-foreground">Usuário Nexus</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">
              usuario@nexus.app
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
