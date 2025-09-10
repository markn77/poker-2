import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading = false,
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const loadingClasses = isLoading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button 
      className={`${baseClasses} ${loadingClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};