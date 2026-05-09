import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-3 
    bg-[var(--color-surface)] 
    border-2 border-[var(--color-border)]
    rounded-[var(--radius-md)]
    text-[var(--color-text-primary)]
    placeholder:text-[var(--color-text-muted)]
    transition-all duration-300
    focus:outline-none 
    focus:border-[var(--color-primary)]
    focus:ring-4 
    focus:ring-[var(--color-primary-light)]
    ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : ''}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{helperText}</p>
      )}
    </div>
  );
};
