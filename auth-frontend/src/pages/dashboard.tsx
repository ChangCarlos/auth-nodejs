import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Olá, <strong>{user?.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Este é um dashboard protegido por autenticação JWT.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ Login com JWT</p>
            <p>✅ Refresh token</p>
            <p>✅ Rotas protegidas</p>
            <p>✅ Frontend + Backend separados</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
