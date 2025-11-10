import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_URL = "https://ft9-intelligence-backend-production.up.railway.app";

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "Clinica Demo FT9",
    email: "contato@clinicademo.com.br",
    admin_email: "admin@ft9.com.br",
    admin_password: "ft9demo2025",
    admin_full_name: "Administrador FT9"
  });

  const testCreateOrganization = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      console.log("🚀 Enviando requisição para:", `${API_URL}/api/v1/organizations/`);
      console.log("📦 Dados:", formData);

      const res = await fetch(`${API_URL}/api/v1/organizations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("📡 Status:", res.status);
      console.log("📡 Headers:", Object.fromEntries(res.headers.entries()));

      const text = await res.text();
      console.log("📄 Resposta (texto):", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { raw_text: text };
      }

      if (res.ok) {
        setResponse(data);
        toast.success("✅ Organização criada com sucesso!");
      } else {
        setError(JSON.stringify(data, null, 2));
        toast.error(`❌ Erro ${res.status}: ${text.substring(0, 100)}`);
      }
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      setError(errorMsg);
      console.error("❌ Erro:", err);
      toast.error(`❌ Erro: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">🧪 Teste de API - FT9 Backend</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Criar Organização</CardTitle>
            <CardDescription>
              Endpoint: POST {API_URL}/api/v1/organizations/
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Organização</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email da Organização</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="admin_email">Email do Admin</Label>
              <Input
                id="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="admin_password">Senha do Admin</Label>
              <Input
                id="admin_password"
                type="password"
                value={formData.admin_password}
                onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="admin_full_name">Nome Completo do Admin</Label>
              <Input
                id="admin_full_name"
                value={formData.admin_full_name}
                onChange={(e) => setFormData({ ...formData, admin_full_name: e.target.value })}
              />
            </div>

            <Button
              onClick={testCreateOrganization}
              disabled={loading}
              className="w-full"
            >
              {loading ? "⏳ Testando..." : "🚀 Testar Criação"}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="mb-6 border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">✅ Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">❌ Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded overflow-auto text-sm text-red-600">
                {error}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>📋 Console</CardTitle>
            <CardDescription>
              Abra o DevTools (F12) e veja a aba Console para logs detalhados
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
