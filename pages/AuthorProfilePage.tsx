import React from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, getStoriesByAuthorId, getChaptersByStoryId, getTotalLikeCountForStory, getCommentCountForStory } from '../data/mockData';
import StoryCard from '../components/ui/StoryCard';
import NotFoundPage from './NotFoundPage';

const AuthorProfilePage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();

  if (!authorId) {
    return <NotFoundPage />;
  }

  const author = getUserById(Number(authorId));
  const authorStories = getStoriesByAuthorId(Number(authorId));

  if (!author) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <img 
          src={author.avatar_url || `https://i.pravatar.cc/150?u=${author.id}`} 
          alt={`Avatar de ${author.nome_usuario}`}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary shadow-lg"
        />
        <h1 className="text-4xl font-bold font-serif text-text-primary">{author.nome_usuario}</h1>
        <p className="text-lg text-text-secondary mt-2 capitalize">{author.role}</p>
      </header>

      <main>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">
          Histórias Publicadas
        </h2>
        {authorStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {authorStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                chapterCount={getChaptersByStoryId(story.id).length} 
                authorName={author.nome_usuario}
                authorId={story.autor_id}
                likeCount={getTotalLikeCountForStory(story.id)}
                commentCount={getCommentCountForStory(story.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg p-8 text-center">
            <p className="text-text-secondary">Este autor ainda não publicou nenhuma história.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorProfilePage;
