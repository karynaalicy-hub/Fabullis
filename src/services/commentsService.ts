import { supabase } from '../lib/supabase';

export const commentsService = {
  // Buscar comentários de um capítulo
  async getByChapter(chapterId: number) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          nome_usuario,
          avatar_url
        )
      `)
      .eq('chapter_id', chapterId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Criar novo comentário
  async create(chapterId: number, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        chapter_id: chapterId,
        user_id: user.id,
        content,
      })
      .select(`
        *,
        users (
          id,
          nome_usuario,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar comentário
  async delete(commentId: number) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { success: true };
  },

  // Reportar comentário
  async report(commentId: number) {
    const { data, error } = await supabase
      .from('comments')
      .update({ is_reported: true })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar comentários reportados (apenas admin)
  async getReported() {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          nome_usuario,
          avatar_url
        ),
        chapters (
          id,
          titulo_capitulo,
          historia_id,
          stories (
            id,
            titulo
          )
        )
      `)
      .eq('is_reported', true)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Aprovar comentário (remover flag de reportado)
  async approve(commentId: number) {
    const { data, error } = await supabase
      .from('comments')
      .update({ is_reported: false })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
