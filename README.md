# 🚀 Fabulis - Plataforma Full-Stack de Publicação de Histórias

**Versão:** 2.0 - Full-Stack Edition  
**Data:** 03 de Novembro de 2025

---

## 📖 Sobre o Projeto

**Fabulis** é uma plataforma completa de publicação e leitura de histórias digitais, desenvolvida com tecnologias modernas e arquitetura full-stack.

### ✨ Destaques

- ✅ **Backend Node.js/Express** com API RESTful completa
- ✅ **Banco de dados SQLite** com 15 tabelas relacionadas
- ✅ **Autenticação JWT** com bcrypt para segurança
- ✅ **Upload de imagens** com Multer
- ✅ **Frontend React + TypeScript** totalmente integrado
- ✅ **Sistema de assinaturas** e e-commerce
- ✅ **Comentários, curtidas e notificações**
- ✅ **Painel do escritor** para publicação de histórias
- ✅ **Loja com produtos** físicos e digitais

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** 22.13.0
- **Express** 5.1.0
- **SQLite3** 5.1.7
- **JWT** (jsonwebtoken 9.0.2)
- **bcryptjs** 3.0.3
- **Multer** 2.0.2 (upload de arquivos)
- **CORS** 2.8.5

### Frontend
- **React** 19.2.0
- **TypeScript** 5.8.2
- **Vite** 6.2.0
- **React Router DOM** 7.9.4

### Banco de Dados
- **SQLite** (desenvolvimento)
- Pronto para migração para **PostgreSQL** (produção)

---

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar a Aplicação

**Opção A: Executar backend e frontend separadamente**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

**Opção B: Executar tudo junto**

```bash
npm run dev:all
```

### 3. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

---

## 🔑 Credenciais de Teste

### Admin
```
Email: aline@example.com
Senha: senha123
```

### Escritor
```
Email: bruno@example.com
Senha: senha123
```

---

## 📂 Estrutura do Projeto

```
fabulis-project/
├── server/                    # Backend Express
│   ├── config/               # Configurações e DB
│   ├── controllers/          # Lógica de negócio
│   ├── middleware/           # Middlewares (auth, etc)
│   ├── routes/               # Rotas da API
│   ├── uploads/              # Arquivos enviados
│   └── index.cjs             # Servidor principal
├── services/                  # Cliente API
├── contexts/                  # Contextos React
├── pages/                     # Páginas React
├── components/                # Componentes React
├── types/                     # TypeScript types
├── data/                      # Dados mockados (legado)
└── package.json
```

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual

### Histórias
- `GET /api/stories` - Listar histórias
- `GET /api/stories/:id` - Detalhes da história
- `POST /api/stories` - Criar história (requer auth)
- `PUT /api/stories/:id` - Atualizar história
- `DELETE /api/stories/:id` - Deletar história
- `POST /api/stories/:id/like` - Curtir história
- `POST /api/stories/:id/follow` - Seguir história

### Capítulos
- `GET /api/chapters/:id` - Detalhes do capítulo
- `GET /api/chapters/story/:storyId` - Capítulos da história
- `POST /api/chapters` - Criar capítulo (requer auth)
- `PUT /api/chapters/:id` - Atualizar capítulo
- `DELETE /api/chapters/:id` - Deletar capítulo
- `GET /api/chapters/:id/comments` - Comentários
- `POST /api/chapters/:id/comments` - Adicionar comentário

### Loja
- `GET /api/store/plans` - Planos de assinatura
- `POST /api/store/subscribe` - Assinar plano
- `GET /api/store/products` - Listar produtos
- `POST /api/store/sales` - Criar venda

### Outros
- `GET /api/genres` - Listar gêneros
- `POST /api/upload` - Upload de imagem

**Documentação completa:** Ver `GUIA_COMPLETO_FABULIS_FULLSTACK.md`

---

## 🗄️ Banco de Dados

### Tabelas Principais

1. **users** - Usuários (admin, author, user)
2. **stories** - Histórias publicadas
3. **chapters** - Capítulos das histórias
4. **comments** - Comentários em capítulos
5. **subscription_plans** - Planos de assinatura
6. **products** - Produtos da loja
7. **sales** - Vendas realizadas

**Total:** 15 tabelas com relacionamentos completos

### Dados Iniciais

- 3 usuários (1 admin, 2 autores)
- 6 gêneros literários
- 5 histórias de exemplo
- 6 capítulos
- 2 planos de assinatura
- 4 produtos

### Resetar Banco

```bash
rm server/fabulis.db
npm run server
```

---

## 🔐 Segurança

- ✅ Autenticação JWT com tokens de 7 dias
- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Middleware de autorização por role
- ✅ CORS configurado
- ✅ Validação de uploads (tipo e tamanho)

**⚠️ Antes de produção:**
- Altere o `JWT_SECRET` no `.env`
- Configure HTTPS
- Implemente rate limiting
- Adicione validação de entrada

---

## 📤 Upload de Imagens

### Configuração

- **Formatos:** JPEG, JPG, PNG, GIF, WEBP
- **Tamanho máximo:** 5MB
- **Diretórios:**
  - Capas: `/uploads/covers/`
  - Avatares: `/uploads/avatars/`

### Exemplo de Uso

```typescript
import { uploadAPI } from '../services/api';

const result = await uploadAPI.uploadImage(file, 'covers');
console.log(result.url); // /uploads/covers/image-123456.jpg
```

---

## 🎨 Frontend

### Páginas Disponíveis

- **Home** - Página inicial com destaques
- **Biblioteca** - Listagem de histórias com filtros
- **Detalhes da História** - Informações e capítulos
- **Leitor** - Leitura de capítulos
- **Loja** - Planos e produtos
- **Carrinho** - Gerenciamento de compras
- **Checkout** - Finalização de compra
- **Painel do Escritor** - Publicação de histórias
- **Perfil do Autor** - Histórias do autor
- **Login/Registro** - Autenticação

### Contextos

- **AuthContext** - Autenticação e usuário atual
- **CartContext** - Carrinho de compras

---

## 🧪 Testes

### Testar API com cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aline@example.com","password":"senha123"}'

# Listar histórias
curl http://localhost:3001/api/stories?idioma=pt
```

---

## 📦 Scripts Disponíveis

```json
{
  "dev": "vite",                    // Frontend apenas
  "server": "node server/index.cjs", // Backend apenas
  "dev:all": "npm run server & npm run dev", // Ambos
  "build": "vite build",            // Build de produção
  "preview": "vite preview"         // Preview do build
}
```

---

## 🚧 Próximos Passos

### Funcionalidades Pendentes

1. **Painel Administrativo**
   - Gerenciar usuários
   - Moderar conteúdo
   - Estatísticas

2. **Notificações**
   - Emails de novos capítulos
   - Push notifications
   - Notificações in-app funcionais

3. **Pagamentos Reais**
   - Integração Stripe/Mercado Pago
   - Assinaturas recorrentes
   - Webhooks

4. **Busca Avançada**
   - Full-text search
   - Autocomplete
   - Filtros combinados

5. **Analytics**
   - Dashboard para autores
   - Métricas de leitura
   - Gráficos

### Melhorias Técnicas

1. **Migrar para PostgreSQL** (produção)
2. **Implementar testes** (Jest, Cypress)
3. **CI/CD** (GitHub Actions)
4. **Monitoramento** (Sentry)
5. **Cache** (Redis)
6. **CDN** para uploads

---

## 📝 Variáveis de Ambiente

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

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar porta em uso
lsof -i :3001

# Matar processo
kill -9 $(lsof -t -i:3001)
```

### Erro de CORS

Adicione a origem permitida em `server/index.cjs`:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true
}));
```

### Token expirado

Faça login novamente para obter um novo token.

---

## 📚 Documentação Completa

Para documentação detalhada de todos os endpoints, exemplos de uso e guias avançados, consulte:

**📄 GUIA_COMPLETO_FABULIS_FULLSTACK.md**

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Node.js, Express, SQLite, React e TypeScript.

---

## 🎯 Status do Projeto

✅ **Backend:** Completo e funcional  
✅ **Frontend:** Integrado com backend  
✅ **Banco de Dados:** SQLite com dados de exemplo  
✅ **Autenticação:** JWT implementado  
✅ **Upload:** Multer configurado  
🚧 **Pagamentos:** Simulação (integração real pendente)  
🚧 **Notificações:** Estrutura criada (envio pendente)  
🚧 **Admin:** Estrutura criada (interface pendente)  

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
1. **GUIA_COMPLETO_FABULIS_FULLSTACK.md** - Documentação completa
2. **Issues** - Abra uma issue no repositório
3. **Documentação das tecnologias** - Links no guia completo

---

**Fabulis - Sua biblioteca pessoal de ficção** 📚✨
