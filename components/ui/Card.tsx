import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
  bordered?: boolean;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  gradient = false,
  glass = false,
  bordered = true
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const baseStyles = `
    rounded-2xl
    transition-all duration-300 ease-out
  `;

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';

  const backgroundStyles = glass
    ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl'
    : gradient
    ? 'bg-gradient-to-br from-white via-gray-50/50 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900/95 dark:to-indigo-950/30'
    : 'bg-white dark:bg-gray-900';

  const borderStyles = bordered
    ? 'border border-gray-200/80 dark:border-gray-800/80'
    : '';

  const shadowStyles = 'shadow-sm hover:shadow-md';

  return (
    <div
      className={`${baseStyles} ${backgroundStyles} ${borderStyles} ${shadowStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-5 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
  gradient = false,
  size = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeStyles = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  const gradientClass = gradient
    ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent'
    : 'text-gray-900 dark:text-white';

  return (
    <h2 className={`${sizeStyles[size]} font-bold tracking-tight ${gradientClass} ${className}`}>
      {children}
    </h2>
  );
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-1.5 text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-gray-700 dark:text-gray-300 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardStat({
  label,
  value,
  trend,
  trendDirection,
  icon,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p
            className={`mt-1 text-sm font-medium ${
              trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      )}
    </div>
  );
}
