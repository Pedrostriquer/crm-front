'use client';

import React, { useState } from 'react';
import { 
  IconSearch, IconFilter, IconPlus, IconFileImport, 
  IconDotsVertical, IconMail, IconPhone, IconCalendar,
  IconUser, IconChevronRight, IconX, IconArrowUpRight
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipagens ---
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: 'Novo' | 'Em Contato' | 'Negociação' | 'Perdido' | 'Desqualificado';
  channel: string;
  responsible: string;
  funnel: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock de dados
  const leads: Lead[] = [
    { id: '1', name: 'Pedro Guedes', email: 'pedro@dev.com', phone: '(46) 99999-9999', stage: 'Negociação', channel: 'Instagram Ads', responsible: 'Ricardo Silva', funnel: 'Vendas Premium', createdAt: '2026-01-10' },
    { id: '2', name: 'Ana Oliveira', email: 'ana@empresa.com', phone: '(11) 98888-8888', stage: 'Novo', channel: 'Google Search', responsible: 'Ana Oliveira', funnel: 'Vendas Diretas', createdAt: '2026-01-09' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-h-screen">
      {/* HEADER & AÇÕES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Leads</h1>
          <p className="text-zinc-500 text-sm">Visualize e gerencie as oportunidades do seu funil.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-all">
            <IconFileImport size={18} />
            Importar Planilha
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-yellow-500/10">
            <IconPlus size={18} />
            Criar Lead Manual
          </button>
        </div>
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="bg-[#121212] border border-zinc-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="Pesquisar por nome, e-mail ou telefone..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-sm text-white focus:border-[#EAB308] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Selects de Filtro */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <FilterSelect label="Etapa" options={['Novo', 'Contato', 'Negociação', 'Perdido']} />
            <FilterSelect label="Canal" options={['Instagram', 'Google', 'Indicação']} />
            <FilterSelect label="Responsável" options={['Ricardo', 'Ana', 'Pedro']} />
            <FilterSelect label="Funnel" options={['Premium', 'Padrão']} />
          </div>
        </div>

        {/* Filtro de Data */}
        <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/50">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Período:</span>
          <div className="flex items-center gap-2">
            <input type="date" className="bg-[#0a0a0a] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none" />
            <span className="text-zinc-700">até</span>
            <input type="date" className="bg-[#0a0a0a] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none" />
          </div>
        </div>
      </div>

      {/* TABELA DE LEADS */}
      <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Lead / Contato</th>
                <th className="px-6 py-4">Etapa do Funil</th>
                <th className="px-6 py-4">Canal Origem</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white group-hover:text-[#EAB308] transition-colors">{lead.name}</span>
                      <span className="text-xs text-zinc-500">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border
                      ${lead.stage === 'Negociação' ? 'border-[#EAB308]/40 bg-[#EAB308]/5 text-[#EAB308]' : 'border-zinc-700 text-zinc-400'}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{lead.channel}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                        {lead.responsible.charAt(0)}
                      </div>
                      <span className="text-sm text-zinc-300">{lead.responsible}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
                      <IconDotsVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER DE DETALHES (GAVETA LATERAL) */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailDrawer 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTES ---

function FilterSelect({ label, options }: { label: string, options: string[] }) {
  return (
    <select className="h-11 px-3 bg-[#0a0a0a] border border-zinc-800 rounded-lg text-xs text-zinc-400 outline-none focus:border-[#EAB308] cursor-pointer">
      <option value="">{label}: Todos</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

function LeadDetailDrawer({ lead, onClose }: { lead: Lead, onClose: () => void }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0f0f0f] border-l border-zinc-800 shadow-2xl z-[70] p-8 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <IconUser className="text-[#EAB308]" size={24} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{lead.name}</h2>
            <p className="text-[#EAB308] text-sm font-medium">{lead.funnel}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <DetailItem icon={<IconMail size={16}/>} label="E-mail" value={lead.email} />
            <DetailItem icon={<IconPhone size={16}/>} label="Telefone" value={lead.phone} />
            <DetailItem icon={<IconCalendar size={16}/>} label="Criado em" value={lead.createdAt} />
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Informações de Venda</h3>
            <div className="bg-[#151515] p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 text-xs">Etapa Atual:</span>
                <span className="text-[#EAB308] text-xs font-bold uppercase tracking-tighter">{lead.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 text-xs">Responsável:</span>
                <span className="text-white text-xs font-medium">{lead.responsible}</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-8">
            Abrir CRM Completo
            <IconArrowUpRight size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/30">
      <div className="text-zinc-500">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{label}</span>
        <span className="text-sm text-zinc-200">{value}</span>
      </div>
    </div>
  );
}