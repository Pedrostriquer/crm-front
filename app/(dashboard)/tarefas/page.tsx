'use client';

import React, { useState } from 'react';
import { 
  IconPlus, 
  IconAlertTriangle, 
  IconCalendarEvent, 
  IconUserUp, 
  IconSend, 
  IconMessage2, 
  IconFlag,
  IconCheck
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipagens Básicas ---
type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  priority: Priority;
  deadline?: string;
  isRequestedBySuperior?: boolean;
  requestedBy?: string;
  comments: number;
}

export default function TarefasPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'solicitar'>('board');
  
  // Mock de dados para visualização
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar contrato Gold Partners',
      description: 'Verificar cláusulas de rescisão e bônus de performance.',
      category: 'Jurídico',
      status: 'pendente',
      priority: 'urgente',
      deadline: '2026-01-10',
      isRequestedBySuperior: true,
      requestedBy: 'Diretoria (Marcos)',
      comments: 3
    },
    {
      id: '2',
      title: 'Follow-up Lead Instagram #99',
      description: 'Cliente demonstrou interesse no pacote premium.',
      category: 'Comercial',
      status: 'em_andamento',
      priority: 'media',
      deadline: '2026-01-10',
      comments: 0
    },
    {
      id: '3',
      title: 'Relatório Trimestral',
      description: 'Consolidar dados de conversão do último trimestre.',
      category: 'Admin',
      status: 'pendente',
      priority: 'alta',
      deadline: '2026-01-08', // Atrasada
      comments: 5
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Central de Tarefas</h1>
          <p className="text-zinc-500 text-sm">Gerencie suas obrigações e solicitações de equipe.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('solicitar')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            <IconSend size={18} />
            Solicitar para Equipe
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-yellow-500/10">
            <IconPlus size={18} />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* MODAL / VIEW DE SOLICITAÇÃO (Simulado como aba) */}
      {activeTab === 'solicitar' && (
        <RequestTaskView onClose={() => setActiveTab('board')} />
      )}

      {/* QUADRO DE TAREFAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* COLUNA 1: PRIORIDADE / SUPERIOR */}
        <TaskColumn 
          title="Solicitações da Gestão" 
          icon={<IconUserUp className="text-purple-400" />}
          tasks={tasks.filter(t => t.isRequestedBySuperior)}
          isPriority
        />

        {/* COLUNA 2: HOJE / EM DIA */}
        <TaskColumn 
          title="Tarefas de Hoje" 
          icon={<IconCalendarEvent className="text-[#EAB308]" />}
          tasks={tasks.filter(t => !t.isRequestedBySuperior && t.deadline === '2026-01-10')}
        />

        {/* COLUNA 3: ATRASADAS */}
        <TaskColumn 
          title="Atrasadas / Pendentes" 
          icon={<IconAlertTriangle className="text-red-500" />}
          tasks={tasks.filter(t => t.deadline && t.deadline < '2026-01-10')}
        />

      </div>
    </div>
  );
}

// --- SUB-COMPONENTES ---

function TaskColumn({ title, icon, tasks, isPriority = false }: any) {
  return (
    <div className="flex flex-col gap-4 bg-[#121212] p-4 rounded-2xl border border-zinc-800/50">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">{title}</h3>
        </div>
        <span className="text-xs bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-800">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
        {tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} isPriority={isPriority} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 text-xs italic">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, isPriority }: { task: Task, isPriority: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-5 rounded-xl border group transition-all cursor-pointer bg-[#18181b] 
        ${isPriority ? 'border-purple-500/30 hover:border-purple-500' : 'border-zinc-800 hover:border-[#EAB308]'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter
          ${task.priority === 'urgente' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
          {task.priority}
        </span>
        <div className="flex gap-2">
          {task.comments > 0 && (
            <div className="flex items-center gap-1 text-zinc-500">
              <IconMessage2 size={14} />
              <span className="text-[10px]">{task.comments}</span>
            </div>
          )}
        </div>
      </div>

      <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-[#EAB308] transition-colors">
        {task.title}
      </h4>
      <p className="text-zinc-500 text-xs line-clamp-2 mb-4">
        {task.description}
      </p>

      {task.isRequestedBySuperior && (
        <div className="mb-4 p-2 rounded bg-purple-500/5 border border-purple-500/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[10px] text-purple-300 font-medium italic">De: {task.requestedBy}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-400">
          <IconFlag size={14} />
          <span className="text-[10px] font-medium uppercase tracking-widest">{task.category}</span>
        </div>
        
        <select className="bg-transparent text-[10px] text-[#EAB308] outline-none font-bold uppercase cursor-pointer hover:underline">
          <option className="bg-[#121212]" value="pendente">Pendente</option>
          <option className="bg-[#121212]" value="andamento">Em Curso</option>
          <option className="bg-[#121212]" value="concluida">Finalizada</option>
        </select>
      </div>
    </motion.div>
  );
}

// --- VISTA DE SOLICITAÇÃO DE TAREFA ---
function RequestTaskView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151515] border border-zinc-800 rounded-2xl p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <IconSend className="text-[#EAB308]" />
          Solicitar Tarefa para Outro Usuário
        </h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">Fechar</button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Responsável</label>
            <select className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:ring-1 focus:ring-[#EAB308] outline-none">
              <option>Ana Oliveira (Consultor)</option>
              <option>Ricardo Silva (Operacional)</option>
              <option>Equipe de Suporte</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nível de Urgência</label>
            <div className="flex gap-2">
              {['Baixa', 'Média', 'Alta', 'Urgente'].map((level) => (
                <button 
                  key={level}
                  type="button"
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all
                    ${level === 'Urgente' ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Título da Task</label>
            <input 
              placeholder="Ex: Resolver pendência de pagamento do cliente X"
              className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:ring-1 focus:ring-[#EAB308] outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Instruções / Descrição</label>
            <textarea 
              rows={3}
              placeholder="Descreva o que deve ser feito com detalhes..."
              className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:ring-1 focus:ring-[#EAB308] outline-none resize-none" 
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button className="px-10 py-3 bg-[#EAB308] text-black font-bold rounded-xl hover:bg-[#CA8A04] transition-all flex items-center gap-2 shadow-xl shadow-yellow-500/5">
            Enviar Solicitação
            <IconSend size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}