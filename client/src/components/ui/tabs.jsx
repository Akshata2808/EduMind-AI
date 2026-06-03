import React from 'react';
import { cn } from '../../lib/utils';

export function Tabs({ value, onValueChange, className, children, ...props }) {
  const [activeTab, setActiveTab] = React.useState(value);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ activeTab, onTabChange, className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-surface text-slate-650 inline-flex h-11 w-full items-center justify-start rounded-full p-1 border border-sage/20 shadow-inner max-w-md mx-auto sm:mx-0",
        className
      )}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, onTabChange });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, activeTab, onTabChange, className, children, ...props }) {
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      onClick={() => onTabChange && onTabChange(value)}
      className={cn(
        "inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-extrabold whitespace-nowrap transition duration-300",
        isActive
          ? "bg-white text-slate-950 shadow-sm border border-sage/25 scale-102"
          : "text-slate-600 hover:text-slate-950",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, className, children, ...props }) {
  const isActive = activeTab === value;
  if (!isActive) return null;
  return (
    <div
      className={cn("flex-1 outline-none mt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
