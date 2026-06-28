import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'

export function HomeScreen() {
  return (
    <div>
      <PageHeader title="Início" description="Bem-vindo ao Nexus" />
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Seu conteúdo aparecerá aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
