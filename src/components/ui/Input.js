// src/components/ui/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={`
          w-full rounded-xl border px-4 py-3.5 text-slate-900 text-sm transition-all duration-200
          placeholder:text-slate-400 bg-slate-50/50 hover:bg-white
          focus:outline-none focus:ring-4 focus:bg-white
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-500/10'
          }
          disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;