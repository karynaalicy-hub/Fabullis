import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoryById, getChaptersByStoryId, getCommentsByChapterId, addComment, getUserById, isChapterLikedByUser, toggleChapterLike, reportComment } from '../data/mockData';
import NotFoundPage from './NotFoundPage';
import { useAuth } from '../contexts/AuthContext';
import { Comment } from '../types';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
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

const LockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const FlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);


const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;

    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;

    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;

    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)} horas`;

    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)} minutos`;

    return 'agora mesmo';
};

const ReaderPage: React.FC = () => {
  const { storyId, chapterNumber } = useParams<{ storyId: string; chapterNumber: string }>();
  const { isAuthenticated, currentUser, hasActiveSubscription } = useAuth();
  
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [reportedCommentIds, setReportedCommentIds] = useState<Set<number>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
        const savedTheme = localStorage.getItem('fabullis_reader_theme');
        return savedTheme === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark'; // Default theme
    }
  });


  if (!storyId || !chapterNumber) return <NotFoundPage />;
  const story = getStoryById(Number(storyId));
  const chapters = getChaptersByStoryId(Number(storyId));
  const chapter = chapters.find(c => c.numero_capitulo === Number(chapterNumber));
  if (!story || !chapter) return <NotFoundPage />;

  const chapterId = chapter.id;
  const isPremiumContent = chapter.isPremium || story.isPremium;
  const canRead = !isPremiumContent || hasActiveSubscription;

  // Effect to save theme preference
  useEffect(() => {
    localStorage.setItem('fabullis_reader_theme', theme);
  }, [theme]);
  
  // Load like status
  useEffect(() => {
    if (chapterId && currentUser) {
      setIsLiked(isChapterLikedByUser(chapterId, currentUser.id));
    }
  }, [chapterId, currentUser]);

  // Load comments
  useEffect(() => {
    if (chapterId) {
      setComments(getCommentsByChapterId(chapterId));
    }
  }, [chapterId]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLikeClick = () => {
    if (!chapterId || !currentUser) {
        alert("Você precisa estar logado para curtir um capítulo.");
        return;
    };
    const newLikedState = toggleChapterLike(chapterId, currentUser.id);
    setIsLiked(newLikedState);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !chapterId) return;
    
    const submittedComment = addComment({
      chapterId: chapterId,
      userId: currentUser.id,
      content: newComment,
    });

    setComments(prev => [...prev, submittedComment]);
    setNewComment('');
  };

  const handleReportComment = (commentId: number) => {
    if (!isAuthenticated) {
        alert("Você precisa estar logado para sinalizar um comentário.");
        return;
    }
    reportComment(commentId);
    setReportedCommentIds(prev => new Set(prev).add(commentId));
  };


  // Save progress effect
  useEffect(() => {
    if (!storyId || !chapterNumber || !canRead) return;

    const saveProgress = () => {
      try {
        const allProgress = JSON.parse(localStorage.getItem('fabullis_progress') || '{}');
        const storyProgress = allProgress[storyId] || { readChapters: [] };
        const readChaptersSet = new Set(storyProgress.readChapters);
        readChaptersSet.add(Number(chapterNumber));
        allProgress[storyId] = {
          chapterNumber: Number(chapterNumber),
          scrollPosition: window.scrollY,
          timestamp: Date.now(),
          readChapters: Array.from(readChaptersSet),
        };
        localStorage.setItem('fabullis_progress', JSON.stringify(allProgress));
      } catch (e) {
        console.error("Failed to save reading progress.", e);
      }
    };
    
    let scrollTimeout: number;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(saveProgress, 500);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', saveProgress);
    saveProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveProgress);
      saveProgress();
    };
  }, [storyId, chapterNumber, canRead]);

  // Restore progress effect
  useEffect(() => {
    if (!storyId || !chapterNumber || !canRead) return;
    try {
        const allProgress = JSON.parse(localStorage.getItem('fabullis_progress') || '{}');
        const storyProgress = allProgress[storyId];

        if (storyProgress && storyProgress.chapterNumber === Number(chapterNumber)) {
            setTimeout(() => {
                window.scrollTo({ top: storyProgress.scrollPosition, behavior: 'smooth' });
            }, 100);
        }
    } catch (e) {
        console.error("Failed to apply reading progress.", e);
    }
  }, [storyId, chapterNumber, canRead]);

  const chapterIndex = chapters.findIndex(c => c.id === chapter.id);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;
  
  const containerClasses = theme === 'light' ? 'bg-gray-100' : 'bg-surface';
  const textPrimaryClasses = theme === 'light' ? 'text-gray-900' : 'text-text-primary';
  const textSecondaryClasses = theme === 'light' ? 'text-gray-600' : 'text-text-secondary';
  const borderClasses = theme === 'light' ? 'border-gray-300' : 'border-slate-700';
  const hoverBgClasses = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-slate-700/50';
  const proseClasses = theme === 'light' 
    ? 'prose max-w-none text-black prose-p:text-black prose-headings:text-black font-serif text-lg leading-relaxed' 
    : 'prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary font-serif text-lg leading-relaxed';
  const commentInputClasses = theme === 'light' 
    ? 'w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
    : 'w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm';

  return (
    <div className="max-w-3xl mx-auto">
      <div className={`${containerClasses} p-6 sm:p-8 lg:p-12 rounded-lg transition-colors duration-300`}>
        <header className={`mb-8 text-center ${borderClasses} border-b pb-4 relative`}>
          <button
            onClick={toggleTheme}
            className={`absolute top-0 right-0 p-2 rounded-full ${textSecondaryClasses} ${hoverBgClasses} transition-colors`}
            aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
          <Link to={`/historias/${story.id}`} className="text-accent hover:underline mb-2 block">{story.titulo}</Link>
          <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimaryClasses}`}>{`Capítulo ${chapter.numero_capitulo}: ${chapter.titulo_capitulo}`}</h1>
        </header>

        <main className={proseClasses}>
          {canRead ? (
            chapter.conteudo.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))
          ) : (
            <div className="text-center bg-background p-8 rounded-lg">
                <LockIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-text-primary">Conteúdo Premium</h2>
                <p className="text-text-secondary mt-2">Este capítulo é exclusivo para assinantes. Para continuar lendo, assine um de nossos planos.</p>
                <Link to="/loja" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105">
                    Ver Planos de Assinatura
                </Link>
            </div>
          )}
        </main>

        <footer className={`mt-12 pt-6 ${borderClasses} border-t flex justify-between items-center`}>
          {prevChapter ? (
            <Link to={`/historias/${story.id}/${prevChapter.numero_capitulo}`} className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
              &larr; Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center px-4 py-2 bg-slate-600 text-slate-400 rounded-md cursor-not-allowed">&larr; Anterior</span>
          )}

          {isAuthenticated && canRead && (
            <button
                onClick={handleLikeClick}
                className={`inline-flex items-center justify-center gap-2 text-center font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                    isLiked 
                    ? 'bg-red-500/10 border border-red-500 text-red-500' 
                    : `bg-transparent border ${theme === 'light' ? 'border-gray-400 text-gray-600 hover:bg-gray-200' : 'border-text-secondary text-text-secondary hover:bg-surface'}`
                }`}
                aria-label={isLiked ? "Descurtir capítulo" : "Curtir capítulo"}
                aria-pressed={isLiked}
              >
                <HeartIcon isLiked={isLiked} className="w-5 h-5" />
            </button>
          )}

          {nextChapter ? (
            <Link to={`/historias/${story.id}/${nextChapter.numero_capitulo}`} className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
              Próximo &rarr;
            </Link>
          ) : (
            <span className="inline-flex items-center px-4 py-2 bg-slate-600 text-slate-400 rounded-md cursor-not-allowed">Próximo &rarr;</span>
          )}
        </footer>
      </div>

      {canRead && (
        <section className={`mt-8 ${containerClasses} p-6 sm:p-8 rounded-lg transition-colors duration-300`}>
            <h2 className={`text-2xl font-bold ${textPrimaryClasses} mb-6 ${borderClasses} border-b pb-3`}>Comentários ({comments.length})</h2>
            <div className="space-y-6">
            {comments.map(comment => {
                const user = getUserById(comment.userId);
                if (!user) return null;
                const isReported = reportedCommentIds.has(comment.id) || comment.isReported;
                return (
                <div key={comment.id} className="flex items-start space-x-4">
                    <img src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.nome_usuario} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline space-x-2">
                                <p className={`font-semibold ${textPrimaryClasses}`}>{user.nome_usuario}</p>
                                <p className={`text-xs ${textSecondaryClasses}`}>{timeAgo(comment.timestamp)}</p>
                            </div>
                            {isAuthenticated && currentUser?.id !== comment.userId && (
                                <button 
                                    onClick={() => handleReportComment(comment.id)} 
                                    disabled={isReported}
                                    className={`text-xs flex items-center gap-1 transition-colors ${
                                        isReported 
                                            ? 'text-yellow-500 cursor-default' 
                                            : `${textSecondaryClasses} hover:text-yellow-500`
                                    }`}
                                    aria-label={isReported ? "Comentário sinalizado" : "Sinalizar comentário"}
                                >
                                    <FlagIcon className="w-3 h-3" />
                                    {isReported ? 'Sinalizado' : 'Sinalizar'}
                                </button>
                            )}
                        </div>
                        <p className={`${textSecondaryClasses} mt-1`}>{comment.content}</p>
                    </div>
                </div>
                );
            })}
            {comments.length === 0 && <p className={textSecondaryClasses}>Seja o primeiro a comentar!</p>}
            </div>

            {isAuthenticated && currentUser ? (
            <form onSubmit={handleCommentSubmit} className={`mt-8 pt-6 ${borderClasses} border-t`}>
                <div className="flex items-start space-x-4">
                <img src={currentUser.avatar_url || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt={currentUser.nome_usuario} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                    <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva seu comentário..."
                    required
                    className={commentInputClasses}
                    rows={3}
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover disabled:bg-slate-500">Publicar</button>
                    </div>
                </div>
                </div>
            </form>
            ) : (
            <p className={`mt-8 pt-6 ${borderClasses} border-t ${textSecondaryClasses}`}>
                <Link to="/login" className="text-accent hover:underline">Faça login</Link> para deixar um comentário.
            </p>
            )}
        </section>
      )}
    </div>
  );
};

export default ReaderPage;