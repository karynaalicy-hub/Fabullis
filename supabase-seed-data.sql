-- =====================================================
-- FABULIS - Dados Iniciais (Seed Data)
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- APÓS executar o supabase-schema.sql
-- =====================================================

-- =====================================================
-- IMPORTANTE: Criar usuários de teste
-- =====================================================
-- Os usuários precisam ser criados via Supabase Auth primeiro
-- Depois, insira os registros na tabela users com os IDs corretos

-- Para criar usuários de teste:
-- 1. Vá em Authentication → Users no Supabase Dashboard
-- 2. Clique em "Add user" → "Create new user"
-- 3. Crie 3 usuários:
--    - aline@example.com (senha: senha123)
--    - bruno@example.com (senha: senha123)
--    - carlos@example.com (senha: senha123)
-- 4. Copie os UUIDs gerados e substitua abaixo

-- OU use este script para criar os usuários (requer permissões de admin):
-- Substitua 'USER_ID_1', 'USER_ID_2', 'USER_ID_3' pelos IDs reais após criar os usuários

-- =====================================================
-- INSERIR USUÁRIOS NA TABELA USERS
-- =====================================================
-- ATENÇÃO: Substitua os IDs abaixo pelos UUIDs reais dos usuários criados no Supabase Auth

-- Exemplo de como inserir (após criar usuários no Auth):
-- INSERT INTO users (id, nome_usuario, email, role, bio) VALUES
--   ('UUID_DO_USUARIO_1', 'Aline Reis', 'aline@example.com', 'admin', 'Escritora e administradora da plataforma'),
--   ('UUID_DO_USUARIO_2', 'Bruno Costa', 'bruno@example.com', 'author', 'Escritor de ficção científica'),
--   ('UUID_DO_USUARIO_3', 'Carlos Silva', 'carlos@example.com', 'author', 'Autor de mistério e suspense');

-- =====================================================
-- INSERIR HISTÓRIAS
-- =====================================================
-- ATENÇÃO: Substitua 'USER_ID_1', 'USER_ID_2', 'USER_ID_3' pelos UUIDs reais

-- História 1: As Crônicas de Eldoria (Aline Reis)
INSERT INTO stories (titulo, sinopse, capa_url, idioma, status, tipo, is_premium, autor_id) VALUES
(
  'As Crônicas de Eldoria',
  'Em um mundo onde a magia está morrendo, uma jovem elfa embarca em uma jornada perigosa para salvar seu povo. Acompanhe Lyra através de florestas encantadas, cidades perdidas e segredos ancestrais.',
  'https://picsum.photos/seed/story1/400/600',
  'pt',
  'em_andamento',
  'livro',
  false,
  'USER_ID_1' -- Substituir pelo UUID de aline@example.com
);

-- História 2: O Segredo do Farol (Aline Reis)
INSERT INTO stories (titulo, sinopse, capa_url, idioma, status, tipo, is_premium, autor_id) VALUES
(
  'O Segredo do Farol',
  'Um conto sobre um velho faroleiro que guarda um segredo antigo, e a jornalista curiosa que está determinada a descobri-lo. Uma história de mistério à beira-mar.',
  'https://picsum.photos/seed/story3/400/600',
  'pt',
  'concluida',
  'conto',
  false,
  'USER_ID_1' -- Substituir pelo UUID de aline@example.com
);

-- História 3: La Sombra del Pasado (Carlos Silva)
INSERT INTO stories (titulo, sinopse, capa_url, idioma, status, tipo, is_premium, autor_id) VALUES
(
  'La Sombra del Pasado',
  'Un detective privado en Madrid es contratado para encontrar a una mujer desaparecida, solo para descubrir que su pasado está lleno de secretos oscuros.',
  'https://picsum.photos/seed/story4/400/600',
  'es',
  'em_andamento',
  'livro',
  false,
  'USER_ID_3' -- Substituir pelo UUID de carlos@example.com
);

-- História 4: Heart of the Nebula (Bruno Costa)
INSERT INTO stories (titulo, sinopse, capa_url, idioma, status, tipo, is_premium, autor_id) VALUES
(
  'Heart of the Nebula',
  'A forbidden romance between a starship captain and an android diplomat could spark an interstellar war. A sci-fi epic about love, duty, and the future of humanity.',
  'https://picsum.photos/seed/story5/400/600',
  'en',
  'em_andamento',
  'livro',
  true,
  'USER_ID_2' -- Substituir pelo UUID de bruno@example.com
);

-- =====================================================
-- ASSOCIAR GÊNEROS ÀS HISTÓRIAS
-- =====================================================
-- Assumindo que os IDs das histórias são 1, 2, 3, 4 (auto-incrementados)

-- As Crônicas de Eldoria: Fantasia, Aventura
INSERT INTO story_genres (story_id, genre_id) VALUES
  (1, 1), -- Fantasia
  (1, 2); -- Aventura

-- O Segredo do Farol: Mistério, Romance
INSERT INTO story_genres (story_id, genre_id) VALUES
  (2, 5), -- Mistério
  (2, 3); -- Romance

-- La Sombra del Pasado: Mistério, Terror
INSERT INTO story_genres (story_id, genre_id) VALUES
  (3, 5), -- Mistério
  (3, 6); -- Terror

-- Heart of the Nebula: Ficção Científica, Romance
INSERT INTO story_genres (story_id, genre_id) VALUES
  (4, 4), -- Ficção Científica
  (4, 3); -- Romance

-- =====================================================
-- INSERIR CAPÍTULOS
-- =====================================================

-- Capítulos para "As Crônicas de Eldoria" (História 1)
INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, is_premium) VALUES
(
  1,
  1,
  'O Chamado da Floresta',
  'O vento sussurrava segredos antigos entre as árvores da Floresta das Sombras. Lyra, com seus ouvidos élficos atentos, sentiu uma perturbação na magia que fluía pela terra. Era um chamado, fraco mas insistente, que a puxava para o coração da floresta, onde nenhum elfo se aventurava há séculos. A aventura estava prestes a começar...',
  false
),
(
  1,
  2,
  'A Cidade Perdida',
  'Após dias de viagem, Lyra finalmente encontrou as ruínas da antiga cidade élfica de Silvermoon. Entre as pedras cobertas de musgo e vinhas, ela descobriu inscrições que falavam de um artefato poderoso - a Pedra da Eternidade. Mas ela não estava sozinha...',
  false
),
(
  1,
  3,
  'O Guardião de Pedra',
  'Um golem gigante de pedra bloqueava a entrada para o templo central. Seus olhos brilhavam com uma luz azul antiga, e sua voz ecoava como trovão: "Apenas os dignos podem passar. Prove seu valor, filha de Eldoria." Lyra desembainhou sua espada, sabendo que a verdadeira prova estava apenas começando.',
  false
);

-- Capítulo para "La Sombra del Pasado" (História 3)
INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, is_premium) VALUES
(
  3,
  1,
  'La Llamada',
  'El teléfono sonó a medianoche. Una voz femenina, temblorosa, susurró: "Detective Ramírez, necesito su ayuda. Mi hermana ha desaparecido y la policía no hace nada." Así comenzó el caso que cambiaría mi vida para siempre.',
  false
);

-- =====================================================
-- DADOS INSERIDOS COM SUCESSO!
-- =====================================================
-- Próximos passos:
-- 1. Criar usuários no Supabase Auth
-- 2. Substituir os USER_ID_X pelos UUIDs reais
-- 3. Executar este script
-- 4. Testar o site!
-- =====================================================
