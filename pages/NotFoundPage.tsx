
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <h2 className="text-3xl font-bold text-text-primary mt-4">Página Não Encontrada</h2>
      <p className="text-text-secondary mt-2">Desculpe, a página que você está procurando não existe.</p>
      <Link to="/" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-hover transition-transform duration-300 transform hover:scale-105">
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
