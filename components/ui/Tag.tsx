
import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
  return (
    <span className={`inline-block bg-primary/20 text-accent text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
      {children}
    </span>
  );
};

export default Tag;
