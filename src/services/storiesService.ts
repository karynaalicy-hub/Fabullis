import { supabase } from '../lib/supabase';
import { Story } from '../types';

export const storiesService = {
  // Buscar todas as histórias
  async getAll() {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        users (
          id,
          nome_usuario,
          avatar_url
        ),
        story_genres (
          genres (
            id,
            nome
          )
        )
      `)
      .order('data_publicacao', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar história por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        users (
          id,
          nome_usuario,
          avatar_url,
          bio
        ),
        story_genres (
          genres (
            id,
            nome
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar histórias por autor
  async getByAuthor(autorId: string) {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_genres (
          genres (
            id,
            nome
          )
        )
      `)
      .eq('autor_id', autorId)
      .order('data_publicacao', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar histórias por gênero
  async getByGenre(genreId: number) {
    const { data, error } = await supabase
      .from('story_genres')
      .select(`
        stories (
          *,
          users (
            id,
            nome_usuario,
            avatar_url
          ),
          story_genres (
            genres (
              id,
              nome
            )
          )
        )
      `)
      .eq('genre_id', genreId);

    if (error) throw error;
    return data.map(item => item.stories).filter(Boolean);
  },

  // Criar nova história
  async create(storyData: {
    titulo: string;
    sinopse?: string;
    capa_url?: string;
    idioma: 'pt' | 'en' | 'es';
    status: 'em_andamento' | 'concluida' | 'hiato';
    tipo: 'livro' | 'conto' | 'fanfic';
    is_premium?: boolean;
    generos: number[];
  }) {
    // Buscar usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { generos, ...storyFields } = storyData;

    // Criar história
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        ...storyFields,
        autor_id: user.id,
      })
      .select()
      .single();

    if (storyError) throw storyError;

    // Adicionar gêneros
    if (generos && generos.length > 0) {
      const storyGenres = generos.map(genreId => ({
        story_id: story.id,
        genre_id: genreId,
      }));

      const { error: genresError } = await supabase
        .from('story_genres')
        .insert(storyGenres);

      if (genresError) throw genresError;
    }

    return story;
  },

  // Atualizar história
  async update(id: number, storyData: Partial<{
    titulo: string;
    sinopse: string;
    capa_url: string;
    idioma: 'pt' | 'en' | 'es';
    status: 'em_andamento' | 'concluida' | 'hiato';
    tipo: 'livro' | 'conto' | 'fanfic';
    is_premium: boolean;
    generos: number[];
  }>) {
    const { generos, ...storyFields } = storyData;

    // Atualizar história
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .update(storyFields)
      .eq('id', id)
      .select()
      .single();

    if (storyError) throw storyError;

    // Atualizar gêneros se fornecidos
    if (generos) {
      // Remover gêneros antigos
      await supabase
        .from('story_genres')
        .delete()
        .eq('story_id', id);

      // Adicionar novos gêneros
      if (generos.length > 0) {
        const storyGenres = generos.map(genreId => ({
          story_id: id,
          genre_id: genreId,
        }));

        const { error: genresError } = await supabase
          .from('story_genres')
          .insert(storyGenres);

        if (genresError) throw genresError;
      }
    }

    return story;
  },

  // Deletar história
  async delete(id: number) {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  // Buscar estatísticas da história
  async getStats(id: number) {
    // Contar capítulos
    const { count: chaptersCount } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('historia_id', id);

    // Contar likes
    const { count: likesCount } = await supabase
      .from('story_likes')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', id);

    // Contar seguidores
    const { count: followersCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', id);

    // Contar comentários
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('historia_id', id);

    let commentsCount = 0;
    if (chapters && chapters.length > 0) {
      const chapterIds = chapters.map(c => c.id);
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .in('chapter_id', chapterIds);
      commentsCount = count || 0;
    }

    return {
      total_chapters: chaptersCount || 0,
      total_likes: likesCount || 0,
      total_followers: followersCount || 0,
      total_comments: commentsCount,
    };
  },

  // Dar like em história
  async toggleLike(storyId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se já deu like
    const { data: existingLike } = await supabase
      .from('story_likes')
      .select('*')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Remover like
      const { error } = await supabase
        .from('story_likes')
        .delete()
        .eq('story_id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { liked: false };
    } else {
      // Adicionar like
      const { error } = await supabase
        .from('story_likes')
        .insert({
          story_id: storyId,
          user_id: user.id,
        });

      if (error) throw error;
      return { liked: true };
    }
  },

  // Verificar se usuário deu like
  async checkLike(storyId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('story_likes')
      .select('*')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  },

  // Seguir/deixar de seguir história
  async toggleFollow(storyId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se já segue
    const { data: existingFollow } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single();

    if (existingFollow) {
      // Deixar de seguir
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('story_id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { following: false };
    } else {
      // Seguir
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          story_id: storyId,
          user_id: user.id,
        });

      if (error) throw error;
      return { following: true };
    }
  },

  // Verificar se usuário segue a história
  async checkFollow(storyId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  },
};
