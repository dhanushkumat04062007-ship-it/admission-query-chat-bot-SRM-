"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export function GlowButton({
    children,
    className,
    variant = "primary",
    isLoading = false,
    icon,
    ...props
}: GlowButtonProps) {

    // Base styles
    const baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

    // Variants
    const variants = {
        primary: "bg-srm-maroon text-white hover:bg-[#6e1935] shadow-[0_0_20px_rgba(134,31,65,0.4)] hover:shadow-[0_0_30px_rgba(134,31,65,0.6)] border border-white/10",
        secondary: "bg-srm-gold text-srm-maroon hover:bg-[#d4ac0d] shadow-[0_0_20px_rgba(241,196,15,0.4)] hover:shadow-[0_0_30px_rgba(241,196,15,0.6)]",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading || props.disabled}
            {...(props as any)}
        >
            {/* Shimmer Effect */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
            )}

            <span className="relative z-10 flex items-center gap-2">
                {isLoading && <Loader2 className="animate-spin" size={16} />}
                {!isLoading && icon}
                {children}
            </span>
        </motion.button>
    );
}
