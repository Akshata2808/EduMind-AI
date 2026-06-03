import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border transition duration-300 w-fit shrink-0";
  
  const variants = {
    default: "bg-palegreen border-sage/35 text-slate-950",
    secondary: "bg-surface border-sage/20 text-slate-600",
    destructive: "bg-red-500 border-red-650 text-white",
    outline: "bg-transparent border-sage/30 text-emerald-800"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant] || variants.default, className)}
      {...props}
    />
  );
}
