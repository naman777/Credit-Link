import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink' | 'gradient';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export function Badge({ children, variant = 'default', className = '', size = 'md', dot = false }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ring-1 ring-gray-300 dark:ring-gray-600',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-600',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-300 dark:ring-amber-600',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-600',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-300 dark:ring-blue-600',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-300 dark:ring-purple-600',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400 ring-1 ring-pink-300 dark:ring-pink-600',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gradient: 'bg-indigo-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>}
      {children}
    </span>
  );
}
