import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api, type KnowledgeStats } from '@/lib/api';
import { Brain, Database, Zap, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { organization } = useAuth();
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getKnowledgeStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback: tentar carregar apenas a contagem
      try {
        const countData = await api.getKnowledgeCount();
        setStats({
          organization_knowledge_count: countData.count,
          vector_store: {
            total_vectors: countData.count,
            dimension: 1536,
            index_type: 'pgvector'
          }
        });
      } catch (countError) {
        console.error('Failed to load count:', countError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Conhecimentos',
      value: stats?.organization_knowledge_count || 0,
      description: 'Documentos na base',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Vetores',
      value: stats?.vector_store.total_vectors || 0,
      description: 'Embeddings indexados',
      icon: Database,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Dimensões',
      value: stats?.vector_store.dimension || 1536,
      description: 'Tamanho do vetor',
      icon: Zap,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Status',
      value: organization?.subscription_status === 'trial' ? 'Trial' : 'Ativo',
      description: organization?.subscription_plan || 'Professional',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bem-vindo de volta! Aqui está um resumo da sua plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Organização</CardTitle>
            <CardDescription>
              Detalhes sobre sua conta e assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900">{organization?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{organization?.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Plano</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{organization?.subscription_plan}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    organization?.subscription_status === 'trial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {organization?.subscription_status}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Comece a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/knowledge"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Brain className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Adicionar Conhecimento</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Faça upload de documentos para a base de conhecimento
                </p>
              </a>
              <a
                href="/knowledge"
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Database className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Buscar com RAG</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Faça perguntas e obtenha respostas inteligentes
                </p>
              </a>
              <a
                href="/settings"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Zap className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Configurar</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ajuste as configurações da sua organização
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
