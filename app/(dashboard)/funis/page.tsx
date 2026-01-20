'use client';

import React, { useState, useEffect } from 'react';
import {
  IconPlus, IconSearch, IconLayoutColumns, IconChartBar,
  IconClock, IconDotsVertical, IconFilter,
  IconAlertCircle, IconTarget, IconTrendingUp, IconX,
  IconArrowRightBar, IconUser
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from "framer-motion";
import { FunnelSidebar } from '@/components/FunnelSidebar';
import { ModalCriarFunil } from '@/components/ModalCriarFunil';

// --- Tipagens ---
interface LeadCard {
  id: string;
  name: string;
  value: string;
  email: string;
  channel: string;
  responsible: string;
  timeInStage: string;
}

interface Column {
  id: string;
  title: string;
  leads: LeadCard[];
  metrics: {
    avgTime: string;
    lossRate: string;
    totalHistory: number;
  };
}

interface Funnel {
  id: string;
  name: string;
  icon: string;
  color: string;
  columns: Record<string, Column>;
}

const initialFunnels: Funnel[] = [
  {
    id: 'f1',
    name: 'Funil de Vendas Diretas',
    icon: '💰',
    color: '#EAB308',
    columns: {
      'col-1': {
        id: 'col-1',
        title: 'Novos Leads',
        metrics: { avgTime: '1.2 dias', lossRate: '5%', totalHistory: 1450 },
        leads: [
          { id: 'l1', name: 'João Silva', email: 'joao.silva@email.com', channel: 'Instagram', responsible: 'Ricardo', value: 'R$ 2.500', timeInStage: '4h' },
          { id: 'l2', name: 'Maria Santos', email: 'maria.s@gmail.com', channel: 'WhatsApp', responsible: 'Ana', value: 'R$ 1.800', timeInStage: '1d' }
        ]
      },
      'col-2': {
        id: 'col-2',
        title: 'Em Contato',
        metrics: { avgTime: '3.5 dias', lossRate: '12%', totalHistory: 890 },
        leads: [
          { id: 'l3', name: 'Carlos Oliveira', email: 'carlos.oli@outlook.com', channel: 'Google', responsible: 'Pedro', value: 'R$ 5.000', timeInStage: '3d' }
        ]
      },
      'col-3': {
        id: 'col-3',
        title: 'Negociação',
        metrics: { avgTime: '8.2 dias', lossRate: '25%', totalHistory: 420 },
        leads: [
          { id: 'l4', name: 'Fernanda Lima', email: 'fer.lima@uol.com.br', channel: 'Indicação', responsible: 'Ricardo', value: 'R$ 12.000', timeInStage: '7d' }
        ]
      },
      'col-4': {
        id: 'col-4',
        title: 'Fechamento',
        metrics: { avgTime: '2.1 dias', lossRate: '2%', totalHistory: 180 },
        leads: []
      },
    }
  },
  {
    id: 'f2',
    name: 'Funil de Diamantes',
    icon: '💎',
    color: '#3B82F6',
    columns: {
      'col-1': {
        id: 'col-1',
        title: 'Prospecção',
        metrics: { avgTime: '2.0 dias', lossRate: '8%', totalHistory: 980 },
        leads: [
          { id: 'd1', name: 'Ana Clara', email: 'ana.c@email.com', channel: 'LinkedIn', responsible: 'Pedro', value: 'R$ 45.000', timeInStage: '2d' }
        ]
      },
      'col-2': {
        id: 'col-2',
        title: 'Qualificação',
        metrics: { avgTime: '5.0 dias', lossRate: '15%', totalHistory: 650 },
        leads: []
      },
      'col-3': {
        id: 'col-3',
        title: 'Proposta',
        metrics: { avgTime: '10.0 dias', lossRate: '20%', totalHistory: 320 },
        leads: []
      },
      'col-4': {
        id: 'col-4',
        title: 'Contrato',
        metrics: { avgTime: '3.0 dias', lossRate: '5%', totalHistory: 145 },
        leads: []
      },
    }
  },
];

export default function FunnelPage() {
  const [funnels, setFunnels] = useState<Funnel[]>(initialFunnels);
  const [activeFunnelId, setActiveFunnelId] = useState('f1');
  const [showFullInsights, setShowFullInsights] = useState(false);
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeFunnel = funnels.find(f => f.id === activeFunnelId) || funnels[0];
  const [columns, setColumns] = useState<Record<string, Column>>(activeFunnel.columns);

  // Carregar funil ativo do localStorage
  useEffect(() => {
    const savedFunnelId = localStorage.getItem('active-funnel-id');
    if (savedFunnelId && funnels.find(f => f.id === savedFunnelId)) {
      setActiveFunnelId(savedFunnelId);
    }
  }, [funnels]);

  // Atualizar colunas quando mudar o funil
  useEffect(() => {
    const currentFunnel = funnels.find(f => f.id === activeFunnelId);
    if (currentFunnel) {
      setColumns(currentFunnel.columns);
      localStorage.setItem('active-funnel-id', activeFunnelId);
    }
  }, [activeFunnelId, funnels]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceLeads = [...sourceCol.leads];
    const destLeads = [...destCol.leads];
    const [removed] = sourceLeads.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceLeads.splice(destination.index, 0, removed);
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, leads: sourceLeads } });
    } else {
      destLeads.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, leads: sourceLeads },
        [destination.droppableId]: { ...destCol, leads: destLeads }
      });
    }
  };

  const handleCreateFunnel = (funnelData: any) => {
    const newFunnel: Funnel = {
      id: `f${funnels.length + 1}`,
      name: funnelData.name,
      icon: funnelData.icon,
      color: funnelData.color,
      columns: Object.fromEntries(
        funnelData.stages.map((stage: any, index: number) => [
          `col-${index + 1}`,
          {
            id: `col-${index + 1}`,
            title: stage.name,
            metrics: { avgTime: '0 dias', lossRate: '0%', totalHistory: 0 },
            leads: []
          }
        ])
      ),
    };
    setFunnels([...funnels, newFunnel]);
    setActiveFunnelId(newFunnel.id);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6 animate-in fade-in duration-500">

      {/* SIDEBAR DE FUNIS */}
      <FunnelSidebar
        funnels={funnels}
        activeFunnelId={activeFunnelId}
        onSelectFunnel={setActiveFunnelId}
        onCreateFunnel={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">

        {/* HEADER & INSIGHTS FIXAS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">{activeFunnel.name}</h1>
            <button
              onClick={() => setShowFullInsights(!showFullInsights)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-gold)] hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all"
            >
              <IconChartBar size={16} />
              Ver Insights Completa
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InsightCard label="Total no Funil" value="245" icon={<IconTarget className="text-[var(--accent-gold)]" />} />
            <InsightCard label="Ticket Médio" value="R$ 4.250" icon={<IconTrendingUp className="text-green-500" />} />
            <InsightCard label="Taxa Conversão" value="12.4%" icon={<IconChartBar className="text-blue-500" />} />
            <InsightCard label="Perda Geral" value="31%" icon={<IconAlertCircle className="text-red-500" />} />
          </div>
        </div>

        {/* PAINEL DE INSIGHTS DETALHADAS */}
        <AnimatePresence>
          {showFullInsights && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-[var(--bg-secondary)] border border-[#EAB308]/30 p-6 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-gold)]" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-widest">Análise de Performance por Etapa</h3>
                <IconX size={18} className="text-[var(--text-muted)] cursor-pointer" onClick={() => setShowFullInsights(false)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.values(columns).map(col => (
                  <div key={col.id} className="space-y-3 bg-[var(--bg-secondary)]/50 p-4 rounded-xl border border-[var(--border-primary)]">
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{col.title}</p>
                    <div className="space-y-2">
                      <MetricLine label="Tempo Médio" value={col.metrics.avgTime} />
                      <MetricLine label="Taxa de Perda" value={col.metrics.lossRate} color="text-red-500" />
                      <MetricLine label="Passagem Total" value={col.metrics.totalHistory} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KANBAN BOARD */}
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max">
              {Object.values(columns).map((column) => (
                <div key={column.id} className="w-80 flex flex-col gap-4 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-[var(--border-primary)]/50">

                  {/* Header da Coluna com Pesquisa */}
                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">{column.title}</h3>
                      <span className="text-[10px] text-[var(--accent-gold)] font-mono font-bold bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded">{column.leads.length}</span>
                    </div>
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                      <input
                        placeholder="Buscar lead..."
                        value={columnSearch[column.id] || ''}
                        onChange={(e) => setColumnSearch({ ...columnSearch, [column.id]: e.target.value })}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--text-secondary)] outline-none focus:border-[#EAB308]/50 transition-all"
                      />
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 flex flex-col gap-3 overflow-y-auto pr-1 ${snapshot.isDraggingOver ? 'bg-[var(--bg-elevated)]/5' : ''}`}>
                        {column.leads
                          .filter(l => l.name.toLowerCase().includes((columnSearch[column.id] || '').toLowerCase()))
                          .map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                  className={`p-4 bg-[var(--bg-secondary)] border rounded-xl group hover:border-[var(--accent-gold)] transition-all
                                ${snapshot.isDragging ? 'border-[#EAB308] shadow-2xl rotate-2' : 'border-[var(--border-primary)]'}`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                                      <span className="text-sm font-bold text-[var(--text-primary)]">{lead.name}</span>
                                    </div>
                                    <IconDotsVertical size={14} className="text-zinc-700" />
                                  </div>
                                  <div className="text-[10px] text-[var(--text-tertiary)] mb-4 truncate">{lead.email}</div>

                                  <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Origem: <span className="text-[var(--text-secondary)]">{lead.channel}</span></div>
                                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold text-right">Responsável: <span className="text-[var(--text-secondary)]">{lead.responsible}</span></div>
                                  </div>

                                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]/50">
                                    <span className="text-xs font-bold text-[var(--accent-gold)]">{lead.value}</span>
                                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                                      <IconClock size={12} /> {lead.timeInStage}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Modal de Criação de Funil */}
      <ModalCriarFunil
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateFunnel}
      />
    </div>
  );
}

// --- SUB-COMPONENTES ---

function InsightCard({ label, value, icon }: any) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-xl flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">{label}</span>
        <span className="text-lg font-bold text-[var(--text-primary)]">{value}</span>
      </div>
      <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">{icon}</div>
    </div>
  );
}

function MetricLine({ label, value, color = "text-zinc-300" }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-[var(--text-tertiary)]">{label}:</span>
      <span className={`text-[10px] font-bold ${color}`}>{value}</span>
    </div>
  );
}

// Modal de Criação de Funil (já importado no topo)