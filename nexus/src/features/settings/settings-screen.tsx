import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'

export function SettingsScreen() {
  return (
    <div>
      <PageHeader title="Ajustes" description="Preferências do app" />
      <Card>
        <CardHeader>
          <CardTitle>Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificações</Label>
            <Switch id="notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Som</Label>
            <Switch id="sound" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
