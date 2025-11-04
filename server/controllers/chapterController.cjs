const db = require('../config/database.cjs');

// Buscar capítulo por ID
const getChapterById = (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT c.*, s.titulo as historia_titulo, s.autor_id, s.isPremium as historia_isPremium
    FROM chapters c
    LEFT JOIN stories s ON c.historia_id = s.id
    WHERE c.id = ?
  `, [id], (err, chapter) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar capítulo' });
    }

    if (!chapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    // Verificar se usuário tem acesso ao conteúdo premium
    if (chapter.isPremium || chapter.historia_isPremium) {
      if (!req.user) {
        chapter.conteudo = null;
        chapter.needsSubscription = true;
        return res.json(chapter);
      }

      // Verificar assinatura ativa
      const now = new Date().toISOString();
      db.get(
        'SELECT 1 FROM user_subscriptions WHERE userId = ? AND endDate > ?',
        [req.user.id, now],
        (err, subscription) => {
          if (!subscription && req.user.id !== chapter.autor_id) {
            chapter.conteudo = null;
            chapter.needsSubscription = true;
          }
          res.json(chapter);
        }
      );
    } else {
      res.json(chapter);
    }
  });
};

// Buscar capítulos de uma história
const getChaptersByStory = (req, res) => {
  const { storyId } = req.params;

  db.all(`
    SELECT c.id, c.numero_capitulo, c.titulo_capitulo, c.data_publicacao, c.isPremium,
           (SELECT COUNT(*) FROM chapter_likes WHERE chapterId = c.id) as like_count,
           (SELECT COUNT(*) FROM comments WHERE chapterId = c.id) as comment_count
    FROM chapters c
    WHERE c.historia_id = ?
    ORDER BY c.numero_capitulo
  `, [storyId], (err, chapters) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar capítulos' });
    }

    res.json(chapters);
  });
};

// Criar novo capítulo
const createChapter = (req, res) => {
  const { historia_id, titulo_capitulo, conteudo, isPremium } = req.body;

  // Verificar se é o autor da história
  db.get('SELECT autor_id FROM stories WHERE id = ?', [historia_id], (err, story) => {
    if (err || !story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    if (story.autor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para adicionar capítulo a esta história' });
    }

    // Buscar próximo número de capítulo
    db.get('SELECT MAX(numero_capitulo) as max_numero FROM chapters WHERE historia_id = ?', [historia_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar número do capítulo' });
      }

      const numero_capitulo = (result.max_numero || 0) + 1;

      db.run(
        'INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, isPremium) VALUES (?, ?, ?, ?, ?)',
        [historia_id, numero_capitulo, titulo_capitulo, conteudo, isPremium ? 1 : 0],
        function(err) {
          if (err) {
            console.error('Erro ao criar capítulo:', err);
            return res.status(500).json({ error: 'Erro ao criar capítulo' });
          }

          // Atualizar data de atualização da história
          db.run('UPDATE stories SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?', [historia_id]);

          // Criar notificações para seguidores
          db.all('SELECT userId FROM subscriptions WHERE storyId = ?', [historia_id], (err, followers) => {
            if (!err && followers.length > 0) {
              const insertNotification = db.prepare('INSERT INTO notifications (userId, chapterId) VALUES (?, ?)');
              followers.forEach(follower => {
                insertNotification.run(follower.userId, this.lastID);
              });
              insertNotification.finalize();
            }
          });

          res.status(201).json({
            message: 'Capítulo criado com sucesso',
            id: this.lastID,
            numero_capitulo
          });
        }
      );
    });
  });
};

// Atualizar capítulo
const updateChapter = (req, res) => {
  const { id } = req.params;
  const { titulo_capitulo, conteudo, isPremium } = req.body;

  // Verificar se é o autor
  db.get(`
    SELECT s.autor_id 
    FROM chapters c
    LEFT JOIN stories s ON c.historia_id = s.id
    WHERE c.id = ?
  `, [id], (err, chapter) => {
    if (err || !chapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    if (chapter.autor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para editar este capítulo' });
    }

    db.run(
      'UPDATE chapters SET titulo_capitulo = ?, conteudo = ?, isPremium = ? WHERE id = ?',
      [titulo_capitulo, conteudo, isPremium ? 1 : 0, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar capítulo' });
        }

        res.json({ message: 'Capítulo atualizado com sucesso' });
      }
    );
  });
};

// Deletar capítulo
const deleteChapter = (req, res) => {
  const { id } = req.params;

  // Verificar se é o autor
  db.get(`
    SELECT s.autor_id, c.historia_id
    FROM chapters c
    LEFT JOIN stories s ON c.historia_id = s.id
    WHERE c.id = ?
  `, [id], (err, chapter) => {
    if (err || !chapter) {
      return res.status(404).json({ error: 'Capítulo não encontrado' });
    }

    if (chapter.autor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para deletar este capítulo' });
    }

    db.run('DELETE FROM chapters WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar capítulo' });
      }

      // Atualizar data de atualização da história
      db.run('UPDATE stories SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?', [chapter.historia_id]);

      res.json({ message: 'Capítulo deletado com sucesso' });
    });
  });
};

// Curtir/Descurtir capítulo
const toggleLike = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT 1 FROM chapter_likes WHERE chapterId = ? AND userId = ?', [id, userId], (err, like) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar curtida' });
    }

    if (like) {
      // Remover curtida
      db.run('DELETE FROM chapter_likes WHERE chapterId = ? AND userId = ?', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover curtida' });
        }
        res.json({ message: 'Curtida removida', isLiked: false });
      });
    } else {
      // Adicionar curtida
      db.run('INSERT INTO chapter_likes (chapterId, userId) VALUES (?, ?)', [id, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao adicionar curtida' });
        }
        res.json({ message: 'Capítulo curtido', isLiked: true });
      });
    }
  });
};

// Buscar comentários de um capítulo
const getComments = (req, res) => {
  const { id } = req.params;

  db.all(`
    SELECT c.*, u.nome_usuario, u.avatar_url
    FROM comments c
    LEFT JOIN users u ON c.userId = u.id
    WHERE c.chapterId = ?
    ORDER BY c.timestamp ASC
  `, [id], (err, comments) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar comentários' });
    }

    res.json(comments);
  });
};

// Adicionar comentário
const addComment = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comentário não pode estar vazio' });
  }

  db.run(
    'INSERT INTO comments (chapterId, userId, content) VALUES (?, ?, ?)',
    [id, userId, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao adicionar comentário' });
      }

      // Buscar comentário criado com dados do usuário
      db.get(`
        SELECT c.*, u.nome_usuario, u.avatar_url
        FROM comments c
        LEFT JOIN users u ON c.userId = u.id
        WHERE c.id = ?
      `, [this.lastID], (err, comment) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao buscar comentário' });
        }

        res.status(201).json(comment);
      });
    }
  );
};

module.exports = {
  getChapterById,
  getChaptersByStory,
  createChapter,
  updateChapter,
  deleteChapter,
  toggleLike,
  getComments,
  addComment
};
