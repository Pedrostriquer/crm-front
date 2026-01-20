'use client';

import React, { useState } from 'react';
import {
    IconPlus, IconUsers, IconEdit, IconTrash, IconX, IconCheck, IconSearch
} from "@tabler/icons-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';

// Tipagens
interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

interface Team {
    id: string;
    name: string;
    description: string;
    color: string;
    members: TeamMember[];
    createdAt: string;
}

const colorOptions = [
    { value: '#EAB308', label: 'Dourado' },
    { value: '#3B82F6', label: 'Azul' },
    { value: '#10B981', label: 'Verde' },
    { value: '#F59E0B', label: 'Laranja' },
    { value: '#8B5CF6', label: 'Roxo' },
    { value: '#EC4899', label: 'Rosa' },
];

const mockTeams: Team[] = [
    {
        id: 't1',
        name: 'Gestão',
        description: 'Equipe de gestores e diretoria',
        color: '#EAB308',
        members: [
            { id: '1', name: 'Pedro Guedes', role: 'Gestor', avatar: 'PG' }
        ],
        createdAt: '2025-01-15'
    },
    {
        id: 't2',
        name: 'Vendas',
        description: 'Consultores de vendas e relacionamento',
        color: '#3B82F6',
        members: [
            { id: '2', name: 'Ana Oliveira', role: 'Consultor', avatar: 'AO' },
            { id: '3', name: 'Ricardo Silva', role: 'Consultor', avatar: 'RS' },
            { id: '5', name: 'Bruno Costa', role: 'Consultor', avatar: 'BC' }
        ],
        createdAt: '2025-02-10'
    },
    {
        id: 't3',
        name: 'Atendimento',
        description: 'Equipe de suporte ao cliente',
        color: '#10B981',
        members: [
            { id: '4', name: 'Carla Santos', role: 'Suporte', avatar: 'CS' }
        ],
        createdAt: '2025-03-05'
    },
];

export default function EquipesPage() {
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreateTeam = () => {
        setSelectedTeam(null);
        setIsModalOpen(true);
    };

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const handleDeleteTeam = (teamId: string) => {
        if (confirm('Tem certeza que deseja excluir esta equipe?')) {
            setTeams(teams.filter(t => t.id !== teamId));
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gerenciamento de Equipes</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Organize e gerencie as equipes do sistema</p>
                </div>

                <button
                    onClick={handleCreateTeam}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black rounded-lg text-sm font-bold transition-all shadow-lg"
                >
                    <IconPlus size={18} />
                    Criar Equipe
                </button>
            </div>

            {/* BUSCA */}
            <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
                <input
                    type="text"
                    placeholder="Pesquisar equipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                />
            </div>

            {/* GRID DE EQUIPES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        onEdit={handleEditTeam}
                        onDelete={handleDeleteTeam}
                    />
                ))}
            </div>

            {filteredTeams.length === 0 && (
                <div className="text-center py-16">
                    <IconUsers size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <p className="text-[var(--text-tertiary)]">Nenhuma equipe encontrada</p>
                </div>
            )}

            {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
            <TeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                team={selectedTeam}
                onSave={(teamData) => {
                    if (selectedTeam) {
                        setTeams(teams.map(t => t.id === selectedTeam.id ? { ...t, ...teamData } : t));
                    } else {
                        const newTeam: Team = {
                            id: `t${teams.length + 1}`,
                            name: teamData.name || '',
                            description: teamData.description || '',
                            color: teamData.color || '#EAB308',
                            members: [],
                            createdAt: new Date().toISOString().split('T')[0],
                        };
                        setTeams([...teams, newTeam]);
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}

// CARD DE EQUIPE
function TeamCard({ team, onEdit, onDelete }: {
    team: Team;
    onEdit: (team: Team) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 hover:border-[var(--accent-gold)] transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: team.color }}
                    >
                        <IconUsers size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{team.name}</h3>
                        <p className="text-xs text-[var(--text-tertiary)]">{team.members.length} membros</p>
                    </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(team)}
                        className="p-2 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] transition-colors"
                    >
                        <IconEdit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(team.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                    >
                        <IconTrash size={16} />
                    </button>
                </div>
            </div>

            {/* Descrição */}
            <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                {team.description}
            </p>

            {/* Membros */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                        Membros
                    </span>
                </div>

                {team.members.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {team.members.slice(0, 3).map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]"
                            >
                                <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[9px] text-black font-bold">
                                    {member.avatar}
                                </div>
                                <span className="text-xs text-[var(--text-primary)]">{member.name}</span>
                            </div>
                        ))}
                        {team.members.length > 3 && (
                            <div className="flex items-center px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]">
                                <span className="text-xs text-[var(--text-secondary)]">
                                    +{team.members.length - 3} mais
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">Nenhum membro ainda</p>
                )}
            </div>
        </motion.div>
    );
}

// MODAL DE EQUIPE
function TeamModal({
    isOpen,
    onClose,
    team,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    team: Team | null;
    onSave: (team: Partial<Team>) => void;
}) {
    const [formData, setFormData] = useState({
        name: team?.name || '',
        description: team?.description || '',
        color: team?.color || '#EAB308',
    });

    React.useEffect(() => {
        if (team) {
            setFormData({
                name: team.name,
                description: team.description,
                color: team.color,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                color: '#EAB308',
            });
        }
    }, [team, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={team ? 'Editar Equipe' : 'Criar Nova Equipe'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Nome da Equipe
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all"
                        placeholder="Ex: Equipe de Vendas"
                    />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all resize-none"
                        placeholder="Descreva o propósito desta equipe..."
                    />
                </div>

                {/* Cor */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Cor Identificadora
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                        {colorOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, color: option.value })}
                                className={`aspect-square rounded-lg transition-all ${formData.color === option.value
                                    ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] scale-110'
                                    : 'hover:scale-105'
                                    }`}
                                style={{ backgroundColor: option.value }}
                                title={option.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-secondary)]">
                    <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
                        Preview
                    </p>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: formData.color }}
                        >
                            <IconUsers size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-[var(--text-primary)]">
                                {formData.name || 'Nome da Equipe'}
                            </h4>
                            <p className="text-xs text-[var(--text-tertiary)]">
                                {formData.description || 'Descrição da equipe'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border-secondary)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-all flex items-center gap-2"
                    >
                        <IconCheck size={18} />
                        {team ? 'Salvar Alterações' : 'Criar Equipe'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
