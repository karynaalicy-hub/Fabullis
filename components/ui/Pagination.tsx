import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
      >
        Anterior
      </button>

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === number
              ? 'bg-primary text-white'
              : 'text-text-secondary bg-surface hover:bg-slate-700'
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
      >
        Próximo
      </button>
    </nav>
  );
};

export default Pagination;
