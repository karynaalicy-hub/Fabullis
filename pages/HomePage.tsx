import React from 'react';
import { Link } from 'react-router-dom';
import { stories, chapters, getStoryById, getChaptersByStoryId, getAuthorByStory, getTotalLikeCountForStory, getCommentCountForStory } from '../data/mockData';
import StoryCard from '../components/ui/StoryCard';
import { Chapter, Story } from '../types';

interface ChapterWithStory extends Chapter {
  story: Story | undefined;
}

const HomePage: React.FC = () => {
  const newStories = [...stories].sort((a, b) => new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime()).slice(0, 4);
  const latestChapters: ChapterWithStory[] = [...chapters]
    .sort((a, b) => new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime())
    .slice(0, 3)
    .map(chapter => ({
      ...chapter,
      story: getStoryById(chapter.historia_id)
    }));

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newStories.map(story => {
            const author = getAuthorByStory(story);
            return (
              <StoryCard 
                key={story.id} 
                story={story} 
                chapterCount={getChaptersByStoryId(story.id).length}
                authorName={author?.nome_usuario || 'Desconhecido'}
                authorId={story.autor_id}
                likeCount={getTotalLikeCountForStory(story.id)}
                commentCount={getCommentCountForStory(story.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Últimos Capítulos Lançados */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">Últimos Capítulos Lançados</h2>
        <div className="space-y-4">
          {latestChapters.map(chapter => chapter.story && (
            <Link key={chapter.id} to={`/historias/${chapter.story.id}/${chapter.numero_capitulo}`} className="block bg-surface p-4 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <img src={chapter.story.capa_url} alt={chapter.story.titulo} className="w-16 h-24 object-cover rounded-md" loading="lazy" />
                <div>
                  <p className="text-lg font-bold text-accent">{chapter.story.titulo}</p>
                  <p className="text-md text-text-primary">{`Capítulo ${chapter.numero_capitulo}: ${chapter.titulo_capitulo}`}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    {new Date(chapter.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
