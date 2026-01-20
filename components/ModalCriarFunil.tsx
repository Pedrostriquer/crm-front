"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { IconPlus, IconX, IconGripVertical, IconCheck } from '@tabler/icons-react';
import { motion, Reorder } from 'framer-motion';

interface Stage {
    id: string;
    name: string;
}

interface FunnelData {
    name: string;
    description: string;
    icon: string;
    color: string;
    stages: Stage[];
}

interface ModalCriarFunilProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (funnel: FunnelData) => void;
}

const iconOptions = ['💰', '💎', '🤝', '🎯', '⚡', '🚀', '🏆', '📈'];
const colorOptions = [
    '#EAB308', '#3B82F6', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

export function ModalCriarFunil({ isOpen, onClose, onSave }: ModalCriarFunilProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FunnelData>({
        name: '',
        description: '',
        icon: '💰',
        color: '#EAB308',
        stages: [
            { id: '1', name: 'Prospecção' },
            { id: '2', name: 'Qualificação' },
            { id: '3', name: 'Proposta' },
            { id: '4', name: 'Negociação' },
            { id: '5', name: 'Fechamento' },
        ],
    });

    const handleClose = () => {
        setStep(1);
        setFormData({
            name: '',
            description: '',
            icon: '💰',
            color: '#EAB308',
            stages: [
                { id: '1', name: 'Prospecção' },
                { id: '2', name: 'Qualificação' },
                { id: '3', name: 'Proposta' },
                { id: '4', name: 'Negociação' },
                { id: '5', name: 'Fechamento' },
            ],
        });
        onClose();
    };

    const handleSave = () => {
        onSave(formData);
        handleClose();
    };

    const addStage = () => {
        const newStage: Stage = {
            id: String(Date.now()),
            name: `Etapa ${formData.stages.length + 1}`,
        };
        setFormData({ ...formData, stages: [...formData.stages, newStage] });
    };

    const removeStage = (id: string) => {
        setFormData({ ...formData, stages: formData.stages.filter(s => s.id !== id) });
    };

    const updateStageName = (id: string, name: string) => {
        setFormData({
            ...formData,
            stages: formData.stages.map(s => s.id === id ? { ...s, name } : s),
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton={false}>
            <div className="space-y-6">
                {/* Header com Steps */}
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border-secondary)]">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Criar Novo Funil</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            Step {step} de 3
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-tertiary)] transition-colors"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-[var(--accent-gold)]' : 'bg-[var(--bg-tertiary)]'
                                }`}
                        />
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {step === 1 && (
                        <Step1
                            name={formData.name}
                            description={formData.description}
                            onChange={(name, description) => setFormData({ ...formData, name, description })}
                        />
                    )}
                    {step === 2 && (
                        <Step2
                            stages={formData.stages}
                            onReorder={(stages) => setFormData({ ...formData, stages })}
                            onAdd={addStage}
                            onRemove={removeStage}
                            onUpdate={updateStageName}
                        />
                    )}
                    {step === 3 && (
                        <Step3
                            icon={formData.icon}
                            color={formData.color}
                            onIconChange={(icon) => setFormData({ ...formData, icon })}
                            onColorChange={(color) => setFormData({ ...formData, color })}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-[var(--border-secondary)]">
                    <button
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className="px-6 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Voltar
                    </button>
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && !formData.name}
                            className="px-6 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próximo
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            <IconCheck size={18} />
                            Criar Funil
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

// Step 1: Nome e Descrição
function Step1({ name, description, onChange }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                    Informações Básicas
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Defina o nome e descrição do seu novo funil de vendas.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    Nome do Funil
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onChange(e.target.value, description)}
                    placeholder="Ex: Funil de Vendas Enterprise"
                    className="w-full h-12 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    Descrição (Opcional)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder="Descreva o propósito deste funil..."
                    rows={4}
                    className="w-full p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all resize-none"
                />
            </div>
        </motion.div>
    );
}

// Step 2: Configuração de Etapas
function Step2({ stages, onReorder, onAdd, onRemove, onUpdate }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    Etapas do Funil
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Defina as etapas do seu funil. Arraste para reordenar.
                </p>
            </div>

            <Reorder.Group axis="y" values={stages} onReorder={onReorder} className="space-y-3">
                {stages.map((stage: Stage, index: number) => (
                    <Reorder.Item key={stage.id} value={stage}>
                        <div className="flex items-center gap-3 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)] hover:border-[var(--accent-gold)] transition-all cursor-move">
                            <IconGripVertical size={18} className="text-[var(--text-muted)] shrink-0" />
                            <span className="text-sm font-bold text-[var(--text-tertiary)] shrink-0 w-6">
                                {index + 1}
                            </span>
                            <input
                                type="text"
                                value={stage.name}
                                onChange={(e) => onUpdate(stage.id, e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-medium"
                            />
                            {stages.length > 2 && (
                                <button
                                    onClick={() => onRemove(stage.id)}
                                    className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-colors"
                                >
                                    <IconX size={16} />
                                </button>
                            )}
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button
                onClick={onAdd}
                className="w-full py-3 border-2 border-dashed border-[var(--border-primary)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-all flex items-center justify-center gap-2"
            >
                <IconPlus size={18} />
                Adicionar Etapa
            </button>
        </motion.div>
    );
}

// Step 3: Personalização
function Step3({ icon, color, onIconChange, onColorChange }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    Personalização
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Escolha um ícone e cor para identificar seu funil.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    Ícone
                </label>
                <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map((ico) => (
                        <button
                            key={ico}
                            onClick={() => onIconChange(ico)}
                            className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${icon === ico
                                    ? 'bg-[var(--accent-gold)] scale-110'
                                    : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]'
                                }`}
                        >
                            {ico}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    Cor de Destaque
                </label>
                <div className="grid grid-cols-8 gap-2">
                    {colorOptions.map((col) => (
                        <button
                            key={col}
                            onClick={() => onColorChange(col)}
                            className={`aspect-square rounded-lg transition-all ${color === col ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] scale-110' : ''
                                }`}
                            style={{ backgroundColor: col, ringColor: col }}
                        />
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-secondary)]">
                <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-4">
                    Preview
                </p>
                <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: color }}
                    >
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--text-primary)]">Seu Funil</p>
                        <p className="text-xs text-[var(--text-tertiary)]">Assim ficará na sidebar</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
