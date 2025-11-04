-- =====================================================
-- FABULIS - Inserir Dados Iniciais
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. INSERIR USUÁRIOS NA TABELA USERS
-- =====================================================

INSERT INTO users (id, nome_usuario, email, role, bio, avatar_url) VALUES
  ('ea637bf7-dd44-4497-b1fd-2def43b210e4', 'Aline Reis', 'aline@example.com', 'admin', 'Escritora e administradora da plataforma', 'https://picsum.photos/seed/user1/100/100'),
  ('06d92233-ac89-412e-8d0c-f1bad9f4933b', 'Bruno Costa', 'bruno@example.com', 'author', 'Escritor de ficção científica', 'https://picsum.photos/seed/user2/100/100'),
  ('5a795004-f9d3-42c4-a5a4-624da1d28e00', 'Carlos Silva', 'carlos@example.com', 'author', 'Autor de mistério e suspense', 'https://picsum.photos/seed/user3/100/100')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. INSERIR HISTÓRIAS
-- =====================================================

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
  'ea637bf7-dd44-4497-b1fd-2def43b210e4'
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
  'ea637bf7-dd44-4497-b1fd-2def43b210e4'
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
  '5a795004-f9d3-42c4-a5a4-624da1d28e00'
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
  '06d92233-ac89-412e-8d0c-f1bad9f4933b'
);

-- =====================================================
-- 3. ASSOCIAR GÊNEROS ÀS HISTÓRIAS
-- =====================================================

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
-- 4. INSERIR CAPÍTULOS
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

-- Capítulo para "O Segredo do Farol" (História 2)
INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, is_premium) VALUES
(
  2,
  1,
  'O Faroleiro',
  'O velho Manuel acendia o farol todas as noites há 40 anos. Mas hoje, quando a jornalista Ana chegou para entrevistá-lo, ela notou algo estranho: uma porta trancada no porão que ele jurava não existir.',
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

-- Capítulos para "Heart of the Nebula" (História 4)
INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, is_premium) VALUES
(
  4,
  1,
  'First Contact',
  'Captain Sarah Chen stood on the bridge of the Starship Horizon, watching the diplomatic vessel approach. Inside was Ambassador X-7, the first android to represent the Synthetic Collective. She had no idea that this meeting would change everything.',
  true
),
(
  4,
  2,
  'Forbidden Feelings',
  'Three months into the peace negotiations, Sarah found herself thinking about X-7 more than she should. The android was logical, precise, and somehow... captivating. But falling for a synthetic being could cost her everything.',
  true
);

-- =====================================================
-- 5. ADICIONAR ALGUNS LIKES E SEGUIDORES
-- =====================================================

-- Aline segue a história de Bruno
INSERT INTO subscriptions (user_id, story_id) VALUES
  ('ea637bf7-dd44-4497-b1fd-2def43b210e4', 4);

-- Bruno segue a história de Aline
INSERT INTO subscriptions (user_id, story_id) VALUES
  ('06d92233-ac89-412e-8d0c-f1bad9f4933b', 1);

-- Carlos segue ambas
INSERT INTO subscriptions (user_id, story_id) VALUES
  ('5a795004-f9d3-42c4-a5a4-624da1d28e00', 1),
  ('5a795004-f9d3-42c4-a5a4-624da1d28e00', 4);

-- Alguns likes nas histórias
INSERT INTO story_likes (story_id, user_id) VALUES
  (1, '06d92233-ac89-412e-8d0c-f1bad9f4933b'),
  (1, '5a795004-f9d3-42c4-a5a4-624da1d28e00'),
  (4, 'ea637bf7-dd44-4497-b1fd-2def43b210e4'),
  (4, '5a795004-f9d3-42c4-a5a4-624da1d28e00');

-- Alguns likes nos capítulos
INSERT INTO chapter_likes (chapter_id, user_id) VALUES
  (1, '06d92233-ac89-412e-8d0c-f1bad9f4933b'),
  (1, '5a795004-f9d3-42c4-a5a4-624da1d28e00'),
  (2, 'ea637bf7-dd44-4497-b1fd-2def43b210e4');

-- =====================================================
-- 6. ADICIONAR ALGUNS COMENTÁRIOS
-- =====================================================

INSERT INTO comments (chapter_id, user_id, content) VALUES
  (1, '06d92233-ac89-412e-8d0c-f1bad9f4933b', 'Que começo empolgante! Mal posso esperar para ver o que acontece com a Lyra.'),
  (1, '5a795004-f9d3-42c4-a5a4-624da1d28e00', 'A descrição da Floresta das Sombras é incrível. Me senti lá!'),
  (2, 'ea637bf7-dd44-4497-b1fd-2def43b210e4', 'A Cidade Perdida parece fascinante. Adorei a referência à Pedra da Eternidade.');

-- =====================================================
-- DADOS INSERIDOS COM SUCESSO!
-- =====================================================
-- Agora você pode testar o site com dados reais do Supabase!
-- =====================================================
