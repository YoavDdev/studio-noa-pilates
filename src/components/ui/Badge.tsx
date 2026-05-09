import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'sage' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-text-primary)] border border-[var(--color-primary)]',
    sage: 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)] border border-[var(--color-sage)]',
    outline: 'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded-full',
    md: 'px-3 py-1 text-sm rounded-full',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};
