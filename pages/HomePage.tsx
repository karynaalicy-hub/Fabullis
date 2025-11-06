import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StoryCard from '../components/ui/StoryCard';
import { Chapter, Story } from '../types';
import { supabase } from '../src/lib/supabase';

interface ChapterWithStory extends Chapter {
  story: Story | undefined;
}

const HomePage: React.FC = () => {
  const [newStories, setNewStories] = useState<Story[]>([]);
  const [latestChapters, setLatestChapters] = useState<ChapterWithStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stories (sem JOIN - mais simples)
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select('*')
          .order('data_publicacao', { ascending: false })
          .limit(4);

        if (storiesError) {
          console.error('Error fetching stories:', storiesError);
          throw new Error('Erro ao carregar histórias');
        }

        // Fetch latest chapters (sem JOIN - mais simples)
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .order('data_publicacao', { ascending: false })
          .limit(3);

        if (chaptersError) {
          console.error('Error fetching chapters:', chaptersError);
          throw new Error('Erro ao carregar capítulos');
        }

        // Transform data
        const stories = storiesData || [];
        
        // Para chapters, precisamos buscar as stories relacionadas
        const chapters = await Promise.all(
          (chaptersData || []).map(async (chapter) => {
            const { data: storyData } = await supabase
              .from('stories')
              .select('id, titulo, capa_url, autor_id')
              .eq('id', chapter.historia_id)
              .single();
            
            return {
              ...chapter,
              story: storyData
            };
          })
        );

        setNewStories(stories);
        setLatestChapters(chapters);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando histórias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao Carregar</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-hover transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-surface rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">
          Bem-vindo(a) à <span className="text-primary">Fabullis</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
          Sua biblioteca pessoal de ficção. Descubra, leia e mergulhe em novas aventuras.
        </p>
        <Link 
          to="/historias" 
          className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105"
        >
          Explorar Histórias
        </Link>
      </div>

      {/* Novas Histórias Adicionadas */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">
          Novas Histórias Adicionadas
        </h2>
        {newStories.length === 0 ? (
          <p className="text-text-secondary text-center py-8">Nenhuma história encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                chapterCount={0} // TODO: Get from database
                authorName={'Autor'} // TODO: Buscar do banco
                authorId={story.autor_id}
                likeCount={0} // TODO: Get from database
                commentCount={0} // TODO: Get from database
              />
            ))}
          </div>
        )}
      </section>

      {/* Últimos Capítulos Lançados */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">
          Últimos Capítulos Lançados
        </h2>
        {latestChapters.length === 0 ? (
          <p className="text-text-secondary text-center py-8">Nenhum capítulo encontrado.</p>
        ) : (
          <div className="space-y-4">
            {latestChapters.map(chapter => chapter.story && (
              <Link 
                key={chapter.id} 
                to={`/historias/${chapter.story.id}/${chapter.numero_capitulo}`} 
                className="block bg-surface p-4 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={chapter.story.capa_url} 
                    alt={chapter.story.titulo} 
                    className="w-16 h-24 object-cover rounded-md" 
                    loading="lazy" 
                  />
                  <div>
                    <p className="text-lg font-bold text-accent">{chapter.story.titulo}</p>
                    <p className="text-md text-text-primary">
                      {`Capítulo ${chapter.numero_capitulo}: ${chapter.titulo_capitulo}`}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {new Date(chapter.data_publicacao).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
