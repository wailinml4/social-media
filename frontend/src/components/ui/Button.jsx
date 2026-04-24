import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(10,132,255,0.3)]",
    secondary: "bg-white text-black hover:scale-105 focus:ring-white/50",
    glass: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md hover:scale-105 focus:ring-white/30 border border-white/10",
    outline: "border border-white/20 text-white hover:bg-white/10 hover:scale-105 focus:ring-white/30",
    ghost: "text-text-dim hover:text-white hover:bg-surface",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
