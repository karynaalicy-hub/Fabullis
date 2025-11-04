# 🚀 Guia Passo a Passo - Deploy Manual na Vercel

## ✅ Preparação (Já Feito!)

- ✅ Código no GitHub: https://github.com/karynaalicy-hub/Fabullis
- ✅ Configuração Vercel criada (vercel.json)
- ✅ README e documentação completos
- ✅ .gitignore configurado

---

## 📋 Passo a Passo Detalhado

### 1. Acessar a Vercel

1. Abra: https://vercel.com
2. Clique em **"Login"** ou **"Sign In"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar sua conta GitHub (se solicitado)

### 2. Criar Novo Projeto

1. Após o login, clique em **"Add New..."** (botão no canto superior direito)
2. Selecione **"Project"**
3. Você verá a página "Import Git Repository"

### 3. Importar o Repositório Fabullis

1. Na seção **"Import Git Repository"**, procure por: **karynaalicy-hub/Fabullis**
2. Se não aparecer, clique em **"Adjust GitHub App Permissions"** para dar acesso
3. Clique no botão **"Import"** ao lado do repositório **Fabullis**

### 4. Configurar o Projeto

Na página de configuração, preencha:

#### Nome do Projeto
```
fabullis-platform
```

#### Framework Preset
Selecione: **Vite**

#### Root Directory
Deixe como: **`./`** (raiz do projeto)

#### Build and Output Settings

Deixe os padrões (já configurados no vercel.json):
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 5. Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

#### Variável 1: JWT_SECRET
```
Nome: JWT_SECRET
Valor: fabulis_production_secret_2024_change_this_value
Environment: Production
```

⚠️ **IMPORTANTE:** Mude esse valor para algo único e seguro!

**Gerar um JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Variável 2: NODE_ENV
```
Nome: NODE_ENV
Valor: production
Environment: Production
```

### 6. Fazer o Deploy

1. Clique no botão **"Deploy"**
2. Aguarde o build (leva 2-5 minutos)
3. Você verá o progresso em tempo real

### 7. Acessar o Site

Após o deploy bem-sucedido, você receberá URLs:

- **Production:** `https://fabullis-platform.vercel.app`
- **Preview:** `https://fabullis-platform-[hash].vercel.app`

---

## 🗄️ Configurar Banco de Dados (Próximo Passo)

O SQLite não funciona bem na Vercel. Você precisa migrar para PostgreSQL:

### Opção A: Neon (Recomendado - Gratuito)

1. Acesse: https://neon.tech
2. Crie uma conta (pode usar GitHub)
3. Clique em **"Create Project"**
4. Nome: **fabullis-db**
5. Região: **US East (Ohio)** (mais próximo do Brasil)
6. Clique em **"Create Project"**
7. Copie a **Connection String** (começa com `postgresql://`)
8. Volte na Vercel → Settings → Environment Variables
9. Adicione nova variável:
   - Nome: `DATABASE_URL`
   - Valor: `postgresql://[sua-connection-string]`
   - Environment: Production

### Opção B: Supabase (Gratuito)

1. Acesse: https://supabase.com
2. Crie uma conta
3. Clique em **"New Project"**
4. Nome: **fabullis**
5. Database Password: (crie uma senha forte)
6. Região: **South America (São Paulo)**
7. Clique em **"Create new project"**
8. Vá em **Settings → Database**
9. Copie a **Connection String** (modo "URI")
10. Adicione na Vercel como `DATABASE_URL`

### Opção C: Railway (Pago após trial)

1. Acesse: https://railway.app
2. Crie uma conta com GitHub
3. Clique em **"New Project"**
4. Selecione **"Provision PostgreSQL"**
5. Copie a **DATABASE_URL**
6. Adicione na Vercel

---

## 🔄 Migrar o Schema do Banco

Após configurar o PostgreSQL, você precisa criar as tabelas.

### Método 1: Usando SQL direto

1. Acesse o console do seu banco (Neon/Supabase/Railway)
2. Abra o SQL Editor
3. Execute o script de criação das tabelas (disponível em `server/config/initDatabase.cjs`)

### Método 2: Usando uma migration tool

```bash
# Instalar ferramenta de migração
npm install -g db-migrate db-migrate-pg

# Criar migration
db-migrate create initial-schema --sql-file

# Executar migration
db-migrate up
```

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Site acessível na URL da Vercel
- [ ] Login funcionando
- [ ] PostgreSQL configurado
- [ ] Variáveis de ambiente definidas
- [ ] Tabelas criadas no banco
- [ ] Dados de teste inseridos (usuários, histórias)
- [ ] Upload de imagens funcionando
- [ ] CORS configurado para o domínio da Vercel

---

## 🐛 Problemas Comuns

### Erro: "Build failed"

**Solução:**
1. Vá em Deployments → Clique no deployment falhado
2. Veja os logs de erro
3. Geralmente é falta de dependência ou erro de build

### Erro: "Cannot find module"

**Solução:**
```bash
# Localmente, certifique-se de que todas as dependências estão no package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Erro: "Database connection failed"

**Solução:**
1. Verifique se a `DATABASE_URL` está correta
2. Teste a conexão localmente:
```bash
export DATABASE_URL="sua-connection-string"
npm run server
```

### Erro: "CORS policy"

**Solução:**
Atualize `server/index.cjs`:
```javascript
app.use(cors({
  origin: ['https://fabullis-platform.vercel.app'],
  credentials: true
}));
```

Depois:
```bash
git add server/index.cjs
git commit -m "Update CORS for production"
git push
```

---

## 🔄 Atualizações Futuras

Sempre que você fizer mudanças:

1. Faça as alterações no código
2. Commit e push para o GitHub:
```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```
3. A Vercel detecta automaticamente e faz rebuild
4. Aguarde 2-3 minutos
5. Mudanças estarão no ar!

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** https://github.com/karynaalicy-hub/Fabullis/issues

---

## 🎯 URLs Importantes

- **Repositório GitHub:** https://github.com/karynaalicy-hub/Fabullis
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Site em Produção:** https://fabullis-platform.vercel.app (após deploy)

---

**Boa sorte! 🚀 Qualquer dúvida, consulte este guia ou a documentação oficial.**
