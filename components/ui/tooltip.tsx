"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
    children: React.ReactNode;
    content: string | React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 300,
    className,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
                            positionClasses[position],
                            className
                        )}
                    >
                        {content}
                        {/* Arrow */}
                        <div
                            className={cn(
                                'absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-800 transform rotate-45',
                                position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                                position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                                position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                                position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
