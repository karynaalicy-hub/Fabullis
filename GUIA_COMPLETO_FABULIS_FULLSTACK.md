# Guia Completo - Fabulis Full-Stack

**Data:** 03 de Novembro de 2025  
**Versão:** 2.0 - Full-Stack com Backend Real

---

## 🎉 Visão Geral

O **Fabulis** foi transformado em uma aplicação **full-stack completa** com:

✅ **Backend Node.js/Express** com API RESTful  
✅ **Banco de dados SQLite** com persistência real  
✅ **Autenticação JWT** com bcrypt  
✅ **Upload de imagens** com Multer  
✅ **Frontend React** integrado com o backend  
✅ **CORS configurado** para desenvolvimento  

---

## 📁 Estrutura do Projeto

```
fabulis-project/
├── server/                    # Backend
│   ├── config/
│   │   ├── database.cjs      # Configuração do SQLite
│   │   ├── initDatabase.cjs  # Script de criação de tabelas
│   │   └── seedDatabase.cjs  # Dados iniciais
│   ├── controllers/
│   │   ├── authController.cjs
│   │   ├── storyController.cjs
│   │   ├── chapterController.cjs
│   │   ├── storeController.cjs
│   │   └── uploadController.cjs
│   ├── middleware/
│   │   └── auth.cjs          # Middleware JWT
│   ├── routes/
│   │   ├── auth.cjs
│   │   ├── stories.cjs
│   │   ├── chapters.cjs
│   │   ├── store.cjs
│   │   ├── genres.cjs
│   │   └── upload.cjs
│   ├── uploads/              # Arquivos enviados
│   │   ├── covers/
│   │   └── avatars/
│   ├── index.cjs             # Servidor principal
│   └── fabulis.db            # Banco de dados SQLite
├── services/
│   └── api.ts                # Cliente API para frontend
├── contexts/
│   ├── AuthContext.tsx       # Contexto de autenticação (integrado com API)
│   └── CartContext.tsx
├── pages/                    # Páginas React
├── components/               # Componentes React
├── .env                      # Variáveis de ambiente do backend
├── .env.local                # Variáveis de ambiente do frontend
└── package.json

```

---

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd /home/ubuntu/fabulis-project
npm install
```

### 2. Iniciar o Backend

```bash
# Em um terminal
npm run server
```

O backend estará rodando em `http://localhost:3001`

### 3. Iniciar o Frontend

```bash
# Em outro terminal
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

### 4. Executar Ambos Simultaneamente

```bash
npm run dev:all
```

---

## 🔑 Credenciais de Teste

O banco de dados vem com 3 usuários pré-cadastrados:

### Admin
- **Email:** aline@example.com
- **Senha:** senha123
- **Role:** admin

### Escritor 1
- **Email:** bruno@example.com
- **Senha:** senha123
- **Role:** author

### Escritor 2
- **Email:** carlos@example.com
- **Senha:** senha123
- **Role:** author

---

## 📡 API Endpoints

### Autenticação

**POST** `/api/auth/register`
```json
{
  "nome_usuario": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "user"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "aline@example.com",
  "password": "senha123"
}
```

**GET** `/api/auth/me`  
Headers: `Authorization: Bearer {token}`

---

### Histórias

**GET** `/api/stories`  
Query params: `idioma`, `genero`, `search`, `page`, `limit`

**GET** `/api/stories/:id`

**POST** `/api/stories` (requer autenticação + role author/admin)
```json
{
  "titulo": "Minha História",
  "sinopse": "Uma história incrível...",
  "capa_url": "https://...",
  "idioma": "pt",
  "status": "em_andamento",
  "tipo": "livro",
  "isPremium": false,
  "generos": [1, 2]
}
```

**PUT** `/api/stories/:id` (requer autenticação + ser o autor)

**DELETE** `/api/stories/:id` (requer autenticação + ser o autor)

**POST** `/api/stories/:id/like` (requer autenticação)

**POST** `/api/stories/:id/follow` (requer autenticação)

**GET** `/api/stories/author/:authorId`

---

### Capítulos

**GET** `/api/chapters/:id`

**GET** `/api/chapters/story/:storyId`

**POST** `/api/chapters` (requer autenticação + role author/admin)
```json
{
  "historia_id": 1,
  "titulo_capitulo": "Capítulo 1",
  "conteudo": "Era uma vez...",
  "isPremium": false
}
```

**PUT** `/api/chapters/:id` (requer autenticação + ser o autor)

**DELETE** `/api/chapters/:id` (requer autenticação + ser o autor)

**POST** `/api/chapters/:id/like` (requer autenticação)

**GET** `/api/chapters/:id/comments`

**POST** `/api/chapters/:id/comments` (requer autenticação)
```json
{
  "content": "Ótimo capítulo!"
}
```

---

### Loja

**GET** `/api/store/plans`

**POST** `/api/store/subscribe` (requer autenticação)
```json
{
  "planId": 1
}
```

**GET** `/api/store/subscription/check` (requer autenticação)

**GET** `/api/store/products`

**GET** `/api/store/products/:id`

**POST** `/api/store/sales` (requer autenticação)
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "price": 89.90
    }
  ]
}
```

**GET** `/api/store/sales/my` (requer autenticação)

---

### Gêneros

**GET** `/api/genres`

---

### Upload

**POST** `/api/upload` (requer autenticação)  
Content-Type: `multipart/form-data`
```
image: File
type: "covers" | "avatars"
```

---

## 🗄️ Banco de Dados

### Estrutura de Tabelas

O banco de dados SQLite contém as seguintes tabelas:

1. **users** - Usuários do sistema
2. **genres** - Gêneros literários
3. **stories** - Histórias publicadas
4. **story_genres** - Relacionamento história-gênero (N:N)
5. **chapters** - Capítulos das histórias
6. **comments** - Comentários em capítulos
7. **story_likes** - Curtidas em histórias
8. **chapter_likes** - Curtidas em capítulos
9. **subscriptions** - Inscrições em histórias (follows)
10. **notifications** - Notificações de novos capítulos
11. **subscription_plans** - Planos de assinatura
12. **user_subscriptions** - Assinaturas de usuários
13. **products** - Produtos da loja
14. **sales** - Vendas realizadas
15. **sale_items** - Itens de cada venda

### Dados Iniciais

O banco é populado automaticamente com:
- 3 usuários (1 admin, 2 autores)
- 6 gêneros literários
- 5 histórias de exemplo
- 6 capítulos distribuídos entre as histórias
- 2 planos de assinatura (Mensal e Anual)
- 4 produtos na loja

### Resetar o Banco de Dados

Para limpar e recriar o banco:

```bash
rm server/fabulis.db
npm run server
```

O banco será recriado automaticamente com os dados iniciais.

---

## 🔐 Autenticação

### Como Funciona

1. O usuário faz login via `/api/auth/login`
2. O backend retorna um **JWT token** válido por 7 dias
3. O frontend armazena o token no `localStorage`
4. Todas as requisições autenticadas incluem o header:
   ```
   Authorization: Bearer {token}
   ```

### Middleware de Autenticação

Três tipos de middleware estão disponíveis:

**authMiddleware** - Requer autenticação obrigatória
```javascript
router.get('/protected', authMiddleware, handler);
```

**optionalAuth** - Autenticação opcional (adiciona `req.user` se houver token)
```javascript
router.get('/public', optionalAuth, handler);
```

**checkRole** - Verifica role específica
```javascript
router.post('/stories', authMiddleware, checkRole('author', 'admin'), handler);
```

---

## 📤 Upload de Imagens

### Frontend

```typescript
import { uploadAPI } from '../services/api';

const handleUpload = async (file: File) => {
  try {
    const result = await uploadAPI.uploadImage(file, 'covers');
    console.log('URL da imagem:', result.url);
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### Configuração

- **Formatos aceitos:** JPEG, JPG, PNG, GIF, WEBP
- **Tamanho máximo:** 5MB
- **Diretórios:**
  - Capas de histórias: `/uploads/covers/`
  - Avatares de usuários: `/uploads/avatars/`

---

## 🌐 CORS e Variáveis de Ambiente

### Backend (.env)

```env
PORT=3001
JWT_SECRET=fabulis_secret_key_change_in_production_2024
NODE_ENV=development
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001/api
```

Para produção, altere para a URL real da API.

### Configuração CORS

O backend aceita requisições de:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- Qualquer domínio `.manusvm.computer` (para desenvolvimento no Manus)

---

## 🧪 Testando a API

### Com cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Listar histórias
curl http://localhost:3001/api/stories

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aline@example.com","password":"senha123"}'

# Criar história (com token)
curl -X POST http://localhost:3001/api/stories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "titulo": "Nova História",
    "sinopse": "Uma aventura épica",
    "idioma": "pt",
    "status": "em_andamento",
    "tipo": "livro",
    "generos": [1, 2]
  }'
```

### Com Postman/Insomnia

Importe a collection com os endpoints acima ou crie manualmente.

---

## 🎨 Integração Frontend-Backend

### Serviço de API

O arquivo `services/api.ts` fornece funções prontas para consumir a API:

```typescript
import { authAPI, storiesAPI, chaptersAPI, storeAPI } from '../services/api';

// Login
const { user, token } = await authAPI.login('email@example.com', 'senha');

// Listar histórias
const { stories, total } = await storiesAPI.getAll({ idioma: 'pt', page: 1 });

// Criar história
const newStory = await storiesAPI.create({
  titulo: 'Minha História',
  sinopse: '...',
  idioma: 'pt',
  status: 'em_andamento',
  tipo: 'livro',
  generos: [1, 2]
});

// Adicionar capítulo
const newChapter = await chaptersAPI.create({
  historia_id: 1,
  titulo_capitulo: 'Capítulo 1',
  conteudo: 'Era uma vez...'
});
```

### AuthContext

O `AuthContext` foi atualizado para usar a API real:

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('email@example.com', 'senha123');
      // Usuário logado!
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Olá, {currentUser.nome_usuario}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

---

## 🚧 Próximos Passos

### Funcionalidades a Implementar

1. **Painel Administrativo**
   - Gerenciar usuários
   - Moderar conteúdo
   - Visualizar estatísticas

2. **Sistema de Notificações**
   - Notificações in-app funcionais
   - Emails de novos capítulos
   - Push notifications

3. **Integração de Pagamentos**
   - Stripe ou Mercado Pago
   - Assinaturas recorrentes reais
   - Webhooks de confirmação

4. **Upload de Imagens Melhorado**
   - Crop e resize automático
   - Integração com CDN (Cloudinary, S3)
   - Validação de dimensões

5. **Busca Avançada**
   - Full-text search com Elasticsearch
   - Autocomplete
   - Filtros combinados

6. **Analytics**
   - Dashboard para autores
   - Métricas de leitura
   - Gráficos de engajamento

### Melhorias de Infraestrutura

1. **Migração para PostgreSQL**
   - Melhor performance
   - Suporte a transações complexas
   - Escalabilidade

2. **Deploy em Produção**
   - Frontend: Vercel/Netlify
   - Backend: Railway/Render/AWS
   - Banco: PostgreSQL gerenciado

3. **CI/CD**
   - GitHub Actions
   - Testes automatizados
   - Deploy automático

4. **Monitoramento**
   - Sentry para erros
   - Logs centralizados
   - Métricas de performance

---

## 📝 Notas Importantes

### Segurança

⚠️ **IMPORTANTE:** Antes de colocar em produção:

1. Altere o `JWT_SECRET` no `.env` para um valor seguro e aleatório
2. Configure HTTPS obrigatório
3. Implemente rate limiting
4. Adicione validação de entrada em todos os endpoints
5. Configure CORS apenas para domínios permitidos
6. Implemente refresh tokens
7. Adicione logs de auditoria

### Performance

- O SQLite é adequado para desenvolvimento e pequenos projetos
- Para produção com muitos usuários, migre para PostgreSQL
- Implemente cache (Redis) para queries frequentes
- Use CDN para servir assets estáticos
- Otimize queries com índices apropriados

### Backup

- Configure backup automático do banco de dados
- Faça backup dos uploads regularmente
- Mantenha backups em locais diferentes

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar se a porta 3001 está em uso
lsof -i :3001

# Matar processo na porta
kill -9 $(lsof -t -i:3001)

# Verificar logs
cat /tmp/backend.log
```

### Frontend não conecta com backend

1. Verifique se o backend está rodando
2. Confirme a URL da API no `.env.local`
3. Verifique o console do navegador para erros CORS
4. Teste a API diretamente com cURL

### Erro de CORS

Adicione a origem no `server/index.cjs`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true
}));
```

### Token expirado

O token JWT expira em 7 dias. Para renovar:

```typescript
await authAPI.login(email, password);
```

Ou implemente refresh tokens.

---

## 📚 Recursos Adicionais

### Documentação

- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/docs.html)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

### Tutoriais Recomendados

- Autenticação JWT: https://www.youtube.com/watch?v=mbsmsi7l3r4
- Upload de arquivos: https://www.youtube.com/watch?v=srPXMt1Q0nY
- SQLite com Node.js: https://www.youtube.com/watch?v=ZRYn6tgnEgM

---

## ✅ Checklist de Produção

Antes de fazer deploy:

- [ ] Alterar JWT_SECRET
- [ ] Configurar variáveis de ambiente de produção
- [ ] Migrar para PostgreSQL (recomendado)
- [ ] Configurar HTTPS
- [ ] Implementar rate limiting
- [ ] Adicionar validação de entrada
- [ ] Configurar CORS restritivo
- [ ] Implementar logs
- [ ] Configurar backup automático
- [ ] Adicionar monitoramento de erros
- [ ] Testar todos os endpoints
- [ ] Otimizar queries do banco
- [ ] Configurar CDN para uploads
- [ ] Implementar cache
- [ ] Adicionar testes automatizados

---

## 🎯 Conclusão

O **Fabulis** agora é uma aplicação full-stack completa e funcional, pronta para ser expandida com novas funcionalidades. O backend fornece uma API RESTful robusta com autenticação JWT, e o frontend está totalmente integrado para consumir todos os endpoints.

**Próximo passo recomendado:** Implementar o painel administrativo para gerenciar usuários e conteúdo.

**Boa sorte com o desenvolvimento!** 🚀📚

---

**Desenvolvido com ❤️ usando Node.js, Express, SQLite, React e TypeScript**
