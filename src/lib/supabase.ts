import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zuvrrsqhvfewnlafewqw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dnJyc3FodmZld25sYWZld3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzE3MjIsImV4cCI6MjA3Nzg0NzcyMn0.hAQcT3ytw4bW8KriPa9gJ9Tj4HAeH-vK0dPoCiy01rw';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nome_usuario: string;
          email: string;
          avatar_url: string | null;
          role: 'user' | 'author' | 'admin';
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome_usuario: string;
          email: string;
          avatar_url?: string | null;
          role?: 'user' | 'author' | 'admin';
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome_usuario?: string;
          email?: string;
          avatar_url?: string | null;
          role?: 'user' | 'author' | 'admin';
          bio?: string | null;
          created_at?: string;
        };
      };
      stories: {
        Row: {
          id: number;
          autor_id: string;
          titulo: string;
          sinopse: string | null;
          capa_url: string | null;
          idioma: 'pt' | 'en' | 'es';
          status: 'em_andamento' | 'concluida' | 'hiato';
          tipo: 'livro' | 'conto' | 'fanfic';
          is_premium: boolean;
          data_publicacao: string;
          data_atualizacao: string;
        };
        Insert: {
          id?: number;
          autor_id: string;
          titulo: string;
          sinopse?: string | null;
          capa_url?: string | null;
          idioma: 'pt' | 'en' | 'es';
          status: 'em_andamento' | 'concluida' | 'hiato';
          tipo: 'livro' | 'conto' | 'fanfic';
          is_premium?: boolean;
          data_publicacao?: string;
          data_atualizacao?: string;
        };
        Update: {
          id?: number;
          autor_id?: string;
          titulo?: string;
          sinopse?: string | null;
          capa_url?: string | null;
          idioma?: 'pt' | 'en' | 'es';
          status?: 'em_andamento' | 'concluida' | 'hiato';
          tipo?: 'livro' | 'conto' | 'fanfic';
          is_premium?: boolean;
          data_publicacao?: string;
          data_atualizacao?: string;
        };
      };
      chapters: {
        Row: {
          id: number;
          historia_id: number;
          numero_capitulo: number;
          titulo_capitulo: string;
          conteudo: string;
          is_premium: boolean;
          data_publicacao: string;
        };
        Insert: {
          id?: number;
          historia_id: number;
          numero_capitulo: number;
          titulo_capitulo: string;
          conteudo: string;
          is_premium?: boolean;
          data_publicacao?: string;
        };
        Update: {
          id?: number;
          historia_id?: number;
          numero_capitulo?: number;
          titulo_capitulo?: string;
          conteudo?: string;
          is_premium?: boolean;
          data_publicacao?: string;
        };
      };
      genres: {
        Row: {
          id: number;
          nome: string;
        };
        Insert: {
          id?: number;
          nome: string;
        };
        Update: {
          id?: number;
          nome?: string;
        };
      };
      comments: {
        Row: {
          id: number;
          chapter_id: number;
          user_id: string;
          content: string;
          is_reported: boolean;
          timestamp: string;
        };
        Insert: {
          id?: number;
          chapter_id: number;
          user_id: string;
          content: string;
          is_reported?: boolean;
          timestamp?: string;
        };
        Update: {
          id?: number;
          chapter_id?: number;
          user_id?: string;
          content?: string;
          is_reported?: boolean;
          timestamp?: string;
        };
      };
    };
  };
}
