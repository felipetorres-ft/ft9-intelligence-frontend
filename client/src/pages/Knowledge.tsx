import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, type KnowledgeItem } from '@/lib/api';
import { toast } from 'sonner';
import { Brain, Plus, Search, Loader2, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Knowledge() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Add form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // RAG
  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');
  const [ragSources, setRagSources] = useState<KnowledgeItem[]>([]);
  const [isRagLoading, setIsRagLoading] = useState(false);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    setIsLoading(true);
    try {
      const data = await api.getKnowledge();
      setKnowledge(data);
    } catch (error) {
      toast.error('Erro ao carregar conhecimentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await api.addKnowledge({ title, content, category });
      toast.success('Conhecimento adicionado com sucesso!');
      setTitle('');
      setContent('');
      setCategory('');
      loadKnowledge();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await api.searchKnowledge(searchQuery);
      setSearchResults(results);
      toast.success(`${results.length} resultados encontrados`);
    } catch (error) {
      toast.error('Erro ao buscar');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRagQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;
    
    setIsRagLoading(true);
    try {
      const result = await api.ragQuery(ragQuery);
      setRagAnswer(result.answer);
      setRagSources(result.sources);
      toast.success('Resposta gerada!');
    } catch (error) {
      toast.error('Erro ao gerar resposta');
    } finally {
      setIsRagLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">
            Gerencie sua base de conhecimento com IA
          </p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add">Adicionar</TabsTrigger>
            <TabsTrigger value="search">Buscar</TabsTrigger>
            <TabsTrigger value="rag">Perguntar (RAG)</TabsTrigger>
          </TabsList>

          {/* Add Knowledge */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Conhecimento
                </CardTitle>
                <CardDescription>
                  Adicione documentos, textos ou informações à base de conhecimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Pilar 1 - Posicionamento Estratégico"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria (opcional)</Label>
                    <Input
                      id="category"
                      placeholder="Ex: pilar-1, metodologia, caso-sucesso"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      placeholder="Cole aqui o texto completo do documento..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button type="submit" disabled={isAdding} className="w-full">
                    {isAdding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar à Base
                      </>
                    )}
                  </Button>
                </form>

                {/* List */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Conhecimentos Adicionados ({knowledge.length})
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </div>
                  ) : knowledge.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum conhecimento adicionado ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {knowledge.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          {item.category && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                              {item.category}
                            </span>
                          )}
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Busca Semântica
                </CardTitle>
                <CardDescription>
                  Encontre conhecimentos relevantes usando busca por similaridade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua busca..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      required
                    />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">Resultados ({searchResults.length})</h3>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-gray-200 rounded-lg bg-blue-50"
                      >
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{item.content.substring(0, 200)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* RAG */}
          <TabsContent value="rag">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Perguntas com RAG
                </CardTitle>
                <CardDescription>
                  Faça perguntas e obtenha respostas baseadas na sua base de conhecimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRagQuery} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ragQuery">Sua Pergunta</Label>
                    <Textarea
                      id="ragQuery"
                      placeholder="Ex: O que é posicionamento estratégico?"
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      required
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={isRagLoading} className="w-full">
                    {isRagLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando resposta...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Perguntar
                      </>
                    )}
                  </Button>
                </form>

                {ragAnswer && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Resposta:</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{ragAnswer}</p>
                    </div>
                    
                    {ragSources.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Fontes ({ragSources.length}):</h3>
                        <div className="space-y-2">
                          {ragSources.map((source) => (
                            <div
                              key={source.id}
                              className="p-3 border border-gray-200 rounded-lg text-sm"
                            >
                              <p className="font-medium text-gray-900">{source.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
