import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}

export function Input({ label, error, fullWidth = false, icon, helperText, className = '', ...props }: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 ${
            icon ? 'pl-10' : ''
          } focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${fullWidth ? 'w-full' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
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

export function Select({ label, error, fullWidth = false, options, helperText, className = '', ...props }: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export function Textarea({ label, error, fullWidth = false, helperText, className = '', ...props }: TextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-vertical placeholder:text-gray-400 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      />
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  );
}
