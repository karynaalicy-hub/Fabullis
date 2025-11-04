# 🚀 Deploy via Vercel CLI

## Passo a Passo Simplificado

### 1. Instalar Vercel CLI (já feito!)

```bash
npm install -g vercel
```

### 2. Fazer Login na Vercel

```bash
vercel login
```

Escolha uma das opções:
- Email
- GitHub
- GitLab
- Bitbucket

### 3. Deploy do Projeto

No diretório do projeto, execute:

```bash
cd /home/ubuntu/fabulis-project
vercel
```

O CLI vai perguntar:

1. **Set up and deploy?** → Sim (Y)
2. **Which scope?** → Escolha sua conta
3. **Link to existing project?** → No (N)
4. **What's your project's name?** → fabullis (ou deixe o padrão)
5. **In which directory is your code located?** → ./ (padrão)
6. **Want to override the settings?** → No (N)

### 4. Deploy em Produção

Após o primeiro deploy (preview), faça o deploy em produção:

```bash
vercel --prod
```

### 5. Configurar Variáveis de Ambiente

```bash
vercel env add JWT_SECRET production
```

Quando solicitado, digite um secret seguro (ex: use o gerador abaixo)

**Gerar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Adicionar Domínio (Opcional)

```bash
vercel domains add seu-dominio.com
```

## Comandos Úteis

```bash
# Ver logs
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm [deployment-url]

# Ver informações do projeto
vercel inspect

# Abrir projeto no navegador
vercel open
```

## Troubleshooting

### Erro: "Not authenticated"

```bash
vercel logout
vercel login
```

### Erro: "Build failed"

Verifique os logs:
```bash
vercel logs [deployment-url]
```

### Atualizar deployment

Basta fazer push no GitHub ou executar:
```bash
vercel --prod
```

## URLs Geradas

Após o deploy, você receberá:

1. **Preview URL:** `https://fabullis-[hash].vercel.app`
2. **Production URL:** `https://fabullis.vercel.app`

## Próximos Passos

1. Configure o PostgreSQL (Neon, Railway ou Supabase)
2. Adicione a `DATABASE_URL` nas variáveis de ambiente
3. Atualize o CORS no backend para aceitar o domínio da Vercel

---

**Pronto! Seu projeto está no ar! 🎉**
