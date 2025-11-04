import { supabase } from '../lib/supabase';

export const chaptersService = {
  // Buscar capítulos de uma história
  async getByStory(storyId: number) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('historia_id', storyId)
      .order('numero_capitulo', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Buscar capítulo por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        stories (
          id,
          titulo,
          autor_id,
          users (
            id,
            nome_usuario,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Criar novo capítulo
  async create(chapterData: {
    historia_id: number;
    titulo_capitulo: string;
    conteudo: string;
    is_premium?: boolean;
  }) {
    // Buscar o próximo número de capítulo
    const { data: lastChapter } = await supabase
      .from('chapters')
      .select('numero_capitulo')
      .eq('historia_id', chapterData.historia_id)
      .order('numero_capitulo', { ascending: false })
      .limit(1)
      .single();

    const numero_capitulo = lastChapter ? lastChapter.numero_capitulo + 1 : 1;

    const { data, error } = await supabase
      .from('chapters')
      .insert({
        ...chapterData,
        numero_capitulo,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar capítulo
  async update(id: number, chapterData: Partial<{
    titulo_capitulo: string;
    conteudo: string;
    is_premium: boolean;
  }>) {
    const { data, error } = await supabase
      .from('chapters')
      .update(chapterData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar capítulo
  async delete(id: number) {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  // Dar like em capítulo
  async toggleLike(chapterId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se já deu like
    const { data: existingLike } = await supabase
      .from('chapter_likes')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Remover like
      const { error } = await supabase
        .from('chapter_likes')
        .delete()
        .eq('chapter_id', chapterId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { liked: false };
    } else {
      // Adicionar like
      const { error } = await supabase
        .from('chapter_likes')
        .insert({
          chapter_id: chapterId,
          user_id: user.id,
        });

      if (error) throw error;
      return { liked: true };
    }
  },

  // Verificar se usuário deu like
  async checkLike(chapterId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('chapter_likes')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  },

  // Contar likes do capítulo
  async getLikesCount(chapterId: number) {
    const { count, error } = await supabase
      .from('chapter_likes')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', chapterId);

    if (error) throw error;
    return count || 0;
  },
};
