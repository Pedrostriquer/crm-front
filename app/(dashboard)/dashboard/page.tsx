'use client';

import React from 'react';
import {
  IconUsers,
  IconUserCheck,
  IconClock,
  IconTarget,
  IconChecklist,
  IconTrendingUp
} from "@tabler/icons-react";

// 1. Defina os sub-componentes FORA do export default para manter o código limpo
const MetricCard = ({ title, value, icon, trend, isGold = false }: any) => (
  <div className={`p-6 rounded-xl border ${isGold ? 'border-[#EAB308]/50 bg-[var(--accent-gold)]/5' : 'border-[var(--border-primary)] bg-[var(--bg-secondary)]'} transition-all hover:border-[#EAB308]`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${isGold ? 'bg-[var(--accent-gold)] text-black' : 'bg-[var(--bg-tertiary)] text-[var(--accent-gold)]'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{trend}</span>
    </div>
    <h4 className="text-[var(--text-secondary)] text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
  </div>
);

const ProgressBar = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="text-[var(--text-primary)]">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const TaskItem = ({ time, task, completed = false }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-secondary)]/50 transition-colors group">
    <span className="text-xs font-mono text-[var(--text-muted)]">{time}</span>
    <div className={`h-2 w-2 rounded-full ${completed ? 'bg-[var(--bg-hover)]' : 'bg-[var(--accent-gold)]'}`} />
    <span className={`text-sm ${completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>{task}</span>
  </div>
);

const RankingRow = ({ name, leads, conv, value, isTop = false }: any) => (
  <tr className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group border-b border-[var(--border-primary)]/50 last:border-0">
    <td className="px-6 py-4 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isTop ? 'bg-[var(--accent-gold)] text-black' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'}`}>
        {name.charAt(0)}
      </div>
      <span className="text-sm font-medium text-[var(--text-primary)]">{name}</span>
    </td>
    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{leads}</td>
    <td className="px-6 py-4">
      <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--accent-gold)]">{conv}</span>
    </td>
    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono text-right">{value}</td>
  </tr>
);

// 2. O EXPORT DEFAULT deve ser o componente principal da página
export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resumo Operacional</h1>
        <p className="text-[var(--text-tertiary)] text-sm">Bem-vindo ao centro de comando do Golden CRM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total de Leads" value="1,284" icon={<IconUsers size={24} />} trend="+12% este mês" />
        <MetricCard title="Em Negociação" value="456" icon={<IconClock size={24} />} trend="84 aguardando retorno" />
        <MetricCard title="Fechados" value="R$ 142.000" icon={<IconUserCheck size={24} />} trend="+5.2% vs mês anterior" isGold />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
          <h3 className="text-[var(--text-primary)] font-semibold mb-6 flex items-center gap-2">
            <IconTrendingUp size={20} className="text-[var(--accent-gold)]" />
            Leads por Canal
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Instagram Ads" value={75} color="bg-[var(--accent-gold)]" />
            <ProgressBar label="Google Search" value={50} color="bg-zinc-600" />
            <ProgressBar label="WhatsApp Direct" value={90} color="bg-[var(--accent-gold)]" />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-6">
          <h3 className="text-[var(--text-primary)] font-semibold mb-4 flex items-center gap-2">
            <IconChecklist size={20} className="text-[var(--accent-gold)]" />
            Tarefas de Hoje
          </h3>
          <div className="space-y-3">
            <TaskItem time="09:00" task="Call de fechamento - Cliente VIP" completed />
            <TaskItem time="14:30" task="Follow-up leads do Instagram" />
            <TaskItem time="16:00" task="Reunião de alinhamento com consultores" />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border-primary)]">
          <h3 className="text-[var(--text-primary)] font-semibold flex items-center gap-2">
            <IconTarget size={20} className="text-[var(--accent-gold)]" />
            Ranking por Consultor
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Consultor</th>
                <th className="px-6 py-4 font-semibold">Leads</th>
                <th className="px-6 py-4 font-semibold">Conversão</th>
                <th className="px-6 py-4 font-semibold text-right">Volume (R$)</th>
              </tr>
            </thead>
            <tbody>
              <RankingRow name="Ricardo Silva" leads={142} conv="12%" value="R$ 45.200" isTop />
              <RankingRow name="Ana Oliveira" leads={98} conv="15%" value="R$ 38.900" />
              <RankingRow name="Pedro Guedes" leads={85} conv="18%" value="R$ 34.500" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}