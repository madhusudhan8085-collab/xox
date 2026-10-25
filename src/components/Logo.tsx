import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-[#12072b] via-[#0d1330] to-[#0a1b2a] border border-cyan-400/40 shadow-lg shadow-cyan-500/20 overflow-hidden flex items-center justify-center select-none group shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <img
        src="/xo-mind-logo.jpg"
        alt="XO MIND: Brain XO Battle"
        className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          // Fallback to SVG if image fails to load
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
};
