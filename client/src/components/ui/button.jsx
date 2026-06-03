import React from 'react';
import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition duration-300 disabled:pointer-events-none disabled:opacity-50 hover:scale-103 shrink-0";
  
  const variants = {
    default: "bg-palegreen hover:bg-sage text-slate-950 border border-sage/35 shadow-md",
    destructive: "bg-red-500 hover:bg-red-650 text-white shadow-md border border-red-600",
    outline: "border border-sage/35 bg-white shadow-sm hover:bg-mint/45 text-slate-800",
    secondary: "bg-mint hover:bg-palegreen text-emerald-950 border border-sage/20",
    ghost: "hover:bg-mint/35 text-slate-700 hover:text-emerald-900",
    link: "text-emerald-700 underline-offset-4 hover:underline"
  };

  const sizes = {
    default: "h-10 px-6 py-2.5",
    sm: "h-8 rounded-full text-xs gap-1.5 px-4",
    lg: "h-12 rounded-full px-8",
    icon: "h-10 w-10 p-0 flex items-center justify-center"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant] || variants.default, sizes[size], className)}
      {...props}
    />
  );
}
