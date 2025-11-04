# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer o deploy do Fabulis na Vercel.

## 📋 Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Repositório GitHub conectado (✅ já feito!)
3. Token de acesso do GitHub (✅ já configurado!)

## 🔧 Passo a Passo

### 1. Acessar a Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**

### 2. Importar Repositório

1. Selecione o repositório **karynaalicy-hub/Fabullis**
2. Clique em **"Import"**

### 3. Configurar o Projeto

#### Framework Preset
- Selecione: **Vite**

#### Build Settings
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Root Directory
- Deixe como: `.` (raiz do projeto)

### 4. Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```
JWT_SECRET=seu_secret_super_seguro_aqui_mude_isso
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Mude o `JWT_SECRET` para um valor único e seguro!

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (leva ~2-3 minutos)
3. Após o deploy, você receberá uma URL como: `https://fabullis.vercel.app`

## 🔄 Atualizações Automáticas

Após o primeiro deploy, qualquer push para a branch `main` no GitHub irá automaticamente:

1. Detectar as mudanças
2. Fazer rebuild
3. Atualizar o site em produção

## 🗄️ Banco de Dados

### Opção 1: SQLite (Temporário)

O SQLite funciona na Vercel, mas os dados são **perdidos a cada deploy**. Use apenas para testes.

### Opção 2: PostgreSQL (Recomendado)

Para produção, use PostgreSQL:

#### A. Neon (Gratuito)

1. Acesse https://neon.tech
2. Crie um banco de dados gratuito
3. Copie a `DATABASE_URL`
4. Adicione nas variáveis de ambiente da Vercel

#### B. Railway (Recomendado)

1. Acesse https://railway.app
2. Crie um projeto PostgreSQL
3. Copie a `DATABASE_URL`
4. Adicione nas variáveis de ambiente da Vercel

#### C. Supabase (Gratuito)

1. Acesse https://supabase.com
2. Crie um projeto
3. Vá em Settings → Database
4. Copie a connection string
5. Adicione nas variáveis de ambiente da Vercel

### Migração do Schema

Após configurar o PostgreSQL, você precisa migrar o schema:

```sql
-- Execute no console do PostgreSQL

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ... (copie o resto do schema de server/config/initDatabase.cjs)
```

## 🔐 Segurança em Produção

### 1. JWT Secret

**Nunca** use o secret padrão em produção! Gere um novo:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. CORS

Atualize o CORS em `server/index.cjs` para aceitar apenas seu domínio:

```javascript
app.use(cors({
  origin: ['https://fabullis.vercel.app'],
  credentials: true
}));
```

### 3. Rate Limiting

Adicione rate limiting para proteger a API:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

## 📊 Monitoramento

### Logs

Acesse os logs na Vercel:

1. Vá no projeto
2. Clique em **"Deployments"**
3. Selecione um deployment
4. Clique em **"View Function Logs"**

### Analytics

A Vercel oferece analytics gratuito:

1. Vá em **"Analytics"** no menu
2. Veja métricas de performance e uso

## 🐛 Troubleshooting

### Erro: "Module not found"

Certifique-se de que todas as dependências estão no `package.json`:

```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Erro: "Build failed"

1. Verifique os logs de build na Vercel
2. Teste o build localmente:

```bash
npm run build
```

### Erro: "API not responding"

1. Verifique se as variáveis de ambiente estão configuradas
2. Verifique os logs da função serverless
3. Teste localmente com `npm run server`

### Banco de dados não persiste

Se estiver usando SQLite, os dados serão perdidos a cada deploy. Migre para PostgreSQL.

## 🔄 Rollback

Se algo der errado, você pode fazer rollback:

1. Vá em **"Deployments"**
2. Encontre um deployment anterior que funcionava
3. Clique nos três pontos → **"Promote to Production"**

## 📝 Checklist de Deploy

- [ ] Repositório no GitHub atualizado
- [ ] `vercel.json` configurado
- [ ] Variáveis de ambiente definidas
- [ ] JWT_SECRET alterado
- [ ] PostgreSQL configurado (opcional)
- [ ] CORS atualizado para domínio de produção
- [ ] Build local testado (`npm run build`)
- [ ] Servidor local testado (`npm run server`)

## 🎯 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **Repositório GitHub:** https://github.com/karynaalicy-hub/Fabullis
- **Neon (PostgreSQL):** https://neon.tech
- **Railway (PostgreSQL):** https://railway.app
- **Supabase (PostgreSQL):** https://supabase.com

## 💡 Dicas

1. **Domínio Customizado:** Você pode adicionar um domínio próprio em Settings → Domains
2. **Preview Deployments:** Cada PR gera um preview automático
3. **Edge Functions:** Para melhor performance global
4. **Vercel CLI:** Instale com `npm i -g vercel` para deploy via terminal

## 🆘 Suporte

Se precisar de ajuda:

1. Documentação da Vercel: https://vercel.com/docs
2. Discord da Vercel: https://vercel.com/discord
3. GitHub Issues: https://github.com/karynaalicy-hub/Fabullis/issues

---

**Boa sorte com o deploy! 🚀**
