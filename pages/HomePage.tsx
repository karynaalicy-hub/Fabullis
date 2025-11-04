import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storiesService } from '../src/services/storiesService';
import { chaptersService } from '../src/services/chaptersService';
import StoryCard from '../components/ui/StoryCard';
import { Chapter, Story } from '../types';

interface ChapterWithStory extends Chapter {
  story: Story | undefined;
}

interface StoryWithStats extends Story {
  chapterCount: number;
  likeCount: number;
  commentCount: number;
  authorName: string;
}

const HomePage: React.FC = () => {
  const [newStories, setNewStories] = useState<StoryWithStats[]>([]);
  const [latestChapters, setLatestChapters] = useState<ChapterWithStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Buscar histórias recentes
        const storiesData: any = await storiesService.getAll();
        
        // Buscar estatísticas para cada história
        const storiesWithStats = await Promise.all(
          storiesData.slice(0, 4).map(async (story: any) => {
            const stats = await storiesService.getStats(story.id);
            return {
              ...story,
              autor_id: story.autor_id,
              chapterCount: stats.total_chapters,
              likeCount: stats.total_likes,
              commentCount: stats.total_comments,
              authorName: story.users?.nome_usuario || 'Desconhecido',
              generos: story.story_genres?.map((sg: any) => sg.genres?.id).filter(Boolean) || [],
            };
          })
        );

        setNewStories(storiesWithStats);

        // Buscar capítulos recentes de todas as histórias
        const allChapters: any[] = [];
        for (const story of storiesData) {
          const chapters = await chaptersService.getByStory(story.id);
          chapters.forEach((chapter: any) => {
            allChapters.push({
              ...chapter,
              story: story,
            });
          });
        }

        // Ordenar por data e pegar os 3 mais recentes
        const sortedChapters = allChapters
          .sort((a, b) => new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime())
          .slice(0, 3);

        setLatestChapters(sortedChapters);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-2xl text-text-secondary">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-surface rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Bem-vindo(a) à <span className="text-primary">Fabullis</span></h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">Sua biblioteca pessoal de ficção. Descubra, leia e mergulhe em novas aventuras.</p>
        <Link to="/historias" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105">
          Explorar Histórias
        </Link>
      </div>

      {/* Novas Histórias Adicionadas */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">Novas Histórias Adicionadas</h2>
        {newStories.length === 0 ? (
          <p className="text-text-secondary text-center py-8">Nenhuma história disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                chapterCount={story.chapterCount}
                authorName={story.authorName}
                authorId={story.autor_id}
                likeCount={story.likeCount}
                commentCount={story.commentCount}
              />
            ))}
          </div>
        )}
      </section>

      {/* Últimos Capítulos Lançados */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">Últimos Capítulos Lançados</h2>
        {latestChapters.length === 0 ? (
          <p className="text-text-secondary text-center py-8">Nenhum capítulo disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestChapters.map(chapter => {
              if (!chapter.story) return null;
              const story = chapter.story as any;
              return (
                <Link 
                  key={chapter.id} 
                  to={`/historias/${chapter.historia_id}/${chapter.id}`}
                  className="bg-surface rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img 
                    src={story.capa_url || 'https://via.placeholder.com/400x600'} 
                    alt={`Capa de ${story.titulo}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-text-primary mb-1">{story.titulo}</h3>
                    <p className="text-sm text-text-secondary mb-2">
                      Capítulo {chapter.numero_capitulo}: {chapter.titulo_capitulo}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(chapter.data_publicacao).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
