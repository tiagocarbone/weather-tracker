"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition';
  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    ghost: 'bg-transparent text-white hover:bg-white/5',
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}> {children} </button>
  );
};

export default Button;
