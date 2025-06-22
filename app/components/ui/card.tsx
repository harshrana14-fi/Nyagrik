import React, { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = ({ children, className = '', ...props }: CardContentProps) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
