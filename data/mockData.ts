import { User, Genre, Story, Chapter, StoryStatus, StoryType, Language, Subscription, Notification, Comment, SubscriptionPlan, UserSubscription, Product, StoryLike, ChapterLike, Sale, SaleItem, CartItem } from '../types';

export let users: User[] = [
  { id: 1, nome_usuario: 'Aline Reis', email: 'aline@example.com', avatar_url: 'https://picsum.photos/seed/user1/100/100', password: 'senha123', role: 'admin' },
  { id: 2, nome_usuario: 'Bruno Costa', email: 'bruno@example.com', avatar_url: 'https://picsum.photos/seed/user2/100/100', password: 'senha123', role: 'author' },
  { id: 3, nome_usuario: 'Carlos Silva', email: 'carlos@example.com', password: 'senha123', role: 'author' },
];

export let genres: Genre[] = [
  { id: 1, nome: 'Fantasia' },
  { id: 2, nome: 'Aventura' },
  { id: 3, nome: 'Romance' },
  { id: 4, nome: 'Ficção Científica' },
  { id: 5, nome: 'Mistério' },
  { id: 6, nome: 'Terror' },
];

export let stories: Story[] = [
  {
    id: 1,
    autor_id: 1,
    titulo: 'As Crônicas de Eldoria',
    sinopse: 'Em um mundo onde a magia está morrendo, uma jovem elfa embarca em uma jornada perigosa para restaurar o equilíbrio e salvar seu povo da escuridão iminente. Uma aventura épica cheia de perigos e maravilhas.',
    capa_url: 'https://picsum.photos/seed/story1/400/600',
    idioma: Language.Portuguese,
    status: StoryStatus.EmAndamento,
    tipo: StoryType.Livro,
    data_publicacao: '2023-01-15T10:00:00Z',
    data_atualizacao: '2023-10-05T14:30:00Z',
    generos: [1, 2],
    isPremium: true,
  },
  {
    id: 2,
    autor_id: 2,
    titulo: 'Echoes of the Void',
    sinopse: 'The last human scavenger ship discovers a derelict alien vessel broadcasting a distress signal. What they find inside could either be humanity\'s salvation or its final doom.',
    capa_url: 'https://picsum.photos/seed/story2/400/600',
    idioma: Language.English,
    status: StoryStatus.Concluida,
    tipo: StoryType.Livro,
    data_publicacao: '2022-11-20T18:00:00Z',
    data_atualizacao: '2023-05-10T11:00:00Z',
    generos: [4, 6],
  },
  {
    id: 3,
    autor_id: 1,
    titulo: 'O Segredo do Farol',
    sinopse: 'Um conto sobre um velho faroleiro que guarda um segredo antigo, e a jornalista curiosa que está determinada a descobri-lo, não importa o custo. Um mistério que se aprofunda com a maré.',
    capa_url: 'https://picsum.photos/seed/story3/400/600',
    idioma: Language.Portuguese,
    status: StoryStatus.Concluida,
    tipo: StoryType.Conto,
    data_publicacao: '2023-03-10T09:00:00Z',
    data_atualizacao: '2023-03-10T09:00:00Z',
    generos: [5],
  },
  {
    id: 4,
    autor_id: 3,
    titulo: 'La Sombra del Pasado',
    sinopse: 'Un detective privado en Madrid es contratado para encontrar a una mujer desaparecida, solo para descubrir que el caso está conectado con su propio pasado trágico. Una historia de amor y pérdida.',
    capa_url: 'https://picsum.photos/seed/story4/400/600',
    idioma: Language.Spanish,
    status: StoryStatus.Hiato,
    tipo: StoryType.Livro,
    data_publicacao: '2023-06-01T12:00:00Z',
    data_atualizacao: '2023-08-15T16:45:00Z',
    generos: [5, 3],
  },
  {
    id: 5,
    autor_id: 2,
    titulo: 'Heart of the Nebula',
    sinopse: 'A forbidden romance between a starship captain and an android diplomat could spark an interstellar war. They must navigate politics, prejudice, and their own feelings to find a path to peace.',
    capa_url: 'https://picsum.photos/seed/story5/400/600',
    idioma: Language.English,
    status: StoryStatus.EmAndamento,
    tipo: StoryType.Fanfic,
    data_publicacao: '2023-09-01T20:00:00Z',
    data_atualizacao: '2023-11-12T19:00:00Z',
    generos: [4, 3],
    isPremium: true,
  }
];

export let chapters: Chapter[] = [
  // Chapters for Story 1
  { id: 1, historia_id: 1, numero_capitulo: 1, titulo_capitulo: 'O Chamado da Floresta', data_publicacao: '2023-01-15T10:00:00Z', conteudo: 'O vento sussurrava segredos antigos entre as árvores da Floresta das Sombras. Lyra, com seus ouvidos élficos atentos, sentiu uma perturbação na magia que fluía pela terra. Era um chamado, fraco mas insistente, que a puxava para o coração da floresta, onde nenhum elfo se aventurava há séculos. A aventura estava prestes a começar...', isPremium: false },
  { id: 2, historia_id: 1, numero_capitulo: 2, titulo_capitulo: 'A Cidade Perdida', data_publicacao: '2023-01-22T10:00:00Z', conteudo: 'Guiada por pistas enigmáticas, Lyra descobriu as ruínas de Aethelgard, uma cidade que se pensava ser apenas uma lenda. Lá, entre pedras cobertas de musgo, ela encontrou o primeiro artefato necessário para sua missão. No entanto, ela não estava sozinha; olhos sombrios a observavam das ruínas.', isPremium: true },
  { id: 3, historia_id: 1, numero_capitulo: 3, titulo_capitulo: 'O Guardião de Pedra', data_publicacao: '2023-01-29T10:00:00Z', conteudo: 'O artefato era protegido por um golem antigo. A batalha foi feroz, testando não apenas a habilidade de Lyra com o arco, mas também sua inteligência para resolver o enigma que o mantinha ativo. Com o guardião derrotado, o caminho para o sul se abriu.', isPremium: true },

  // Chapters for Story 2
  { id: 4, historia_id: 2, numero_capitulo: 1, titulo_capitulo: 'The Signal', data_publicacao: '2022-11-20T18:00:00Z', conteudo: 'Captain Eva Rostova watched the spectral analysis flicker on her screen. "It\'s old," she murmured, her voice barely a whisper in the quiet bridge of the \'Stardust Drifter\'. The signal was weak, repeating a pattern that was unmistakably a distress call. A Xylan distress call. But the Xylans had vanished a millennium ago.' },
  { id: 5, historia_id: 2, numero_capitulo: 2, titulo_capitulo: 'Ghost Ship', data_publicacao: '2022-11-27T18:00:00Z', conteudo: 'Docking with the alien vessel was an eerie experience. No lights, no movement, just the cold silence of space. The boarding party moved through corridors designed for beings much larger than humans, their flashlights cutting through the oppressive darkness. The air was stale, filled with an unidentifiable, metallic scent.' },
  
  // Chapters for Story 4
  { id: 6, historia_id: 4, numero_capitulo: 1, titulo_capitulo: 'La Llamada', data_publicacao: '2023-06-01T12:00:00Z', conteudo: 'El teléfono sonó en la quietud de la noche, despertando a Javier de un sueño inquieto. Era una voz que no esperaba volver a oír, la de un viejo amigo que le pedía un favor. Una mujer, Elena, había desaparecido. Y así, Javier fue arrastrado de vuelta al mundo que había intentado dejar atrás.' }
];

// For following stories
export let subscriptions: Subscription[] = [
  { userId: 1, storyId: 1 },
  { userId: 1, storyId: 5 },
  { userId: 2, storyId: 2 },
];

export let notifications: Notification[] = [
  // Notification for the newest chapter of Story 1 for User 1
  { id: 1, userId: 1, chapterId: 3, isRead: false, timestamp: '2023-10-05T15:00:00Z' },
  // A read notification for the same user
  { id: 2, userId: 1, chapterId: 2, isRead: true, timestamp: '2023-01-22T11:00:00Z' },
];

export let comments: Comment[] = [
    { id: 1, chapterId: 1, userId: 2, content: "Que começo empolgante! Mal posso esperar para ver o que acontece com a Lyra.", timestamp: "2023-01-16T11:00:00Z"},
    { id: 2, chapterId: 1, userId: 3, content: "A descrição da Floresta das Sombras é incrível. Me senti lá!", timestamp: "2023-01-17T14:20:00Z"},
    { id: 3, chapterId: 2, userId: 1, content: "Uma cidade perdida! Adoro esses mistérios.", timestamp: "2023-01-23T09:00:00Z", isReported: true},
];

export let storyLikes: StoryLike[] = [
    { storyId: 1, userId: 1 },
    { storyId: 1, userId: 2 },
    { storyId: 2, userId: 1 },
    { storyId: 3, userId: 3 },
    { storyId: 5, userId: 2 },
];

export let chapterLikes: ChapterLike[] = [
    { chapterId: 1, userId: 1 },
    { chapterId: 1, userId: 3 },
    { chapterId: 2, userId: 2 },
    { chapterId: 4, userId: 1 },
    { chapterId: 4, userId: 2 },
    { chapterId: 4, userId: 3 },
];


export let subscriptionPlans: SubscriptionPlan[] = [
    { id: 1, name: "Leitor Mensal", price: 14.90, description: "Acesso a todo o conteúdo premium por um mês.", durationDays: 30 },
    { id: 2, name: "Leitor Anual", price: 149.90, description: "Um ano de acesso com desconto exclusivo.", durationDays: 365 },
];

export let userSubscriptions: UserSubscription[] = [
    // User 2 has an active subscription
    { id: 1, userId: 2, planId: 1, startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
];

export let products: Product[] = [
    {
        id: 1,
        name: "As Crônicas de Eldoria - Edição de Colecionador",
        description: "Uma edição de luxo em capa dura da saga épica de Lyra.",
        price: 89.90,
        coverUrl: 'https://picsum.photos/seed/product1/400/600',
        type: 'book',
    },
    {
        id: 2,
        name: "Echoes of the Void - E-book",
        description: "Leve a aventura de Eva Rostova para qualquer lugar com a versão digital.",
        price: 29.90,
        coverUrl: 'https://picsum.photos/seed/product2/400/600',
        type: 'ebook',
    },
    {
        id: 3,
        name: "O Segredo do Farol - Livro Físico",
        description: "A edição impressa do conto de mistério que cativou leitores.",
        price: 45.50,
        coverUrl: 'https://picsum.photos/seed/product3/400/600',
        type: 'book',
    },
     {
        id: 4,
        name: "Fabullis Artbook Vol. 1",
        description: "Uma coleção de artes conceituais das suas histórias favoritas.",
        price: 120.00,
        coverUrl: 'https://picsum.photos/seed/product4/400/600',
        type: 'book',
    },
];

export let sales: Sale[] = [
    {
        id: 1,
        userId: 2,
        items: [{ productId: 1, quantity: 1, price: 89.90 }, { productId: 2, quantity: 1, price: 29.90 }],
        total: 119.80,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
     {
        id: 2,
        userId: 3,
        items: [{ productId: 4, quantity: 1, price: 120.00 }],
        total: 120.00,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

// Helper functions to simulate database queries
export const getStoryById = (id: number) => stories.find(s => s.id === id);
export const getChapterById = (id: number) => chapters.find(c => c.id === id);
export const getChaptersByStoryId = (storyId: number) => chapters.filter(c => c.historia_id === storyId).sort((a, b) => a.numero_capitulo - b.numero_capitulo);
export const getAuthorByStory = (story: Story) => users.find(u => u.id === story.autor_id);
export const getGenresByStory = (story: Story) => genres.filter(g => story.generos.includes(g.id));
export const getGenreById = (id: number) => genres.find(g => g.id === id);
export const getUserByEmail = (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase());
export const getUserById = (id: number) => users.find(u => u.id === id);
export const getStoriesByAuthorId = (authorId: number) => stories.filter(s => s.autor_id === authorId);

// Functions for comments
export const getCommentsByChapterId = (chapterId: number) => {
    return comments
        .filter(c => c.chapterId === chapterId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const addComment = (commentData: Omit<Comment, 'id' | 'timestamp'>) => {
    const newId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
    const newComment: Comment = {
        ...commentData,
        id: newId,
        timestamp: new Date().toISOString(),
    };
    comments.push(newComment);
    return newComment;
};

// --- Comment Moderation ---
export const reportComment = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.isReported = true;
        return true;
    }
    return false;
};

export const getReportedComments = () => {
    return comments
        .filter(c => c.isReported)
        .map(comment => {
            const user = getUserById(comment.userId);
            const chapter = chapters.find(chap => chap.id === comment.chapterId);
            const story = chapter ? getStoryById(chapter.historia_id) : undefined;
            return { ...comment, user, chapter, story };
        })
        .filter(c => c.user && c.chapter && c.story); // Ensure all data is found
};

export const approveComment = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.isReported = false;
        return true;
    }
    return false;
};

export const deleteComment = (commentId: number) => {
    const initialLength = comments.length;
    comments = comments.filter(c => c.id !== commentId);
    return comments.length < initialLength;
};


// --- Engagement Metrics ---
export const getCommentCountForStory = (storyId: number): number => {
    const storyChapters = getChaptersByStoryId(storyId);
    const chapterIds = storyChapters.map(c => c.id);
    return comments.filter(c => chapterIds.includes(c.chapterId)).length;
};

export const getTotalLikeCountForStory = (storyId: number): number => {
    const storyLikeCount = storyLikes.filter(l => l.storyId === storyId).length;
    const storyChapters = getChaptersByStoryId(storyId);
    const chapterIds = storyChapters.map(c => c.id);
    const chapterLikeCount = chapterLikes.filter(l => chapterIds.includes(l.chapterId)).length;
    return storyLikeCount + chapterLikeCount;
};

// --- Like Management ---
export const isStoryLikedByUser = (storyId: number, userId: number): boolean => {
    return storyLikes.some(l => l.storyId === storyId && l.userId === userId);
};
export const isChapterLikedByUser = (chapterId: number, userId: number): boolean => {
    return chapterLikes.some(l => l.chapterId === chapterId && l.userId === userId);
};

export const toggleStoryLike = (storyId: number, userId: number): boolean => {
    const likeIndex = storyLikes.findIndex(l => l.storyId === storyId && l.userId === userId);
    if (likeIndex > -1) {
        storyLikes.splice(likeIndex, 1);
        return false; // unliked
    } else {
        storyLikes.push({ storyId, userId });
        return true; // liked
    }
};
export const toggleChapterLike = (chapterId: number, userId: number): boolean => {
    const likeIndex = chapterLikes.findIndex(l => l.chapterId === chapterId && l.userId === userId);
    if (likeIndex > -1) {
        chapterLikes.splice(likeIndex, 1);
        return false; // unliked
    } else {
        chapterLikes.push({ chapterId, userId });
        return true; // liked
    }
};


// Functions to add/modify user data
export const addUser = (userData: Omit<User, 'id'>) => {
    if (getUserByEmail(userData.email)) {
        throw new Error("Usuário com este email já existe.");
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        ...userData,
        id: newId,
        role: userData.role || 'author', // Default role to author
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = (userId: number, updatedData: Partial<Omit<User, 'id'>>) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("Usuário não encontrado.");
    }
    // Prevent email collision on update
    if (updatedData.email && users.some(u => u.email.toLowerCase() === updatedData.email!.toLowerCase() && u.id !== userId)) {
        throw new Error("Email já está em uso por outro usuário.");
    }
    
    const updatedUser = { ...users[userIndex], ...updatedData };
    // If password is an empty string, don't update it
    if (updatedData.password === '') {
        delete updatedUser.password;
    }

    users[userIndex] = updatedUser;
    return users[userIndex];
};

export const deleteUser = (userId: number) => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);
    if (users.length === initialLength) {
        throw new Error("Usuário não encontrado para exclusão.");
    }
    // In a real app, you'd handle what happens to the user's stories.
    return true;
};

// Functions to add/modify genre data
export const addGenre = (genreData: Omit<Genre, 'id'>) => {
    if (genres.some(g => g.nome.toLowerCase() === genreData.nome.toLowerCase())) {
        throw new Error("Este gênero já existe.");
    }
    const newId = genres.length > 0 ? Math.max(...genres.map(g => g.id)) + 1 : 1;
    const newGenre: Genre = { ...genreData, id: newId };
    genres.push(newGenre);
    return newGenre;
};

export const updateGenre = (genreId: number, updatedData: Partial<Omit<Genre, 'id'>>) => {
    const genreIndex = genres.findIndex(g => g.id === genreId);
    if (genreIndex === -1) {
        throw new Error("Gênero não encontrado.");
    }
    if (updatedData.nome && genres.some(g => g.nome.toLowerCase() === updatedData.nome!.toLowerCase() && g.id !== genreId)) {
        throw new Error("Nome de gênero já está em uso.");
    }
    genres[genreIndex] = { ...genres[genreIndex], ...updatedData };
    return genres[genreIndex];
};

export const deleteGenre = (genreId: number) => {
    const initialLength = genres.length;
    genres = genres.filter(g => g.id !== genreId);
    if (genres.length === initialLength) {
        throw new Error("Gênero não encontrado para exclusão.");
    }
    // Remove the deleted genre from all stories
    stories.forEach(story => {
        story.generos = story.generos.filter(gId => gId !== genreId);
    });
    return true;
};


export const addStory = (storyData: Omit<Story, 'id' | 'data_publicacao' | 'data_atualizacao' | 'autor_id'>, autor_id: number) => {
  const newId = stories.length > 0 ? Math.max(...stories.map(s => s.id)) + 1 : 1;
  const newStory: Story = {
    ...storyData,
    id: newId,
    autor_id: autor_id,
    data_publicacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
  };
  stories.push(newStory);
  return newStory;
};

export const updateStory = (storyId: number, storyData: Omit<Story, 'id' | 'data_publicacao' | 'data_atualizacao' | 'autor_id'>) => {
  const storyIndex = stories.findIndex(s => s.id === storyId);
  if (storyIndex === -1) return null;
  
  const updatedStory: Story = {
    ...stories[storyIndex],
    ...storyData,
    data_atualizacao: new Date().toISOString(),
  };
  stories[storyIndex] = updatedStory;
  return updatedStory;
};

export const addChapter = (chapterData: Omit<Chapter, 'id' | 'data_publicacao' | 'numero_capitulo'>) => {
  const newId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
  const storyChapters = getChaptersByStoryId(chapterData.historia_id);
  const newChapterNumber = storyChapters.length > 0 ? Math.max(...storyChapters.map(c => c.numero_capitulo)) + 1 : 1;
  const now = new Date().toISOString();

  const newChapter: Chapter = {
    ...chapterData,
    id: newId,
    numero_capitulo: newChapterNumber,
    data_publicacao: now,
  };
  chapters.push(newChapter);

  // Update story's last updated date
  const storyIndex = stories.findIndex(s => s.id === chapterData.historia_id);
  if (storyIndex !== -1) {
      stories[storyIndex].data_atualizacao = now;
  }

  // --- Notification Logic ---
  // Find users subscribed to this story
  const subscribers = subscriptions.filter(sub => sub.storyId === chapterData.historia_id);
  subscribers.forEach(sub => {
    const newNotificationId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
    notifications.push({
      id: newNotificationId,
      userId: sub.userId,
      chapterId: newChapter.id,
      isRead: false,
      timestamp: newChapter.data_publicacao,
    });
  });
  // --- End Notification Logic ---

  return newChapter;
};

// New helper for notifications
export const getNotificationsByUser = (userId: number) => {
    const userNotifications = notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return userNotifications.map(notification => {
        const chapter = chapters.find(c => c.id === notification.chapterId);
        if (!chapter) return null;
        const story = stories.find(s => s.id === chapter.historia_id);
        if (!story) return null;

        return {
            notification,
            chapter,
            story
        };
    }).filter(Boolean); // Remove nulls if chapter/story not found
};

export const markNotificationAsRead = (notificationId: number) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
    }
};

// --- Subscription Helpers ---
export const getSubscriptionPlans = () => [...subscriptionPlans];
export const getPlanById = (planId: number) => subscriptionPlans.find(p => p.id === planId);

export const getUserSubscription = (userId: number) => {
    const sub = userSubscriptions.find(s => s.userId === userId && new Date(s.endDate) > new Date());
    return sub || null;
};

export const getAllUserSubscriptions = () => {
    return userSubscriptions.map(sub => {
        const user = getUserById(sub.userId);
        const plan = getPlanById(sub.planId);
        return {
            ...sub,
            user,
            plan,
        };
    }).filter(sub => sub.user && sub.plan);
};

export const createSubscription = (userId: number, planId: number) => {
    const plan = getPlanById(planId);
    if (!plan) throw new Error("Plano não encontrado.");

    const newId = userSubscriptions.length > 0 ? Math.max(...userSubscriptions.map(s => s.id)) + 1 : 1;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const newSubscription: UserSubscription = {
        id: newId,
        userId,
        planId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    };

    const existingSubIndex = userSubscriptions.findIndex(s => s.userId === userId);
    if (existingSubIndex > -1) {
        userSubscriptions.splice(existingSubIndex, 1);
    }

    userSubscriptions.push(newSubscription);
    return newSubscription;
};

// --- Product & Sales Helpers ---
export const getProducts = () => [...products];
export const getProductById = (id: number) => products.find(p => p.id === id);

export const createSale = (userId: number, items: CartItem[]) => {
    const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newSale: Sale = {
        id: newId,
        userId,
        items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        total,
        date: new Date().toISOString(),
    };
    sales.push(newSale);
    return newSale;
};

// --- Financial Dashboard Helpers ---
export const getFinancialSummary = () => {
    const productRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Sum of subscription prices based on userSubscriptions
    const subscriptionRevenue = userSubscriptions.reduce((sum, sub) => {
        const plan = getPlanById(sub.planId);
        return sum + (plan ? plan.price : 0);
    }, 0);

    const totalRevenue = productRevenue + subscriptionRevenue;
    const activeSubscribers = userSubscriptions.filter(s => new Date(s.endDate) > new Date()).length;

    return {
        totalRevenue,
        productRevenue,
        subscriptionRevenue,
        activeSubscribers,
    };
};

export const getRecentTransactions = () => {
    const productSales = sales.map(sale => ({
        type: 'Produto' as 'Produto' | 'Assinatura',
        id: `sale-${sale.id}`,
        user: getUserById(sale.userId),
        description: `${sale.items.length} ${sale.items.length > 1 ? 'itens' : 'item'}`,
        amount: sale.total,
        date: sale.date,
    }));

    const subscriptionSales = userSubscriptions.map(sub => {
        const plan = getPlanById(sub.planId);
        return {
            type: 'Assinatura' as 'Produto' | 'Assinatura',
            id: `sub-${sub.id}`,
            user: getUserById(sub.userId),
            description: plan?.name || 'Plano desconhecido',
            amount: plan?.price || 0,
            date: sub.startDate,
        };
    });
    
    return [...productSales, ...subscriptionSales]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Return latest 10 transactions
};