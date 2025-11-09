import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Building2, CreditCard, User, Shield } from 'lucide-react';

export default function Settings() {
  const { user, organization } = useAuth();

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { label: string; variant: any }> = {
      starter: { label: 'Starter', variant: 'secondary' },
      professional: { label: 'Professional', variant: 'default' },
      enterprise: { label: 'Enterprise', variant: 'default' },
    };
    return badges[plan] || badges.starter;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      trial: { label: 'Trial', className: 'bg-yellow-100 text-yellow-800' },
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      canceled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
    };
    return badges[status] || badges.trial;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 mt-1">
            Gerencie sua conta e organização
          </p>
        </div>

        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações da Organização
            </CardTitle>
            <CardDescription>
              Detalhes sobre sua organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Nome da Organização</dt>
                <dd className="text-lg font-semibold text-gray-900">{organization?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Slug</dt>
                <dd className="text-lg font-mono text-gray-900">{organization?.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Status</dt>
                <dd>
                  <Badge className={getStatusBadge(organization?.subscription_status || 'trial').className}>
                    {getStatusBadge(organization?.subscription_status || 'trial').label}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Ativo</dt>
                <dd>
                  <Badge variant={organization?.is_active ? 'default' : 'destructive'}>
                    {organization?.is_active ? 'Sim' : 'Não'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Assinatura
            </CardTitle>
            <CardDescription>
              Informações sobre seu plano e billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-2">Plano Atual</dt>
                <dd className="flex items-center gap-3">
                  <Badge variant={getPlanBadge(organization?.subscription_plan || 'starter').variant}>
                    {getPlanBadge(organization?.subscription_plan || 'starter').label}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {organization?.subscription_status === 'trial' && '(14 dias de trial)'}
                  </span>
                </dd>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Recursos do Plano Professional</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>✓ Base de conhecimento ilimitada</li>
                  <li>✓ RAG (Retrieval-Augmented Generation)</li>
                  <li>✓ Automações avançadas</li>
                  <li>✓ Integração WhatsApp Business</li>
                  <li>✓ Suporte prioritário</li>
                </ul>
              </div>

              {organization?.subscription_status === 'trial' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Trial ativo:</strong> Você tem acesso completo aos recursos Professional durante o período de trial.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>
              Seus dados de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Nome Completo</dt>
                <dd className="text-lg font-semibold text-gray-900">{user?.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Email</dt>
                <dd className="text-lg text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Role</dt>
                <dd>
                  <Badge variant="outline">{user?.role}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Status</dt>
                <dd>
                  <Badge variant={user?.is_active ? 'default' : 'destructive'}>
                    {user?.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Autenticação JWT</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Tokens de acesso com expiração de 7 dias
                  </p>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Isolamento Multi-Tenant</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Seus dados são completamente isolados de outras organizações
                  </p>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
