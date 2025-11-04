
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Fabullis. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-text-primary transition-colors">Instagram</a>
          <a href="#" className="hover:text-text-primary transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
