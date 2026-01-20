'use client';

import React, { useState } from 'react';
import {
  IconX, IconCalendar, IconUser, IconFlag, IconCheck, IconPlus, IconTrash, IconMessage,
  IconClock, IconEdit, IconSearch, IconFilter, IconChevronDown
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { TaskDetailsModal } from '@/components/TaskDetailsModal';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos
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

// Dados Mock
const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Revisar propostas de novos leads',
    description: 'Analisar as propostas enviadas aos leads desta semana e preparar feedback.',
    status: 'pendente',
    priority: 'alta',
    createdBy: 'Ricardo Silva',
    assignedTo: 'Pedro Guedes',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['vendas', 'propostas'],
    comments: [],
  },
  {
    id: 't2',
    title: 'Atualizar CRM com dados de janeiro',
    description: 'Import all January sales data into the system.',
    status: 'em_andamento',
    priority: 'media',
    createdBy: 'Pedro Guedes',
    assignedTo: 'Ana Oliveira',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['dados', 'crm'],
    comments: [
      {
        id: 'c1',
        authorId: 'u1',
        authorName: 'Ana Oliveira',
        content: 'Já importei 60% dos dados, finalizando hoje.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 't3',
    title: 'Preparar relatório mensal',
    description: 'Compilar métricas e gerar relatório de performance de janeiro.',
    status: 'solicitada',
    priority: 'urgente',
    createdBy: 'Gestão',
    assignedTo: 'Pedro Guedes',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['relatório', 'gestão'],
    comments: [],
  },
  {
    id: 't4',
    title: 'Follow-up com leads inativos',
    description: 'Entrar em contato com leads que não responderam nos últimos 30 dias.',
    status: 'concluida',
    priority: 'baixa',
    createdBy: 'Pedro Guedes',
    assignedTo: 'Bruno Costa',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['leads', 'follow-up'],
    comments: [],
  },
];

const statusColumns = {
  solicitada: { title: 'Solicitadas', color: '#8b5cf6' },
  pendente: { title: 'Pendentes', color: 'var(--text-secondary)' },
  em_andamento: { title: 'Em Andamento', color: 'var(--accent-gold)' },
  concluida: { title: 'Concluídas', color: '#10b981' },
};

const priorityColors = {
  baixa: '#3b82f6',
  media: '#f59e0b',
  alta: '#ea580c',
  urgente: '#ef4444',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(task.status);
    const matchesPriority = filterPriority.length === 0 || filterPriority.includes(task.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Agrupar por status
  const tasksByStatus = {
    solicitada: filteredTasks.filter(t => t.status === 'solicitada'),
    pendente: filteredTasks.filter(t => t.status === 'pendente'),
    em_andamento: filteredTasks.filter(t => t.status === 'em_andamento'),
    concluida: filteredTasks.filter(t => t.status === 'concluida'),
  };

  // Stats
  const stats = {
    total: tasks.length,
    concluidas: tasks.filter(t => t.status === 'concluida').length,
    emAndamento: tasks.filter(t => t.status === 'em_andamento').length,
    atrasadas: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'concluida').length,
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as Task['status'];
    setTasks(tasks.map(t =>
      t.id === draggableId
        ? { ...t, status: newStatus, ...(newStatus === 'concluida' ? { completedAt: new Date().toISOString() } : {}) }
        : t
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setIsDetailsOpen(false);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: 'concluida' as const, completedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleCreateTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: `t${tasks.length + 1}`,
      title: newTask.title || '',
      description: newTask.description || '',
      status: 'pendente',
      priority: newTask.priority || 'media',
      createdBy: 'Pedro Guedes',
      assignedTo: newTask.assignedTo || 'Pedro Guedes',
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate,
      tags: newTask.tags || [],
      comments: [],
    };
    setTasks([...tasks, task]);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gerenciamento de Tarefas</h1>
          <p className="text-sm text-[var(--text-secondary)]">Organize e acompanhe suas tarefas</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black rounded-lg font-bold transition-all"
        >
          <IconPlus size={18} />
          Nova Tarefa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Total" value={stats.total} icon={<IconFlag size={20} />} />
        <StatsCard title="Em Andamento" value={stats.emAndamento} icon={<IconClock size={20} />} color="var(--accent-gold)" />
        <StatsCard title="Concluídas" value={stats.concluidas} icon={<IconCheck size={20} />} color="var(--success)" />
        <StatsCard title="Atrasadas" value={stats.atrasadas} icon={<IconCalendar size={20} />} color="var(--error)" />
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] transition-all"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(statusColumns).map(([status, config]) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl border-2 ${snapshot.isDraggingOver ? 'border-[var(--accent-gold)]' : 'border-[var(--border-primary)]'
                    } bg-[var(--bg-secondary)] p-4 transition-all`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                      {config.title}
                    </h3>
                    <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                      {tasksByStatus[status as keyof typeof tasksByStatus].length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {tasksByStatus[status as keyof typeof tasksByStatus].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleTaskClick(task)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${snapshot.isDragging
                                ? 'border-[var(--accent-gold)] shadow-2xl rotate-2'
                                : 'border-[var(--border-secondary)] hover:border-[var(--accent-gold)]'
                              } bg-[var(--bg-elevated)]`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 flex-1">
                                {task.title}
                              </h4>
                              <span
                                className="w-2 h-2 rounded-full shrink-0 ml-2 mt-1"
                                style={{ backgroundColor: priorityColors[task.priority] }}
                              />
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[9px] font-bold text-black">
                                  {task.assignedTo.charAt(0)}
                                </div>
                                {task.comments.length > 0 && (
                                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                                    <IconMessage size={12} />
                                    {task.comments.length}
                                  </span>
                                )}
                              </div>
                              {task.dueDate && (
                                <span className="text-[var(--text-muted)]">
                                  {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modais */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color = 'var(--text-secondary)' }: any) {
  return (
    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
          {title}
        </span>
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

// Create Task Modal
function CreateTaskModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'Pedro Guedes',
    priority: 'media' as Task['priority'],
    dueDate: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ title: '', description: '', assignedTo: 'Pedro Guedes', priority: 'media', dueDate: '', tags: [] });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Nova Tarefa" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            Título
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-11 px-4 mt-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
            placeholder="Ex: Revisar propostas de leads"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full p-4 mt-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)] resize-none"
            placeholder="Descreva a tarefa..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              Responsável
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full h-11 px-4 mt-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              Prazo
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full h-11 px-4 mt-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
            Prioridade
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['baixa', 'media', 'alta', 'urgente'] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData({ ...formData, priority })}
                className={`py-2 rounded-lg font-bold text-xs uppercase transition-all ${formData.priority === priority
                    ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)]'
                    : 'opacity-50 hover:opacity-100'
                  }`}
                style={{
                  backgroundColor: `${priorityColors[priority]}20`,
                  color: priorityColors[priority],
                  ringColor: formData.priority === priority ? priorityColors[priority] : 'transparent',
                }}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg font-bold hover:bg-[var(--bg-hover)] transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-black font-bold rounded-lg transition-all flex items-center gap-2"
          >
            <IconCheck size={18} />
            Criar Tarefa
          </button>
        </div>
      </form>
    </Modal>
  );
}