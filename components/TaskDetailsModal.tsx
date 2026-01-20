'use client';

import React, { useState } from 'react';
import {
    IconX, IconCalendar, IconUser, IconFlag, IconCheck, IconTrash,
    IconMessage, IconClock, IconEdit
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import confetti from 'canvas-confetti';

interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'solicitada' | 'pendente' | 'em_andamento' | 'concluida';
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    createdBy: string;
    assignedTo: string;
    createdAt: string;
    dueDate?: string;
    completedAt?: string;
    tags: string[];
    comments: Comment[];
}

interface TaskDetailsModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (id: string) => void;
    onComplete: (id: string) => void;
}

const priorityColors = {
    baixa: '#3b82f6',
    media: '#f59e0b',
    alta: '#ea580c',
    urgente: '#ef4444',
};

const statusLabels = {
    solicitada: 'Solicitada',
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
};

export function TaskDetailsModal({
    task,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    onComplete,
}: TaskDetailsModalProps) {
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task | null>(null);

    React.useEffect(() => {
        if (task) {
            setEditedTask({ ...task });
        }
    }, [task]);

    if (!task || !editedTask) return null;

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: String(Date.now()),
            authorId: 'current-user',
            authorName: 'Pedro Guedes',
            content: newComment,
            createdAt: new Date().toISOString(),
        };

        const updatedTask = {
            ...task,
            comments: [...task.comments, comment],
        };

        onUpdate(updatedTask);
        setNewComment('');
    };

    const handleComplete = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
        onComplete(task.id);
        setTimeout(onClose, 1000);
    };

    const handleSaveEdit = () => {
        onUpdate(editedTask);
        setIsEditing(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
            <div className="flex flex-col h-[80vh] max-h-[800px]">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[var(--border-primary)]">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                className="text-2xl font-bold text-[var(--text-primary)] bg-transparent border-none outline-none w-full"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{task.title}</h2>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                variant={task.status === 'concluida' ? 'success' : 'default'}
                                size="sm"
                            >
                                {statusLabels[task.status]}
                            </Badge>
                            <span
                                className="text-xs px-2 py-0.5 rounded-full font-bold"
                                style={{
                                    backgroundColor: `${priorityColors[task.priority]}20`,
                                    color: priorityColors[task.priority],
                                }}
                            >
                                {task.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing && task.status !== 'concluida' && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-tertiary)] transition-colors"
                            >
                                <IconEdit size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-tertiary)] transition-colors"
                        >
                            <IconX size={20} />
                        </button>
                    </div>
                </div>

                {/* Detalhes */}
                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Descrição */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                            Descrição
                        </h3>
                        {isEditing ? (
                            <textarea
                                value={editedTask.description}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                rows={4}
                                className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] resize-none outline-none"
                            />
                        ) : (
                            <p className="text-[var(--text-secondary)]">{task.description}</p>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                                Responsável
                            </h4>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-xs font-bold text-black">
                                    {task.assignedTo.charAt(0)}
                                </div>
                                <span className="text-sm text-[var(--text-primary)]">{task.assignedTo}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                                Criado Por
                            </h4>
                            <div className="flex items-center gap-2">
                                <IconUser size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-sm text-[var(--text-primary)]">{task.createdBy}</span>
                            </div>
                        </div>

                        {task.dueDate && (
                            <div>
                                <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                                    Prazo
                                </h4>
                                <div className="flex items-center gap-2">
                                    <IconCalendar size={16} className="text-[var(--text-secondary)]" />
                                    <span className="text-sm text-[var(--text-primary)]">
                                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                                Criada Em
                            </h4>
                            <div className="flex items-center gap-2">
                                <IconClock size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-sm text-[var(--text-primary)]">
                                    {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comentários */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
                            Comentários ({task.comments.length})
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {task.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-xs font-bold text-black shrink-0">
                                        {comment.authorName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-[var(--text-primary)]">
                                                {comment.authorName}
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)]">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)]">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Input de Comentário */}
                <div className="pt-4 border-t border-[var(--border-primary)] space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            placeholder="Adicionar um comentário..."
                            className="flex-1 h-10 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
                        />
                        <button
                            onClick={handleAddComment}
                            className="px-4 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-colors"
                        >
                            <IconMessage size={18} />
                        </button>
                    </div>

                    {/* Ações */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => onDelete(task.id)}
                            className="px-4 py-2 text-[var(--error)] hover:bg-red-500/10 rounded-lg font-bold transition-colors flex items-center gap-2"
                        >
                            <IconTrash size={18} />
                            Deletar
                        </button>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedTask({ ...task });
                                        }}
                                        className="px-4 py-2 border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg font-bold hover:bg-[var(--bg-hover)] transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <IconCheck size={18} />
                                        Salvar
                                    </button>
                                </>
                            ) : (
                                task.status !== 'concluida' && (
                                    <button
                                        onClick={handleComplete}
                                        className="px-4 py-2 bg-[var(--success)] hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <IconCheck size={18} />
                                        Marcar como Concluída
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
