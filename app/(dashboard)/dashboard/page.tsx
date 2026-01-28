"use client";

import React, { useEffect, useState } from "react";
import {
  IconUsers,
  IconClock,
  IconTarget,
  IconChecklist,
  IconTrendingUp,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import api from "@/lib/api";

const MetricCard = ({ title, value, icon, trend, isGold = false }: any) => (
  <div
    className={`p-6 rounded-xl border ${
      isGold
        ? "border-[#EAB308]/50 bg-[#EAB308]/5"
        : "border-[#27272a] bg-[#18181b]"
    } transition-all hover:border-[#EAB308]`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-2 rounded-lg ${
          isGold ? "bg-[#EAB308] text-black" : "bg-[#27272a] text-[#EAB308]"
        }`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        {trend}
      </span>
    </div>
    <h4 className="text-zinc-400 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

const ProgressBar = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-1000`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const TaskItem = ({ time, task, completed = false }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#27272a]/50 transition-colors group">
    <span className="text-xs font-mono text-zinc-500">{time}</span>
    <div
      className={`h-2 w-2 rounded-full ${
        completed ? "bg-zinc-600" : "bg-[#EAB308]"
      }`}
    />
    <span
      className={`text-sm ${
        completed ? "text-zinc-500 line-through" : "text-white"
      }`}
    >
      {task}
    </span>
  </div>
);

const RankingRow = ({ name, role, status }: any) => (
  <tr className="hover:bg-[#27272a]/30 transition-colors group border-b border-[#27272a]/50 last:border-0">
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-bold text-white uppercase">
        {name.charAt(0)}
      </div>
      <span className="text-sm font-medium text-white">{name}</span>
    </td>
    <td className="px-6 py-4 text-sm text-zinc-400">{role}</td>
    <td className="px-6 py-4">
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
          status === "active"
            ? "bg-green-500/10 text-green-500"
            : "bg-zinc-500/10 text-zinc-500"
        }`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-zinc-500 text-right italic">
      Online
    </td>
  </tr>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get("/dashboard/summary");
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-zinc-500 animate-pulse">
        Carregando centro de comando...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-white">Painel de Controle</h1>
        <p className="text-zinc-500 text-sm">
          Visão em tempo real da operação Golden CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Leads Ativos"
          value={stats?.totalLeads || 0}
          icon={<IconUsers size={24} />}
          trend="Total na base"
        />
        <MetricCard
          title="Tarefas Pendentes"
          value={stats?.pendingTasks || 0}
          icon={<IconChecklist size={24} />}
          trend="Aguardando ação"
        />
        <MetricCard
          title="Membros da Equipe"
          value={stats?.totalEmployees || 0}
          icon={<IconTarget size={24} />}
          trend="Usuários ativos"
          isGold
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <IconTrendingUp size={20} className="text-[#EAB308]" />
            Leads por Estágio
          </h3>
          <div className="space-y-5">
            {stats?.leadsPerStage?.length > 0 ? (
              stats.leadsPerStage.map((item: any) => (
                <ProgressBar
                  key={item.stage}
                  label={item.stage}
                  value={Math.round((item.count / stats.totalLeads) * 100)}
                  color="bg-[#EAB308]"
                />
              ))
            ) : (
              <p className="text-zinc-500 text-xs italic">
                Nenhum dado de funil disponível
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <IconClock size={20} className="text-[#EAB308]" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            <TaskItem
              time="Agora"
              task="Sincronização com banco de dados concluída"
              completed
            />
            <TaskItem time="Hoje" task="Novos leads importados via API" />
            <TaskItem time="Hoje" task="Relatório de performance gerado" />
          </div>
        </div>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#27272a]">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <IconTarget size={20} className="text-[#EAB308]" />
            Performance da Equipe
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#18181b] text-zinc-500 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Colaborador</th>
                <th className="px-6 py-4 font-semibold">Cargo</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Disponibilidade
                </th>
              </tr>
            </thead>
            <tbody>
              <RankingRow name="Admin Geral" role="ADMIN" status="active" />
              <RankingRow name="Equipe Staff" role="EMPLOYEE" status="active" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
