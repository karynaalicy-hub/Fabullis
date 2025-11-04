# 🚀 Início Rápido - Fabulis Full-Stack

**Última atualização:** 03 de Novembro de 2025

---

## ⚡ Executar em 3 Passos

### 1️⃣ Extrair e Instalar

```bash
# Extrair o projeto
unzip fabulis-fullstack.zip
cd fabulis-project

# Instalar dependências
npm install
```

### 2️⃣ Iniciar Backend

```bash
# Em um terminal
npm run server
```

✅ Backend rodando em `http://localhost:3001`

### 3️⃣ Iniciar Frontend

```bash
# Em outro terminal
npm run dev
```

✅ Frontend rodando em `http://localhost:3000`

---

## 🔑 Fazer Login

Acesse `http://localhost:3000` e clique em **"Assinar"**

### Credenciais de Teste

**Admin:**
```
Email: aline@example.com
Senha: senha123
```

**Escritor:**
```
Email: bruno@example.com
Senha: senha123
```

---

## 📚 O Que Você Pode Fazer

### Como Usuário
- ✅ Navegar pela biblioteca de histórias
- ✅ Ler capítulos gratuitos
- ✅ Curtir histórias e capítulos
- ✅ Comentar em capítulos
- ✅ Seguir histórias favoritas
- ✅ Assinar planos premium
- ✅ Comprar produtos na loja

### Como Escritor (bruno@example.com)
- ✅ Publicar novas histórias
- ✅ Adicionar capítulos
- ✅ Editar suas histórias
- ✅ Marcar capítulos como premium
- ✅ Ver estatísticas (em breve)

### Como Admin (aline@example.com)
- ✅ Todas as permissões de escritor
- ✅ Gerenciar qualquer história
- ✅ Acessar painel administrativo (em breve)

---

## 🧪 Testar a API

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Listar Histórias

```bash
curl http://localhost:3001/api/stories
```

### Fazer Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aline@example.com","password":"senha123"}'
```

---

## 🗄️ Resetar Banco de Dados

Se quiser começar do zero:

```bash
# Parar o backend (Ctrl+C)
rm server/fabulis.db
npm run server
```

O banco será recriado com os dados iniciais.

---

## 📖 Documentação Completa

Para informações detalhadas, consulte:

- **README_FABULIS_FULLSTACK.md** - Visão geral completa
- **GUIA_COMPLETO_FABULIS_FULLSTACK.md** - Documentação técnica
- **RELATORIO_IMPLEMENTACAO_BACKEND.md** - Detalhes da implementação

---

## 🐛 Problemas Comuns

### Backend não inicia

```bash
# Verificar se a porta 3001 está em uso
lsof -i :3001

# Se estiver, matar o processo
kill -9 $(lsof -t -i:3001)
```

### Frontend não conecta

1. Verifique se o backend está rodando
2. Acesse `http://localhost:3001/api/health`
3. Se não responder, reinicie o backend

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Próximos Passos

Depois de explorar a aplicação:

1. Leia o **README** para entender a estrutura
2. Consulte o **GUIA COMPLETO** para ver todos os endpoints
3. Explore o código em `server/` e `pages/`
4. Experimente criar suas próprias histórias!

---

## 📞 Precisa de Ajuda?

Consulte os documentos de ajuda:

1. **GUIA_COMPLETO_FABULIS_FULLSTACK.md** → Seção "Troubleshooting"
2. **README_FABULIS_FULLSTACK.md** → Seção "Suporte"

---

**Boa sorte e divirta-se explorando o Fabulis!** 🎉📚
