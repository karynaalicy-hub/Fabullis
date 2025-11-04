import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../types';

interface StoryCardProps {
  story: Story;
  chapterCount: number;
  authorName: string;
  authorId: number;
  likeCount: number;
  commentCount: number;
}

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);
const MessageCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const StoryCard: React.FC<StoryCardProps> = ({ story, chapterCount, authorName, authorId, likeCount, commentCount }) => {
  const truncateSynopsis = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, text.lastIndexOf(' ', length)) + '...';
  };

  return (
    <Link to={`/historias/${story.id}`} className="group flex flex-col bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img className="h-64 w-full object-cover" src={story.capa_url} alt={`Capa de ${story.titulo}`} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">{story.titulo}</h3>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow">{truncateSynopsis(story.sinopse, 100)}</p>
        <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center text-sm text-text-secondary">
            <Link 
                to={`/autores/${authorId}`} 
                className="hover:text-accent transition-colors truncate"
                onClick={(e) => e.stopPropagation()} // Prevents navigating to story page when author is clicked
                title={authorName}
            >
                {authorName}
            </Link>
            <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                <span className="flex items-center gap-1" title={`${likeCount} curtidas`}>
                    <HeartIcon className="w-4 h-4" />
                    {likeCount}
                </span>
                <span className="flex items-center gap-1" title={`${commentCount} comentários`}>
                    <MessageCircleIcon className="w-4 h-4" />
                    {commentCount}
                </span>
                 <span className="font-semibold text-accent">{chapterCount} {chapterCount === 1 ? 'Cap.' : 'Caps.'}</span>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
