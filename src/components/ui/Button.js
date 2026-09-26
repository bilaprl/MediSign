// src/components/ui/Button.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white focus:ring-teal-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm hover:shadow-md",
    outline:
      "bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus:ring-red-500 border border-red-100",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}