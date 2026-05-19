"use client";

import { cn } from "../../lib/utils"; // Assuming utils exists, if not I will replace with clsx/tailwind-merge directly or simplified version

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-srm-maroon text-white hover:bg-red-900 shadow-md hover:shadow-lg",
        secondary: "bg-srm-gold text-srm-maroon hover:bg-yellow-400 font-bold",
        outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-lg",
    };

    // Simple string concatenation if utils not present
    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (
        <button className={combinedClassName} {...props} />
    );
}
