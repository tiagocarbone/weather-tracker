"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 placeholder-slate-400 bg-white/90 text-slate-900 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
};

export default Input;
