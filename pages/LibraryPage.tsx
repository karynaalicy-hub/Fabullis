import React, { useState, useMemo, useEffect } from 'react';
import { stories, genres, getChaptersByStoryId, users, getAuthorByStory, getTotalLikeCountForStory, getCommentCountForStory } from '../data/mockData';
import { Story, Language, Genre } from '../types';
import StoryCard from '../components/ui/StoryCard';
import Pagination from '../components/ui/Pagination';

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white font-semibold'
        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
    }`}
  >
    {label}
  </button>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);


const LibraryPage: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState<Language | 'all'>('all');
  const [activeGenre, setActiveGenre] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const STORIES_PER_PAGE = 8;

  const languageFilters: { label: string; value: Language | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Português', value: Language.Portuguese },
    { label: 'Inglês', value: Language.English },
    { label: 'Espanhol', value: Language.Spanish },
  ];

  const genreFilters: { label: string; value: number | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    ...genres.map((g: Genre) => ({ label: g.nome, value: g.id })),
  ];

  const filteredStories = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    return stories.filter(story => {
      const languageMatch = activeLanguage === 'all' || story.idioma === activeLanguage;
      const genreMatch = activeGenre === 'all' || story.generos.includes(activeGenre);
      
      if (!languageMatch || !genreMatch) {
        return false;
      }

      if (lowercasedQuery === '') {
        return true;
      }

      const author = users.find(u => u.id === story.autor_id);
      const titleMatch = story.titulo.toLowerCase().includes(lowercasedQuery);
      const authorMatch = author ? author.nome_usuario.toLowerCase().includes(lowercasedQuery) : false;

      return titleMatch || authorMatch;
    });
  }, [activeLanguage, activeGenre, searchQuery]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeLanguage, activeGenre, searchQuery]);

  // Pagination logic
  const indexOfLastStory = currentPage * STORIES_PER_PAGE;
  const indexOfFirstStory = indexOfLastStory - STORIES_PER_PAGE;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-5xl font-bold font-serif text-text-primary">Biblioteca de Histórias</h1>
        <p className="mt-2 text-lg text-text-secondary">Descubra mundos fascinantes e personagens inesquecíveis</p>
         <div className="mt-6 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
            </span>
            <input
                type="text"
                placeholder="Buscar por título ou autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface border border-slate-700 rounded-full text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-surface p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-text-primary">Filtros</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-md mb-2 text-text-secondary">Idioma</h4>
              <div className="space-y-1">
                {languageFilters.map(filter => (
                  <FilterButton
                    key={filter.value}
                    label={filter.label}
                    isActive={activeLanguage === filter.value}
                    onClick={() => setActiveLanguage(filter.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-md mb-2 text-text-secondary">Gênero</h4>
              <div className="space-y-1">
                {genreFilters.map(filter => (
                  <FilterButton
                    key={filter.value}
                    label={filter.label}
                    isActive={activeGenre === filter.value}
                    onClick={() => setActiveGenre(filter.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Stories Grid */}
        <main className="flex-1">
          {currentStories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentStories.map(story => {
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
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-surface rounded-lg p-8">
              <h3 className="text-2xl font-bold text-text-primary">Nenhuma história encontrada</h3>
              <p className="text-text-secondary mt-2">Tente ajustar seus filtros ou sua busca para encontrar o que procura.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default LibraryPage;
