import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500",
    secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-blue-500",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${className}
  `.trim();

  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
} 