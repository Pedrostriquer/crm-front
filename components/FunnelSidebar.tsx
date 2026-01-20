"use client";

import React, { useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

interface Funnel {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface FunnelSidebarProps {
    funnels: Funnel[];
    activeFunnelId: string;
    onSelectFunnel: (id: string) => void;
    onCreateFunnel: () => void;
}

export function FunnelSidebar({
    funnels,
    activeFunnelId,
    onSelectFunnel,
    onCreateFunnel,
}: FunnelSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl flex flex-col items-center py-6 gap-4 shrink-0 overflow-hidden"
            initial={{ width: 80 }}
            animate={{ width: isExpanded ? 240 : 80 }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
            <AnimatePresence>
                {isExpanded && (
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest px-4 w-full"
                    >
                        Meus Funis
                    </motion.h3>
                )}
            </AnimatePresence>

            {/* Lista de Funis */}
            <div className="flex flex-col gap-3 w-full px-4">
                {funnels.map((funnel) => (
                    <Tooltip
                        key={funnel.id}
                        content={funnel.name}
                        position="right"
                        className={isExpanded ? 'hidden' : ''}
                    >
                        <button
                            onClick={() => onSelectFunnel(funnel.id)}
                            className={cn(
                                'w-full rounded-xl transition-all flex items-center gap-3 p-3',
                                activeFunnelId === funnel.id
                                    ? 'bg-[var(--accent-gold)] text-black shadow-lg'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                            )}
                        >
                            <span className="text-2xl shrink-0">{funnel.icon}</span>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="text-sm font-bold truncate text-left"
                                    >
                                        {funnel.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </Tooltip>
                ))}
            </div>

            {/* Botão Criar Funil */}
            <div className="w-full px-4 mt-2">
                <Tooltip
                    content="Criar novo funil"
                    position="right"
                    className={isExpanded ? 'hidden' : ''}
                >
                    <button
                        onClick={onCreateFunnel}
                        className="w-full h-12 rounded-xl border-2 border-dashed border-[var(--border-primary)] flex items-center justify-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-all"
                    >
                        <IconPlus size={20} />
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-sm font-bold"
                                >
                                    Novo Funil
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </Tooltip>
            </div>
        </motion.div>
    );
}
