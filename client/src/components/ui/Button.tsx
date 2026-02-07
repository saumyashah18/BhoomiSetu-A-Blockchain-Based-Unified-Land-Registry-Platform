import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-orange-500 shadow-lg shadow-blue-500/25 hover:shadow-orange-500/40 active:scale-95',
        secondary: 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-orange-100 hover:border-orange-300 hover:text-orange-600 active:scale-95',
        outline: 'bg-transparent border border-blue-500 text-blue-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white active:scale-95',
        ghost: 'bg-transparent text-gray-600 hover:text-orange-600 hover:bg-orange-50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
