import React from 'react';
import { cn } from '../../lib/utils';

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sage/25 shadow-sm bg-mint/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ className, src, alt, ...props }) {
  const [hasError, setHasError] = React.useState(false);
  
  if (hasError || !src) return null;
  
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-mint text-emerald-950 font-black text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
