'use client';

import React, { useState } from 'react';
import {
    IconUser,
    IconMail,
    IconBriefcase,
    IconUsers,
    IconMoon,
    IconSun,
    IconBell,
    IconShieldCheck,
    IconTrendingUp,
    IconTarget,
    IconChecklist,
    IconEdit
} from "@tabler/icons-react";
import { useTheme } from '@/contexts/ThemeProvider';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Mock de dados do usuário
const userData = {
    id: '1',
    name: 'Pedro Guedes',
    email: 'pedro@golden.com',
    role: 'Gestor' as const,
    team: 'Gestão',
    avatar: 'PG',
    phone: '(46) 99999-9999',
    joinedAt: '2025-01-15',
    stats: {
        leadsAssigned: 142,
        tasksCompleted: 87,
        conversionRate: 18.5,
        activeDeals: 12
    },
    preferences: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true
    }
};

const roleColors = {
    Gestor: 'gold',
    Consultor: 'info',
    Suporte: 'success'
} as const;

export default function PerfilPage() {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(userData.preferences);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Meu Perfil</h1>
                <p className="text-[var(--text-secondary)] text-sm">Gerencie suas informações e preferências</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUNA ESQUERDA - Informações Principais */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Card de Perfil */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-8"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-3xl text-black font-bold shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                    {userData.avatar}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-full hover:bg-[var(--bg-hover)] transition-colors">
                                    <IconEdit size={14} className="text-[var(--accent-gold)]" />
                                </button>
                            </div>

                            {/* Informações */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">{userData.name}</h2>
                                    <Badge variant={roleColors[userData.role]} size="md">
                                        {userData.role}
                                    </Badge>
                                </div>
                                <p className="text-[var(--text-secondary)] mb-4">{userData.email}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem icon={<IconBriefcase size={16} />} label="Cargo" value={userData.role} />
                                    <InfoItem icon={<IconUsers size={16} />} label="Equipe" value={userData.team} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estatísticas Pessoais */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <IconTrendingUp className="text-[var(--accent-gold)]" size={20} />
                            Estatísticas Pessoais
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={<IconTarget size={20} className="text-blue-500" />}
                                label="Leads Atribuídos"
                                value={userData.stats.leadsAssigned}
                            />
                            <StatCard
                                icon={<IconChecklist size={20} className="text-green-500" />}
                                label="Tarefas Concluídas"
                                value={userData.stats.tasksCompleted}
                            />
                            <StatCard
                                icon={<IconTrendingUp size={20} className="text-[var(--accent-gold)]" />}
                                label="Taxa de Conversão"
                                value={`${userData.stats.conversionRate}%`}
                            />
                            <StatCard
                                icon={<IconShieldCheck size={20} className="text-purple-500" />}
                                label="Negócios Ativos"
                                value={userData.stats.activeDeals}
                            />
                        </div>
                    </motion.div>

                    {/* Informações de Contato */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <IconUser className="text-[var(--accent-gold)]" size={20} />
                                Informações de Contato
                            </h3>
                            <button className="text-sm text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] font-medium">
                                Editar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ContactField icon={<IconMail size={16} />} label="E-mail" value={userData.email} />
                            <ContactField icon={<IconUser size={16} />} label="Telefone" value={userData.phone} />
                            <ContactField icon={<IconBriefcase size={16} />} label="Cargo" value={userData.role} />
                            <ContactField icon={<IconUsers size={16} />} label="Equipe" value={userData.team} />
                        </div>
                    </motion.div>
                </div>

                {/* COLUNA DIREITA - Configurações */}
                <div className="space-y-6">

                    {/* Tema */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Aparência</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-secondary)]">
                                <div className="flex items-center gap-3">
                                    {theme === 'dark' ? (
                                        <IconMoon className="text-blue-400" size={20} />
                                    ) : (
                                        <IconSun className="text-yellow-500" size={20} />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-primary)]">Tema</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">
                                            {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleTheme}
                                    className="relative w-14 h-8 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-full transition-all hover:border-[var(--accent-gold)]"
                                >
                                    <motion.div
                                        className="absolute top-1 w-6 h-6 bg-[var(--accent-gold)] rounded-full shadow-lg"
                                        animate={{
                                            left: theme === 'dark' ? 4 : 28
                                        }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Notificações */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <IconBell className="text-[var(--accent-gold)]" size={20} />
                            Notificações
                        </h3>

                        <div className="space-y-4">
                            <NotificationToggle
                                label="Notificações por E-mail"
                                description="Receba atualizações via e-mail"
                                checked={notifications.emailNotifications}
                                onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                            />
                            <NotificationToggle
                                label="Notificações Push"
                                description="Alertas em tempo real"
                                checked={notifications.pushNotifications}
                                onChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                            />
                            <NotificationToggle
                                label="Relatórios Semanais"
                                description="Resumo semanal de atividades"
                                checked={notifications.weeklyReports}
                                onChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

// Sub-componentes
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-[var(--text-tertiary)]">{icon}</div>
            <div>
                <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{label}</p>
                <p className="text-sm text-[var(--text-primary)] font-medium">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
    return (
        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-secondary)] hover:border-[var(--accent-gold)] transition-all">
            <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">{icon}</div>
                <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
                    <p className="text-[9px] text-[var(--text-tertiary)] font-bold uppercase tracking-widest">{label}</p>
                </div>
            </div>
        </div>
    );
}

function ContactField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]">
            <div className="flex items-center gap-2 mb-1">
                <div className="text-[var(--text-tertiary)]">{icon}</div>
                <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-sm text-[var(--text-primary)] font-medium">{value}</p>
        </div>
    );
}

function NotificationToggle({
    label,
    description,
    checked,
    onChange
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]">
            <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-all ${checked ? 'bg-[var(--accent-gold)]' : 'bg-[var(--bg-hover)] border border-[var(--border-primary)]'
                    }`}
            >
                <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{
                        left: checked ? 24 : 4
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
}
