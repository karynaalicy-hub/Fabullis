const db = require('./database.cjs');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Hash de senha padrão
      const hashedPassword = await bcrypt.hash('senha123', 10);

      db.serialize(() => {
        // Inserir usuários
        const users = [
          { nome_usuario: 'Aline Reis', email: 'aline@example.com', avatar_url: 'https://picsum.photos/seed/user1/100/100', role: 'admin' },
          { nome_usuario: 'Bruno Costa', email: 'bruno@example.com', avatar_url: 'https://picsum.photos/seed/user2/100/100', role: 'author' },
          { nome_usuario: 'Carlos Silva', email: 'carlos@example.com', avatar_url: null, role: 'author' }
        ];

        const insertUser = db.prepare('INSERT OR IGNORE INTO users (nome_usuario, email, password, avatar_url, role) VALUES (?, ?, ?, ?, ?)');
        users.forEach(user => {
          insertUser.run(user.nome_usuario, user.email, hashedPassword, user.avatar_url, user.role);
        });
        insertUser.finalize();

        // Inserir gêneros
        const genres = ['Fantasia', 'Aventura', 'Romance', 'Ficção Científica', 'Mistério', 'Terror'];
        const insertGenre = db.prepare('INSERT OR IGNORE INTO genres (nome) VALUES (?)');
        genres.forEach(genre => insertGenre.run(genre));
        insertGenre.finalize();

        // Inserir histórias
        const stories = [
          {
            autor_id: 1,
            titulo: 'As Crônicas de Eldoria',
            sinopse: 'Em um mundo onde a magia está morrendo, uma jovem elfa embarca em uma jornada perigosa para restaurar o equilíbrio e salvar seu povo da escuridão iminente. Uma aventura épica cheia de perigos e maravilhas.',
            capa_url: 'https://picsum.photos/seed/story1/400/600',
            idioma: 'pt',
            status: 'em_andamento',
            tipo: 'livro',
            isPremium: 1,
            generos: [1, 2]
          },
          {
            autor_id: 2,
            titulo: 'Echoes of the Void',
            sinopse: 'The last human scavenger ship discovers a derelict alien vessel broadcasting a distress signal. What they find inside could either be humanity\'s salvation or its final doom.',
            capa_url: 'https://picsum.photos/seed/story2/400/600',
            idioma: 'en',
            status: 'concluida',
            tipo: 'livro',
            isPremium: 0,
            generos: [4, 6]
          },
          {
            autor_id: 1,
            titulo: 'O Segredo do Farol',
            sinopse: 'Um conto sobre um velho faroleiro que guarda um segredo antigo, e a jornalista curiosa que está determinada a descobri-lo, não importa o custo. Um mistério que se aprofunda com a maré.',
            capa_url: 'https://picsum.photos/seed/story3/400/600',
            idioma: 'pt',
            status: 'concluida',
            tipo: 'conto',
            isPremium: 0,
            generos: [5]
          },
          {
            autor_id: 3,
            titulo: 'La Sombra del Pasado',
            sinopse: 'Un detective privado en Madrid es contratado para encontrar a una mujer desaparecida, solo para descubrir que el caso está conectado con su propio pasado trágico. Una historia de amor y pérdida.',
            capa_url: 'https://picsum.photos/seed/story4/400/600',
            idioma: 'es',
            status: 'hiato',
            tipo: 'livro',
            isPremium: 0,
            generos: [5, 3]
          },
          {
            autor_id: 2,
            titulo: 'Heart of the Nebula',
            sinopse: 'A forbidden romance between a starship captain and an android diplomat could spark an interstellar war. They must navigate politics, prejudice, and their own feelings to find a path to peace.',
            capa_url: 'https://picsum.photos/seed/story5/400/600',
            idioma: 'en',
            status: 'em_andamento',
            tipo: 'fanfic',
            isPremium: 1,
            generos: [4, 3]
          }
        ];

        const insertStory = db.prepare('INSERT INTO stories (autor_id, titulo, sinopse, capa_url, idioma, status, tipo, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        stories.forEach((story, index) => {
          insertStory.run(story.autor_id, story.titulo, story.sinopse, story.capa_url, story.idioma, story.status, story.tipo, story.isPremium, function(err) {
            if (!err && this.lastID) {
              // Inserir gêneros da história
              const insertStoryGenre = db.prepare('INSERT INTO story_genres (story_id, genre_id) VALUES (?, ?)');
              story.generos.forEach(genreId => {
                insertStoryGenre.run(this.lastID, genreId);
              });
              insertStoryGenre.finalize();
            }
          });
        });
        insertStory.finalize();

        // Inserir capítulos
        const chapters = [
          { historia_id: 1, numero_capitulo: 1, titulo_capitulo: 'O Chamado da Floresta', conteudo: 'O vento sussurrava segredos antigos entre as árvores da Floresta das Sombras. Lyra, com seus ouvidos élficos atentos, sentiu uma perturbação na magia que fluía pela terra. Era um chamado, fraco mas insistente, que a puxava para o coração da floresta, onde nenhum elfo se aventurava há séculos. A aventura estava prestes a começar...', isPremium: 0 },
          { historia_id: 1, numero_capitulo: 2, titulo_capitulo: 'A Cidade Perdida', conteudo: 'Guiada por pistas enigmáticas, Lyra descobriu as ruínas de Aethelgard, uma cidade que se pensava ser apenas uma lenda. Lá, entre pedras cobertas de musgo, ela encontrou o primeiro artefato necessário para sua missão. No entanto, ela não estava sozinha; olhos sombrios a observavam das ruínas.', isPremium: 1 },
          { historia_id: 1, numero_capitulo: 3, titulo_capitulo: 'O Guardião de Pedra', conteudo: 'O artefato era protegido por um golem antigo. A batalha foi feroz, testando não apenas a habilidade de Lyra com o arco, mas também sua inteligência para resolver o enigma que o mantinha ativo. Com o guardião derrotado, o caminho para o sul se abriu.', isPremium: 1 },
          { historia_id: 2, numero_capitulo: 1, titulo_capitulo: 'The Signal', conteudo: 'Captain Eva Rostova watched the spectral analysis flicker on her screen. "It\'s old," she murmured, her voice barely a whisper in the quiet bridge of the \'Stardust Drifter\'. The signal was weak, repeating a pattern that was unmistakably a distress call. A Xylan distress call. But the Xylans had vanished a millennium ago.', isPremium: 0 },
          { historia_id: 2, numero_capitulo: 2, titulo_capitulo: 'Ghost Ship', conteudo: 'Docking with the alien vessel was an eerie experience. No lights, no movement, just the cold silence of space. The boarding party moved through corridors designed for beings much larger than humans, their flashlights cutting through the oppressive darkness. The air was stale, filled with an unidentifiable, metallic scent.', isPremium: 0 },
          { historia_id: 4, numero_capitulo: 1, titulo_capitulo: 'La Llamada', conteudo: 'El teléfono sonó en la quietud de la noche, despertando a Javier de un sueño inquieto. Era una voz que no esperaba volver a oír, la de un viejo amigo que le pedía un favor. Una mujer, Elena, había desaparecido. Y así, Javier fue arrastrado de vuelta al mundo que había intentado dejar atrás.', isPremium: 0 }
        ];

        const insertChapter = db.prepare('INSERT INTO chapters (historia_id, numero_capitulo, titulo_capitulo, conteudo, isPremium) VALUES (?, ?, ?, ?, ?)');
        chapters.forEach(chapter => {
          insertChapter.run(chapter.historia_id, chapter.numero_capitulo, chapter.titulo_capitulo, chapter.conteudo, chapter.isPremium);
        });
        insertChapter.finalize();

        // Inserir planos de assinatura
        const plans = [
          { name: 'Leitor Mensal', price: 14.90, description: 'Acesso a todo o conteúdo premium por um mês.', durationDays: 30 },
          { name: 'Leitor Anual', price: 149.90, description: 'Um ano de acesso com desconto exclusivo.', durationDays: 365 }
        ];

        const insertPlan = db.prepare('INSERT INTO subscription_plans (name, price, description, durationDays) VALUES (?, ?, ?, ?)');
        plans.forEach(plan => {
          insertPlan.run(plan.name, plan.price, plan.description, plan.durationDays);
        });
        insertPlan.finalize();

        // Inserir produtos
        const products = [
          { name: 'As Crônicas de Eldoria - Edição de Colecionador', description: 'Uma edição de luxo em capa dura da saga épica de Lyra.', price: 89.90, coverUrl: 'https://picsum.photos/seed/product1/400/600', type: 'book' },
          { name: 'Echoes of the Void - E-book', description: 'Leve a aventura de Eva Rostova para qualquer lugar com a versão digital.', price: 29.90, coverUrl: 'https://picsum.photos/seed/product2/400/600', type: 'ebook' },
          { name: 'O Segredo do Farol - Livro Físico', description: 'A edição impressa do conto de mistério que cativou leitores.', price: 45.50, coverUrl: 'https://picsum.photos/seed/product3/400/600', type: 'book' },
          { name: 'Fabullis Artbook Vol. 1', description: 'Uma coleção de artes conceituais das suas histórias favoritas.', price: 120.00, coverUrl: 'https://picsum.photos/seed/product4/400/600', type: 'book' }
        ];

        const insertProduct = db.prepare('INSERT INTO products (name, description, price, coverUrl, type) VALUES (?, ?, ?, ?, ?)');
        products.forEach(product => {
          insertProduct.run(product.name, product.description, product.price, product.coverUrl, product.type);
        });
        insertProduct.finalize(() => {
          console.log('Dados iniciais inseridos com sucesso!');
          resolve();
        });
      });
    } catch (error) {
      console.error('Erro ao popular banco de dados:', error);
      reject(error);
    }
  });
};

module.exports = seedDatabase;
