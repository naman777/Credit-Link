import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: 'default' | 'filled' | 'ghost';
}

export function Input({
  label,
  error,
  fullWidth = false,
  icon,
  helperText,
  variant = 'default',
  className = '',
  ...props
}: InputProps) {
  const variantStyles = {
    default: `
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      focus:border-indigo-500 dark:focus:border-indigo-500
      focus:ring-2 focus:ring-indigo-500/20
    `,
    filled: `
      bg-gray-50 dark:bg-gray-800/50
      border border-transparent
      focus:bg-white dark:focus:bg-gray-900
      focus:border-indigo-500
      focus:ring-2 focus:ring-indigo-500/20
    `,
    ghost: `
      bg-transparent
      border-b border-gray-200 dark:border-gray-800
      rounded-none
      focus:border-indigo-500
    `,
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full
            ${icon ? 'pl-11' : 'px-4'}
            pr-4
            py-3
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            rounded-xl
            transition-all duration-200
            outline-none
            ${variantStyles[variant]}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  helperText?: string;
}

export function Select({
  label,
  error,
  fullWidth = false,
  options,
  helperText,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full
            px-4
            py-3
            pr-10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            border border-gray-200 dark:border-gray-800
            rounded-xl
            transition-all duration-200
            outline-none
            cursor-pointer
            appearance-none
            focus:border-indigo-500 dark:focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500/20
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  fullWidth = false,
  helperText,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full
          px-4
          py-3
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          border border-gray-200 dark:border-gray-800
          rounded-xl
          transition-all duration-200
          outline-none
          resize-y
          min-h-[100px]
          focus:border-indigo-500 dark:focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-500/20
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
