import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const variantClasses = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)]',
    success: 'bg-green-500/10 text-green-500 border-green-500/30',
    error: 'bg-red-500/10 text-red-500 border-red-500/30',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    gold: 'bg-[var(--accent-gold-light)] text-[var(--accent-gold)] border-[var(--accent-gold)]/30',
};

const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2 py-1',
    lg: 'text-xs px-3 py-1.5',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-bold uppercase tracking-widest rounded-full border',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
}
