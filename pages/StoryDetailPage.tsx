import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    getStoryById, getAuthorByStory, getGenresByStory, getChaptersByStoryId, stories as allStories,
    getTotalLikeCountForStory, getCommentCountForStory, isStoryLikedByUser, toggleStoryLike
} from '../data/mockData';
import NotFoundPage from './NotFoundPage';
import Tag from '../components/ui/Tag';
import { Language, ReadingProgress } from '../types';
import StoryCard from '../components/ui/StoryCard';
import { useAuth } from '../contexts/AuthContext';

// SVG Icon Components
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-text-secondary">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const BookmarkIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

const HeartIcon: React.FC<{ className?: string; isLiked: boolean }> = ({ className = '', isLiked }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24" 
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`${className} ${isLiked ? 'text-red-500' : ''}`}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const MessageCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);


const LockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [canShare, setCanShare] = useState(false);

  // States for dynamic data
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // Initial data loading
  useEffect(() => {
    if (storyId) {
        setLikeCount(getTotalLikeCountForStory(Number(storyId)));
        setCommentCount(getCommentCountForStory(Number(storyId)));
        if(currentUser) {
            setIsLiked(isStoryLikedByUser(Number(storyId), currentUser.id));
        }
    }
  }, [storyId, currentUser]);


  useEffect(() => {
    // Check for Web Share API support
    if (navigator.share) {
        setCanShare(true);
    }

    if (storyId) {
        try {
            const allProgress = JSON.parse(localStorage.getItem('fabullis_progress') || '{}');
            if (allProgress[storyId]) {
                setReadingProgress(allProgress[storyId]);
            }
        } catch (e) {
            console.error("Failed to parse reading progress from localStorage.", e);
        }
    }
  }, [storyId]);
  
  if (!storyId) return <NotFoundPage />;

  const story = getStoryById(Number(storyId));
  if (!story) return <NotFoundPage />;

  const author = getAuthorByStory(story);
  const genres = getGenresByStory(story);
  const chapters = getChaptersByStoryId(story.id);

  const otherStoriesByAuthor = allStories
    .filter(s => s.autor_id === story.autor_id && s.id !== story.id)
    .slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: story.titulo,
                text: `Confira esta história: ${story.titulo} por ${author?.nome_usuario || 'Desconhecido'}.`,
                url: window.location.href,
            });
        } catch (error) {
            console.error('Error sharing', error);
        }
    }
  };
  
  const handleLikeClick = () => {
      if (!currentUser) {
          alert("Você precisa estar logado para curtir uma história.");
          return;
      }
      const newLikedState = toggleStoryLike(story.id, currentUser.id);
      setIsLiked(newLikedState);
      // Optimistically update count
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
  };


  const getLanguageName = (lang: Language) => {
    switch(lang) {
      case Language.Portuguese: return 'Português';
      case Language.English: return 'Inglês';
      case Language.Spanish: return 'Espanhol';
      default: return '';
    }
  };

  const getStatusName = (status: string) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const startChapter = readingProgress?.chapterNumber || (chapters.length > 0 ? chapters[0].numero_capitulo : null);
  const buttonText = readingProgress ? `Continuar Lendo (Cap. ${readingProgress.chapterNumber})` : 'Começar a Ler';
  const ctaLink = startChapter ? `/historias/${story.id}/${startChapter}` : '#';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Story Header */}
      <header className="flex flex-col md:flex-row gap-8 mb-8 bg-surface p-6 rounded-lg">
        <img src={story.capa_url} alt={`Capa de ${story.titulo}`} className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-lg" loading="lazy" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
            {story.titulo}
            {story.isPremium && <span title="Conteúdo Premium"><LockIcon className="w-6 h-6 text-yellow-400" /></span>}
          </h1>
          <p className="text-lg text-text-secondary mb-4">
            por{' '}
            {author ? (
              <Link to={`/autores/${author.id}`} className="font-semibold text-accent hover:underline">
                {author.nome_usuario}
              </Link>
            ) : (
              <span className="font-semibold text-accent">Desconhecido</span>
            )}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag>{getStatusName(story.status)}</Tag>
            <Tag>{getLanguageName(story.idioma)}</Tag>
            {genres.map(genre => <Tag key={genre.id}>{genre.nome}</Tag>)}
          </div>

          <div className="flex items-center space-x-6 my-4 text-text-secondary">
              <span className="flex items-center gap-2" title="Total de curtidas">
                  <HeartIcon className="w-5 h-5" isLiked={false} /> {likeCount}
              </span>
              <span className="flex items-center gap-2" title="Total de comentários">
                  <MessageCircleIcon className="w-5 h-5" /> {commentCount}
              </span>
          </div>
          
          <p className="text-text-secondary leading-relaxed">{story.sinopse}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
              {chapters.length > 0 ? (
                 <Link
                    to={ctaLink}
                    className="inline-flex items-center justify-center text-center bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105"
                >
                    {buttonText}
                </Link>
              ) : (
                 <button
                    disabled
                    className="inline-flex items-center justify-center bg-slate-500 text-white font-bold py-3 px-8 rounded-full cursor-not-allowed"
                >
                    Nenhum capítulo disponível
                </button>
              )}
              <button
                onClick={handleLikeClick}
                disabled={!isAuthenticated}
                className={`inline-flex items-center justify-center gap-2 text-center font-bold py-3 px-6 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLiked 
                    ? 'bg-red-500/10 border border-red-500 text-red-500' 
                    : 'bg-transparent border border-text-secondary text-text-secondary hover:bg-surface'
                }`}
                aria-label={isLiked ? "Descurtir história" : "Curtir história"}
                aria-pressed={isLiked}
              >
                <HeartIcon isLiked={isLiked} className="w-5 h-5" />
                <span>{isLiked ? 'Curtido' : 'Curtir'}</span>
              </button>
              {canShare && (
                 <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 text-center bg-transparent border border-primary text-primary font-bold py-3 px-6 rounded-full hover:bg-primary/10 transition-colors duration-300"
                    aria-label="Compartilhar história"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span>Compartilhar</span>
                </button>
              )}
          </div>
        </div>
      </header>
      
      {/* Chapter List */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">Capítulos</h2>
        <div className="bg-surface rounded-lg divide-y divide-slate-700">
          {chapters.length > 0 ? chapters.map((chapter) => {
            const isCurrent = readingProgress?.chapterNumber === chapter.numero_capitulo;
            const isRead = readingProgress?.readChapters?.includes(chapter.numero_capitulo) ?? false;
            
            const linkClasses = `block p-4 hover:bg-slate-700/50 transition-colors duration-200 ${isCurrent ? 'bg-primary/10' : ''}`;
            const titleClasses = `text-lg ${isRead && !isCurrent ? 'text-text-secondary' : 'text-text-primary'}`;
            const chapterNumberClasses = `font-semibold ${isCurrent ? 'text-primary' : 'text-accent'}`;

            return (
              <Link 
                key={chapter.id} 
                to={`/historias/${story.id}/${chapter.numero_capitulo}`} 
                className={linkClasses}
                aria-label={`Capítulo ${chapter.numero_capitulo}: ${chapter.titulo_capitulo}${isRead ? ' (lido)' : ''}${isCurrent ? ' (progresso atual)' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        {isRead && !chapter.isPremium && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                        {chapter.isPremium && <LockIcon className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <p className={chapterNumberClasses}>Capítulo {chapter.numero_capitulo}</p>
                      <p className={titleClasses}>{chapter.titulo_capitulo}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {isCurrent ? <BookmarkIcon className="w-5 h-5 text-primary" /> : <ChevronRightIcon />}
                  </div>
                </div>
              </Link>
            );
          }) : (
            <p className="p-4 text-text-secondary">Ainda não há capítulos publicados para esta história.</p>
          )}
        </div>
      </section>

      {otherStoriesByAuthor.length > 0 && (
        <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-text-primary border-l-4 border-primary pl-4">Mais de {author?.nome_usuario}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherStoriesByAuthor.map(otherStory => (
                    <StoryCard
                        key={otherStory.id}
                        story={otherStory}
                        chapterCount={getChaptersByStoryId(otherStory.id).length}
                        authorName={author?.nome_usuario || 'Desconhecido'}
                        authorId={otherStory.autor_id}
                        likeCount={getTotalLikeCountForStory(otherStory.id)}
                        commentCount={getCommentCountForStory(otherStory.id)}
                    />
                ))}
            </div>
        </section>
      )}
    </div>
  );
};

export default StoryDetailPage;
