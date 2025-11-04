const db = require('./database.cjs');

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de usuários
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome_usuario TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          avatar_url TEXT,
          role TEXT DEFAULT 'user' CHECK(role IN ('user', 'author', 'admin')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de gêneros
      db.run(`
        CREATE TABLE IF NOT EXISTS genres (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL UNIQUE
        )
      `);

      // Tabela de histórias
      db.run(`
        CREATE TABLE IF NOT EXISTS stories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          autor_id INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          sinopse TEXT,
          capa_url TEXT,
          idioma TEXT NOT NULL CHECK(idioma IN ('pt', 'en', 'es')),
          status TEXT NOT NULL CHECK(status IN ('em_andamento', 'concluida', 'hiato')),
          tipo TEXT NOT NULL CHECK(tipo IN ('livro', 'conto', 'fanfic')),
          isPremium INTEGER DEFAULT 0,
          data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (autor_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Tabela de relacionamento história-gênero (muitos para muitos)
      db.run(`
        CREATE TABLE IF NOT EXISTS story_genres (
          story_id INTEGER NOT NULL,
          genre_id INTEGER NOT NULL,
          PRIMARY KEY (story_id, genre_id),
          FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
          FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
        )
      `);

      // Tabela de capítulos
      db.run(`
        CREATE TABLE IF NOT EXISTS chapters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          historia_id INTEGER NOT NULL,
          numero_capitulo INTEGER NOT NULL,
          titulo_capitulo TEXT NOT NULL,
          conteudo TEXT NOT NULL,
          isPremium INTEGER DEFAULT 0,
          data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (historia_id) REFERENCES stories(id) ON DELETE CASCADE,
          UNIQUE(historia_id, numero_capitulo)
        )
      `);

      // Tabela de comentários
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chapterId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          content TEXT NOT NULL,
          isReported INTEGER DEFAULT 0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chapterId) REFERENCES chapters(id) ON DELETE CASCADE,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Tabela de curtidas em histórias
      db.run(`
        CREATE TABLE IF NOT EXISTS story_likes (
          storyId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          PRIMARY KEY (storyId, userId),
          FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Tabela de curtidas em capítulos
      db.run(`
        CREATE TABLE IF NOT EXISTS chapter_likes (
          chapterId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          PRIMARY KEY (chapterId, userId),
          FOREIGN KEY (chapterId) REFERENCES chapters(id) ON DELETE CASCADE,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Tabela de inscrições em histórias (follows)
      db.run(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          userId INTEGER NOT NULL,
          storyId INTEGER NOT NULL,
          PRIMARY KEY (userId, storyId),
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE
        )
      `);

      // Tabela de notificações
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          chapterId INTEGER NOT NULL,
          isRead INTEGER DEFAULT 0,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (chapterId) REFERENCES chapters(id) ON DELETE CASCADE
        )
      `);

      // Tabela de planos de assinatura
      db.run(`
        CREATE TABLE IF NOT EXISTS subscription_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          description TEXT,
          durationDays INTEGER NOT NULL
        )
      `);

      // Tabela de assinaturas de usuários
      db.run(`
        CREATE TABLE IF NOT EXISTS user_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          planId INTEGER NOT NULL,
          startDate DATETIME NOT NULL,
          endDate DATETIME NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (planId) REFERENCES subscription_plans(id) ON DELETE CASCADE
        )
      `);

      // Tabela de produtos
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          coverUrl TEXT,
          type TEXT NOT NULL CHECK(type IN ('book', 'ebook'))
        )
      `);

      // Tabela de vendas
      db.run(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          total REAL NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Tabela de itens de venda
      db.run(`
        CREATE TABLE IF NOT EXISTS sale_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saleId INTEGER NOT NULL,
          productId INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
          FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabelas:', err.message);
          reject(err);
        } else {
          console.log('Tabelas criadas com sucesso!');
          resolve();
        }
      });
    });
  });
};

module.exports = initDatabase;
