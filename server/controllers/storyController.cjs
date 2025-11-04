const db = require('../config/database.cjs');

// Listar todas as histórias com filtros
const getAllStories = (req, res) => {
  const { idioma, genero, search, page = 1, limit = 8 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT DISTINCT s.*, u.nome_usuario as autor_nome, u.avatar_url as autor_avatar,
           (SELECT COUNT(*) FROM story_likes WHERE storyId = s.id) as like_count,
           (SELECT COUNT(*) FROM chapters c 
            LEFT JOIN comments co ON c.id = co.chapterId 
            WHERE c.historia_id = s.id) as comment_count,
           (SELECT COUNT(*) FROM chapters WHERE historia_id = s.id) as chapter_count
    FROM stories s
    LEFT JOIN users u ON s.autor_id = u.id
    LEFT JOIN story_genres sg ON s.id = sg.story_id
    WHERE 1=1
  `;

  const params = [];

  if (idioma && idioma !== 'all') {
    query += ' AND s.idioma = ?';
    params.push(idioma);
  }

  if (genero && genero !== 'all') {
    query += ' AND sg.genre_id = ?';
    params.push(parseInt(genero));
  }

  if (search) {
    query += ' AND (s.titulo LIKE ? OR u.nome_usuario LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Contar total
  const countQuery = `SELECT COUNT(DISTINCT s.id) as total FROM stories s 
                      LEFT JOIN users u ON s.autor_id = u.id
                      LEFT JOIN story_genres sg ON s.id = sg.story_id
                      WHERE 1=1 ${idioma && idioma !== 'all' ? 'AND s.idioma = ?' : ''} 
                      ${genero && genero !== 'all' ? 'AND sg.genre_id = ?' : ''}
                      ${search ? 'AND (s.titulo LIKE ? OR u.nome_usuario LIKE ?)' : ''}`;

  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao contar histórias' });
    }

    query += ' ORDER BY s.data_atualizacao DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, stories) => {
      if (err) {
        console.error('Erro ao buscar histórias:', err);
        return res.status(500).json({ error: 'Erro ao buscar histórias' });
      }

      // Buscar gêneros de cada história
      const storiesWithGenres = [];
      let processed = 0;

      if (stories.length === 0) {
        return res.json({
          stories: [],
          total: 0,
          page: parseInt(page),
          totalPages: 0
        });
      }

      stories.forEach(story => {
        db.all('SELECT g.id, g.nome FROM genres g INNER JOIN story_genres sg ON g.id = sg.genre_id WHERE sg.story_id = ?', [story.id], (err, genres) => {
          if (!err) {
            story.generos = genres.map(g => g.id);
            story.generos_nomes = genres.map(g => g.nome);
          }
          storiesWithGenres.push(story);
          processed++;

          if (processed === stories.length) {
            res.json({
              stories: storiesWithGenres,
              total: countResult.total,
              page: parseInt(page),
              totalPages: Math.ceil(countResult.total / limit)
            });
          }
        });
      });
    });
  });
};

// Buscar história por ID
const getStoryById = (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT s.*, u.nome_usuario as autor_nome, u.avatar_url as autor_avatar, u.id as autor_id,
           (SELECT COUNT(*) FROM story_likes WHERE storyId = s.id) as like_count,
           (SELECT COUNT(*) FROM subscriptions WHERE storyId = s.id) as follower_count
    FROM stories s
    LEFT JOIN users u ON s.autor_id = u.id
    WHERE s.id = ?
  `, [id], (err, story) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar história' });
    }

    if (!story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    // Buscar gêneros
    db.all('SELECT g.id, g.nome FROM genres g INNER JOIN story_genres sg ON g.id = sg.genre_id WHERE sg.story_id = ?', [id], (err, genres) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar gêneros' });
      }

      story.generos = genres.map(g => g.id);
      story.generos_nomes = genres.map(g => g.nome);

      // Buscar capítulos
      db.all('SELECT id, numero_capitulo, titulo_capitulo, data_publicacao, isPremium FROM chapters WHERE historia_id = ? ORDER BY numero_capitulo', [id], (err, chapters) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao buscar capítulos' });
        }

        story.chapters = chapters;

        // Verificar se usuário segue a história
        if (req.user) {
          db.get('SELECT 1 FROM subscriptions WHERE userId = ? AND storyId = ?', [req.user.id, id], (err, subscription) => {
            story.isFollowing = !!subscription;
            
            // Verificar se usuário curtiu
            db.get('SELECT 1 FROM story_likes WHERE userId = ? AND storyId = ?', [req.user.id, id], (err, like) => {
              story.isLiked = !!like;
              res.json(story);
            });
          });
        } else {
          story.isFollowing = false;
          story.isLiked = false;
          res.json(story);
        }
      });
    });
  });
};

// Criar nova história
const createStory = (req, res) => {
  const { titulo, sinopse, capa_url, idioma, status, tipo, isPremium, generos } = req.body;
  const autor_id = req.user.id;

  // Validações
  if (!titulo || !idioma || !status || !tipo) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  db.run(
    'INSERT INTO stories (autor_id, titulo, sinopse, capa_url, idioma, status, tipo, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [autor_id, titulo, sinopse, capa_url, idioma, status, tipo, isPremium ? 1 : 0],
    function(err) {
      if (err) {
        console.error('Erro ao criar história:', err);
        return res.status(500).json({ error: 'Erro ao criar história' });
      }

      const storyId = this.lastID;

      // Inserir gêneros
      if (generos && generos.length > 0) {
        const insertGenre = db.prepare('INSERT INTO story_genres (story_id, genre_id) VALUES (?, ?)');
        generos.forEach(genreId => {
          insertGenre.run(storyId, genreId);
        });
        insertGenre.finalize();
      }

      res.status(201).json({
        message: 'História criada com sucesso',
        id: storyId
      });
    }
  );
};

// Atualizar história
const updateStory = (req, res) => {
  const { id } = req.params;
  const { titulo, sinopse, capa_url, idioma, status, tipo, isPremium, generos } = req.body;

  // Verificar se é o autor
  db.get('SELECT autor_id FROM stories WHERE id = ?', [id], (err, story) => {
    if (err || !story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    if (story.autor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para editar esta história' });
    }

    db.run(
      'UPDATE stories SET titulo = ?, sinopse = ?, capa_url = ?, idioma = ?, status = ?, tipo = ?, isPremium = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?',
      [titulo, sinopse, capa_url, idioma, status, tipo, isPremium ? 1 : 0, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar história' });
        }

        // Atualizar gêneros
        if (generos) {
          db.run('DELETE FROM story_genres WHERE story_id = ?', [id], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao atualizar gêneros' });
            }

            const insertGenre = db.prepare('INSERT INTO story_genres (story_id, genre_id) VALUES (?, ?)');
            generos.forEach(genreId => {
              insertGenre.run(id, genreId);
            });
            insertGenre.finalize();

            res.json({ message: 'História atualizada com sucesso' });
          });
        } else {
          res.json({ message: 'História atualizada com sucesso' });
        }
      }
    );
  });
};

// Deletar história
const deleteStory = (req, res) => {
  const { id } = req.params;

  // Verificar se é o autor
  db.get('SELECT autor_id FROM stories WHERE id = ?', [id], (err, story) => {
    if (err || !story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    if (story.autor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para deletar esta história' });
    }

    db.run('DELETE FROM stories WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar história' });
      }

      res.json({ message: 'História deletada com sucesso' });
    });
  });
};

// Curtir/Descurtir história
const toggleLike = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT 1 FROM story_likes WHERE storyId = ? AND userId = ?', [id, userId], (err, like) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar curtida' });
    }

    if (like) {
      // Remover curtida
      db.run('DELETE FROM story_likes WHERE storyId = ? AND userId = ?', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover curtida' });
        }
        res.json({ message: 'Curtida removida', isLiked: false });
      });
    } else {
      // Adicionar curtida
      db.run('INSERT INTO story_likes (storyId, userId) VALUES (?, ?)', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao adicionar curtida' });
        }
        res.json({ message: 'História curtida', isLiked: true });
      });
    }
  });
};

// Seguir/Deixar de seguir história
const toggleFollow = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT 1 FROM subscriptions WHERE storyId = ? AND userId = ?', [id, userId], (err, subscription) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar inscrição' });
    }

    if (subscription) {
      // Remover inscrição
      db.run('DELETE FROM subscriptions WHERE storyId = ? AND userId = ?', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover inscrição' });
        }
        res.json({ message: 'Deixou de seguir a história', isFollowing: false });
      });
    } else {
      // Adicionar inscrição
      db.run('INSERT INTO subscriptions (storyId, userId) VALUES (?, ?)', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao adicionar inscrição' });
        }
        res.json({ message: 'Agora você está seguindo esta história', isFollowing: true });
      });
    }
  });
};

// Buscar histórias do autor
const getStoriesByAuthor = (req, res) => {
  const { authorId } = req.params;

  db.all(`
    SELECT s.*, 
           (SELECT COUNT(*) FROM chapters WHERE historia_id = s.id) as chapter_count,
           (SELECT COUNT(*) FROM story_likes WHERE storyId = s.id) as like_count
    FROM stories s
    WHERE s.autor_id = ?
    ORDER BY s.data_atualizacao DESC
  `, [authorId], (err, stories) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar histórias do autor' });
    }

    res.json(stories);
  });
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleLike,
  toggleFollow,
  getStoriesByAuthor
};
