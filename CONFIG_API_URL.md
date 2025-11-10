# Configurar URL da API no Frontend

## Quando o backend estiver deployado no Railway:

1. Copie a URL gerada pelo Railway (ex: `https://ft9-api-production.up.railway.app`)

2. Configure no projeto via Management UI:
   - Acesse Settings → Secrets
   - Adicione a variável:
     - Key: `VITE_API_URL`
     - Value: `https://sua-url.railway.app` (sem barra no final)

3. Ou edite manualmente o arquivo `client/src/config.ts`:
   ```typescript
   export const API_URL = 'https://sua-url.railway.app';
   ```

## Para desenvolvimento local:

Use: `http://localhost:8000`

## Importante:

- NÃO adicione barra `/` no final da URL
- Use HTTPS em produção
- Certifique-se que o CORS está configurado no backend
