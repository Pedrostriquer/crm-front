'use client';

import React, { useState } from 'react';
import { 
  IconPlus, IconSearch, IconLayoutColumns, IconChartBar, 
  IconClock, IconDotsVertical, IconFilter,
  IconAlertCircle, IconTarget, IconTrendingUp, IconX,
  IconArrowRightBar, IconUser
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from "framer-motion";

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

export default function FunnelPage() {
  const [selectedFunnel, setSelectedFunnel] = useState('1');
  const [showFullInsights, setShowFullInsights] = useState(false);
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  // Mock de Dados com Pessoas Físicas
  const [columns, setColumns] = useState<Record<string, Column>>({
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
  });

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

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6 animate-in fade-in duration-500">
      
      {/* SIDEBAR DE FUNIS */}
      <aside className="w-16 md:w-20 bg-[#121212] border border-zinc-800 rounded-2xl flex flex-col items-center py-6 gap-6 shrink-0">
        {['💰', '💎', '🤝'].map((icon, i) => (
          <button key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${i === 0 ? 'bg-[#EAB308]' : 'bg-zinc-900 text-zinc-500'}`}>
            {icon}
          </button>
        ))}
        <button className="w-12 h-12 rounded-xl border border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-[#EAB308]">
          <IconPlus size={20} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* HEADER & INSIGHTS FIXAS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Funil de Vendas Diretas</h1>
            <button 
              onClick={() => setShowFullInsights(!showFullInsights)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-[#EAB308] hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all"
            >
              <IconChartBar size={16} />
              Ver Insights Completa
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InsightCard label="Total no Funil" value="245" icon={<IconTarget className="text-[#EAB308]" />} />
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
              className="bg-[#151515] border border-[#EAB308]/30 p-6 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#EAB308]" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#EAB308] uppercase tracking-widest">Análise de Performance por Etapa</h3>
                <IconX size={18} className="text-zinc-600 cursor-pointer" onClick={() => setShowFullInsights(false)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.values(columns).map(col => (
                  <div key={col.id} className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">{col.title}</p>
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
                <div key={column.id} className="w-80 flex flex-col gap-4 bg-[#121212] p-3 rounded-2xl border border-zinc-800/50">
                  
                  {/* Header da Coluna com Pesquisa */}
                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest">{column.title}</h3>
                      <span className="text-[10px] text-[#EAB308] font-mono font-bold bg-[#EAB308]/10 px-2 py-0.5 rounded">{column.leads.length}</span>
                    </div>
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        placeholder="Buscar lead..." 
                        value={columnSearch[column.id] || ''}
                        onChange={(e) => setColumnSearch({...columnSearch, [column.id]: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-400 outline-none focus:border-[#EAB308]/50 transition-all"
                      />
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 flex flex-col gap-3 overflow-y-auto pr-1 ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}>
                        {column.leads
                          .filter(l => l.name.toLowerCase().includes((columnSearch[column.id] || '').toLowerCase()))
                          .map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                className={`p-4 bg-[#1a1a1c] border rounded-xl group hover:border-[#EAB308] transition-all
                                ${snapshot.isDragging ? 'border-[#EAB308] shadow-2xl rotate-2' : 'border-zinc-800'}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                                    <span className="text-sm font-bold text-white">{lead.name}</span>
                                  </div>
                                  <IconDotsVertical size={14} className="text-zinc-700" />
                                </div>
                                <div className="text-[10px] text-zinc-500 mb-4 truncate">{lead.email}</div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                  <div className="text-[9px] text-zinc-600 uppercase font-bold">Origem: <span className="text-zinc-400">{lead.channel}</span></div>
                                  <div className="text-[9px] text-zinc-600 uppercase font-bold text-right">Responsável: <span className="text-zinc-400">{lead.responsible}</span></div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                                  <span className="text-xs font-bold text-[#EAB308]">{lead.value}</span>
                                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
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
    </div>
  );
}

// --- SUB-COMPONENTES ---

function InsightCard({ label, value, icon }: any) {
  return (
    <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <div className="p-2 bg-zinc-900 rounded-lg">{icon}</div>
    </div>
  );
}

function MetricLine({ label, value, color = "text-zinc-300" }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-zinc-500">{label}:</span>
      <span className={`text-[10px] font-bold ${color}`}>{value}</span>
    </div>
  );
}