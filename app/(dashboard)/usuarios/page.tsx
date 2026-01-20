'use client';

import React, { useState } from 'react';
import {
    IconPlus, IconSearch, IconFilter, IconDotsVertical,
    IconUser, IconMail, IconShield, IconX, IconCheck
} from "@tabler/icons-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

// Tipagens
interface User {
    id: string;
    name: string;
    email: string;
    role: 'Gestor' | 'Consultor' | 'Suporte';
    team: string;
    status: 'Ativo' | 'Inativo';
    avatar: string;
    joinedAt: string;
}

const mockUsers: User[] = [
    { id: '1', name: 'Pedro Guedes', email: 'pedro@golden.com', role: 'Gestor', team: 'Gestão', status: 'Ativo', avatar: 'PG', joinedAt: '2025-01-15' },
    { id: '2', name: 'Ana Oliveira', email: 'ana@golden.com', role: 'Consultor', team: 'Vendas', status: 'Ativo', avatar: 'AO', joinedAt: '2025-02-10' },
    { id: '3', name: 'Ricardo Silva', email: 'ricardo@golden.com', role: 'Consultor', team: 'Vendas', status: 'Ativo', avatar: 'RS', joinedAt: '2025-03-05' },
    { id: '4', name: 'Carla Santos', email: 'carla@golden.com', role: 'Suporte', team: 'Atendimento', status: 'Ativo', avatar: 'CS', joinedAt: '2025-04-20' },
    { id: '5', name: 'Bruno Costa', email: 'bruno@golden.com', role: 'Consultor', team: 'Vendas', status: 'Inativo', avatar: 'BC', joinedAt: '2024-12-01' },
];

const roleOptions = [
    { value: 'Gestor', label: 'Gestor' },
    { value: 'Consultor', label: 'Consultor' },
    { value: 'Suporte', label: 'Suporte' },
];

const teamOptions = [
    { value: 'Gestão', label: 'Gestão' },
    { value: 'Vendas', label: 'Vendas' },
    { value: 'Atendimento', label: 'Atendimento' },
];

const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
];

export default function UsuariosPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterTeam, setFilterTeam] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filtrar usuários
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !filterRole || user.role === filterRole;
        const matchesTeam = !filterTeam || user.team === filterTeam;
        const matchesStatus = !filterStatus || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesTeam && matchesStatus;
    });

    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gerenciamento de Usuários</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Gerencie usuários, equipes e permissões do sistema</p>
                </div>

                <button
                    onClick={handleCreateUser}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-yellow-500/10"
                >
                    <IconPlus size={18} />
                    Criar Usuário
                </button>
            </div>

            {/* FILTROS */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Busca */}
                    <div className="lg:col-span-2 relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-gold)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                        />
                    </div>

                    {/* Filtros */}
                    <Select
                        options={[{ value: '', label: 'Todos os Cargos' }, ...roleOptions]}
                        value={filterRole}
                        onChange={setFilterRole}
                        placeholder="Cargo"
                    />
                    <Select
                        options={[{ value: '', label: 'Todas as Equipes' }, ...teamOptions]}
                        value={filterTeam}
                        onChange={setFilterTeam}
                        placeholder="Equipe"
                    />
                    <Select
                        options={[{ value: '', label: 'Todos os Status' }, ...statusOptions]}
                        value={filterStatus}
                        onChange={setFilterStatus}
                        placeholder="Status"
                    />
                </div>
            </div>

            {/* TABELA DE USUÁRIOS */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest border-b border-[var(--border-primary)]">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Cargo</th>
                                <th className="px-6 py-4">Equipe</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Data de Entrada</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-secondary)]">
                            {filteredUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group"
                                    onClick={() => handleEditUser(user)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-xs text-black font-bold shrink-0">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={user.role === 'Gestor' ? 'gold' : user.role === 'Consultor' ? 'info' : 'success'}
                                            size="sm"
                                        >
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{user.team}</td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={user.status === 'Ativo' ? 'success' : 'default'}
                                            size="sm"
                                        >
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-tertiary)]">
                                        {new Date(user.joinedAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditUser(user);
                                            }}
                                            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            <IconDotsVertical size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-16">
                            <IconUser size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                            <p className="text-[var(--text-tertiary)]">Nenhum usuário encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSave={(userData) => {
                    if (selectedUser) {
                        // Editar usuário existente
                        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
                    } else {
                        // Criar novo usuário
                        const newUser: User = {
                            id: String(users.length + 1),
                            avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                            joinedAt: new Date().toISOString().split('T')[0],
                            ...userData
                        };
                        setUsers([...users, newUser]);
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}

// MODAL DE USUÁRIO
function UserModal({
    isOpen,
    onClose,
    user,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (user: Partial<User>) => void;
}) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Consultor' as 'Gestor' | 'Consultor' | 'Suporte',
        team: user?.team || 'Vendas',
        status: user?.status || 'Ativo' as 'Ativo' | 'Inativo',
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                team: user.team,
                status: user.status,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Consultor',
                team: 'Vendas',
                status: 'Ativo',
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Editar Usuário' : 'Criar Novo Usuário'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all"
                        placeholder="Ex: João Silva"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        E-mail
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] outline-none transition-all"
                        placeholder="joao@golden.com"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Cargo */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            Cargo
                        </label>
                        <Select
                            options={roleOptions}
                            value={formData.role}
                            onChange={(value) => setFormData({ ...formData, role: value as any })}
                        />
                    </div>

                    {/* Equipe */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            Equipe
                        </label>
                        <Select
                            options={teamOptions}
                            value={formData.team}
                            onChange={(value) => setFormData({ ...formData, team: value })}
                        />
                    </div>
                </div>

                {/* Status */}
                {user && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            Status
                        </label>
                        <Select
                            options={statusOptions}
                            value={formData.status}
                            onChange={(value) => setFormData({ ...formData, status: value as any })}
                        />
                    </div>
                )}

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
                        {user ? 'Salvar Alterações' : 'Criar Usuário'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
