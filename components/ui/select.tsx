"use client";

import React, { useState } from 'react';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    className,
    disabled = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'w-full h-11 px-4 flex items-center justify-between rounded-lg border text-sm transition-all',
                    'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)]',
                    'hover:border-[var(--accent-gold)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span className={!selectedOption ? 'text-[var(--text-tertiary)]' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <IconChevronDown
                    size={16}
                    className={cn(
                        'text-[var(--text-tertiary)] transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Options List */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => !option.disabled && handleSelect(option.value)}
                                        disabled={option.disabled}
                                        className={cn(
                                            'w-full px-4 py-2.5 flex items-center justify-between text-sm text-left transition-colors',
                                            'hover:bg-[var(--bg-hover)]',
                                            option.value === value && 'bg-[var(--accent-gold-light)] text-[var(--accent-gold)]',
                                            option.disabled && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {option.value === value && (
                                            <IconCheck size={16} className="text-[var(--accent-gold)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
