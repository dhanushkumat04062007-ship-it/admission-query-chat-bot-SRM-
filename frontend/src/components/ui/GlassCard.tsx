"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    title?: string;
}

export function GlassCard({ children, className, hoverEffect = true, title }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" } : {}}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300",
                "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
                className
            )}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />

            <div className="relative z-10 p-6">
                {title && (
                    <h3 className="text-lg font-bold text-white/90 mb-4 flex items-center gap-2">
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </motion.div>
    );
}
