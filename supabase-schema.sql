-- =====================================================
-- FABULIS - Schema PostgreSQL para Supabase
-- =====================================================
-- Este script cria todas as tabelas necessárias para o Fabulis
-- Execute no SQL Editor do Supabase
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_usuario TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'author', 'admin')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- 2. TABELA DE GÊNEROS
-- =====================================================
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

-- =====================================================
-- 3. TABELA DE HISTÓRIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  autor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  sinopse TEXT,
  capa_url TEXT,
  idioma TEXT NOT NULL CHECK(idioma IN ('pt', 'en', 'es')),
  status TEXT NOT NULL CHECK(status IN ('em_andamento', 'concluida', 'hiato')),
  tipo TEXT NOT NULL CHECK(tipo IN ('livro', 'conto', 'fanfic')),
  is_premium BOOLEAN DEFAULT FALSE,
  data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stories_autor ON stories(autor_id);
CREATE INDEX IF NOT EXISTS idx_stories_idioma ON stories(idioma);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_tipo ON stories(tipo);

-- =====================================================
-- 4. TABELA DE RELACIONAMENTO HISTÓRIA-GÊNERO
-- =====================================================
CREATE TABLE IF NOT EXISTS story_genres (
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, genre_id)
);

-- =====================================================
-- 5. TABELA DE CAPÍTULOS
-- =====================================================
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  historia_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  numero_capitulo INTEGER NOT NULL,
  titulo_capitulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(historia_id, numero_capitulo)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chapters_historia ON chapters(historia_id);

-- =====================================================
-- 6. TABELA DE COMENTÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_reported BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_comments_chapter ON comments(chapter_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- =====================================================
-- 7. TABELA DE CURTIDAS EM HISTÓRIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS story_likes (
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (story_id, user_id)
);

-- =====================================================
-- 8. TABELA DE CURTIDAS EM CAPÍTULOS
-- =====================================================
CREATE TABLE IF NOT EXISTS chapter_likes (
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (chapter_id, user_id)
);

-- =====================================================
-- 9. TABELA DE SEGUIDORES DE HISTÓRIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, story_id)
);

-- =====================================================
-- 10. TABELA DE NOTIFICAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- =====================================================
-- 11. TABELA DE PLANOS DE ASSINATURA
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL
);

-- =====================================================
-- 12. TABELA DE ASSINATURAS DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_dates ON user_subscriptions(start_date, end_date);

-- =====================================================
-- 13. TABELA DE PRODUTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  type TEXT NOT NULL CHECK(type IN ('fisico', 'digital')),
  stock INTEGER DEFAULT 0
);

-- =====================================================
-- 14. TABELA DE VENDAS
-- =====================================================
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 15. TABELA DE ITENS DE VENDA
-- =====================================================
CREATE TABLE IF NOT EXISTS sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- =====================================================
-- DADOS INICIAIS - GÊNEROS
-- =====================================================
INSERT INTO genres (nome) VALUES
  ('Fantasia'),
  ('Aventura'),
  ('Romance'),
  ('Ficção Científica'),
  ('Mistério'),
  ('Terror')
ON CONFLICT (nome) DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - PLANOS DE ASSINATURA
-- =====================================================
INSERT INTO subscription_plans (name, price, description, duration_days) VALUES
  ('Leitor Mensal', 14.90, 'Acesso a todo o conteúdo premium por um mês.', 30),
  ('Leitor Anual', 149.90, 'Um ano de acesso com desconto exclusivo.', 365)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - PRODUTOS
-- =====================================================
INSERT INTO products (name, description, price, image_url, type, stock) VALUES
  ('Camiseta Fabullis', 'Camiseta 100% algodão com logo da Fabullis', 49.90, 'https://picsum.photos/seed/product1/300/300', 'fisico', 50),
  ('Caneca Mágica', 'Caneca que muda de cor com líquidos quentes', 34.90, 'https://picsum.photos/seed/product2/300/300', 'fisico', 30),
  ('E-book: Guia do Escritor', 'Guia completo para escritores iniciantes', 19.90, 'https://picsum.photos/seed/product3/300/300', 'digital', 999),
  ('Marcador de Página Premium', 'Marcador de metal com design exclusivo', 24.90, 'https://picsum.photos/seed/product4/300/300', 'fisico', 100)
ON CONFLICT DO NOTHING;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para USERS (todos podem ler, apenas próprio usuário pode atualizar)
CREATE POLICY "Usuários podem ler todos os perfis" ON users
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para STORIES (todos podem ler, apenas autor pode modificar)
CREATE POLICY "Todos podem ler histórias" ON stories
  FOR SELECT USING (true);

CREATE POLICY "Autores podem criar histórias" ON stories
  FOR INSERT WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Autores podem atualizar próprias histórias" ON stories
  FOR UPDATE USING (auth.uid() = autor_id);

CREATE POLICY "Autores podem deletar próprias histórias" ON stories
  FOR DELETE USING (auth.uid() = autor_id);

-- Políticas para CHAPTERS (todos podem ler, apenas autor da história pode modificar)
CREATE POLICY "Todos podem ler capítulos" ON chapters
  FOR SELECT USING (true);

CREATE POLICY "Autores podem criar capítulos" ON chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = historia_id AND autor_id = auth.uid()
    )
  );

CREATE POLICY "Autores podem atualizar capítulos" ON chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = historia_id AND autor_id = auth.uid()
    )
  );

CREATE POLICY "Autores podem deletar capítulos" ON chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = historia_id AND autor_id = auth.uid()
    )
  );

-- Políticas para COMMENTS (todos podem ler, apenas autor pode modificar)
CREATE POLICY "Todos podem ler comentários" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar comentários" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios comentários" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para LIKES (usuários autenticados podem gerenciar próprios likes)
CREATE POLICY "Todos podem ler likes de histórias" ON story_likes
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem dar like em histórias" ON story_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover próprios likes" ON story_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Todos podem ler likes de capítulos" ON chapter_likes
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem dar like em capítulos" ON chapter_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover próprios likes de capítulos" ON chapter_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para SUBSCRIPTIONS (seguir histórias)
CREATE POLICY "Usuários podem ver próprias inscrições" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem seguir histórias" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deixar de seguir histórias" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para NOTIFICATIONS
CREATE POLICY "Usuários podem ver próprias notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprias notificações" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar data_atualizacao em stories
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar notificação quando novo capítulo é publicado
CREATE OR REPLACE FUNCTION notify_followers_new_chapter()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, chapter_id)
  SELECT user_id, NEW.id
  FROM subscriptions
  WHERE story_id = NEW.historia_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar seguidores
CREATE TRIGGER notify_on_new_chapter
  AFTER INSERT ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION notify_followers_new_chapter();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de histórias
CREATE OR REPLACE VIEW story_stats AS
SELECT 
  s.id,
  s.titulo,
  s.autor_id,
  COUNT(DISTINCT c.id) as total_chapters,
  COUNT(DISTINCT sl.user_id) as total_likes,
  COUNT(DISTINCT sub.user_id) as total_followers,
  COUNT(DISTINCT com.id) as total_comments
FROM stories s
LEFT JOIN chapters c ON s.id = c.historia_id
LEFT JOIN story_likes sl ON s.id = sl.story_id
LEFT JOIN subscriptions sub ON s.id = sub.story_id
LEFT JOIN comments com ON c.id = com.chapter_id
GROUP BY s.id, s.titulo, s.autor_id;

-- =====================================================
-- FINALIZAÇÃO
-- =====================================================
-- Schema criado com sucesso!
-- Próximos passos:
-- 1. Configurar Supabase Auth
-- 2. Configurar Supabase Storage para uploads
-- 3. Atualizar frontend para usar Supabase Client
-- =====================================================
