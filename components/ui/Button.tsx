import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'gradient' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold tracking-tight
    rounded-xl
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    active:scale-[0.98]
    select-none
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-b from-indigo-500 to-indigo-600
      text-white
      shadow-md shadow-indigo-500/25
      hover:from-indigo-600 hover:to-indigo-700
      hover:shadow-lg hover:shadow-indigo-500/30
      focus-visible:ring-indigo-500
      border border-indigo-600/20
    `,
    secondary: `
      bg-gradient-to-b from-violet-500 to-violet-600
      text-white
      shadow-md shadow-violet-500/25
      hover:from-violet-600 hover:to-violet-700
      hover:shadow-lg hover:shadow-violet-500/30
      focus-visible:ring-violet-500
      border border-violet-600/20
    `,
    danger: `
      bg-gradient-to-b from-red-500 to-red-600
      text-white
      shadow-md shadow-red-500/25
      hover:from-red-600 hover:to-red-700
      hover:shadow-lg hover:shadow-red-500/30
      focus-visible:ring-red-500
      border border-red-600/20
    `,
    success: `
      bg-gradient-to-b from-emerald-500 to-emerald-600
      text-white
      shadow-md shadow-emerald-500/25
      hover:from-emerald-600 hover:to-emerald-700
      hover:shadow-lg hover:shadow-emerald-500/30
      focus-visible:ring-emerald-500
      border border-emerald-600/20
    `,
    outline: `
      bg-white dark:bg-gray-900
      text-indigo-600 dark:text-indigo-400
      border-2 border-indigo-200 dark:border-indigo-800
      hover:bg-indigo-50 dark:hover:bg-indigo-950
      hover:border-indigo-300 dark:hover:border-indigo-700
      focus-visible:ring-indigo-500
      shadow-sm
    `,
    ghost: `
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus-visible:ring-gray-500
    `,
    gradient: `
      bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500
      text-white
      shadow-lg shadow-violet-500/30
      hover:shadow-xl hover:shadow-violet-500/40
      hover:scale-[1.02]
      focus-visible:ring-violet-500
      animate-gradient
      border border-white/10
    `,
    glass: `
      bg-white/80 dark:bg-gray-900/80
      backdrop-blur-xl
      text-gray-900 dark:text-white
      border border-gray-200/50 dark:border-gray-700/50
      shadow-lg
      hover:bg-white dark:hover:bg-gray-900
      focus-visible:ring-gray-500
    `,
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const iconSizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className={`animate-spin ${iconSizeStyles[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon && iconPosition === 'left' ? (
        icon
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' ? icon : null}
    </button>
  );
}
