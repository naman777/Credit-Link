import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false, gradient = false }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
    : 'transition-shadow duration-300';

  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950'
    : 'bg-white dark:bg-gray-800';

  return (
    <div
      className={`${gradientStyles} rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${paddingStyles[padding]} ${hoverStyles} backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}) {
  const gradientClass = gradient
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
    : 'text-gray-900 dark:text-white';

  return <h2 className={`text-2xl font-bold ${gradientClass} ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-gray-700 dark:text-gray-300 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}
