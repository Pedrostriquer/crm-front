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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gestão de Leads</h1>
          <p className="text-[var(--text-tertiary)] text-sm">Visualize e gerencie as oportunidades do seu funil.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-zinc-300 rounded-lg text-sm font-medium transition-all">
            <IconFileImport size={18} />
            Importar Planilha
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-gold)] hover:bg-[#CA8A04] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-yellow-500/10">
            <IconPlus size={18} />
            Criar Lead Manual
          </button>
        </div>
      </div>

      {/* FILTROS E PESQUISA */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
            <input 
              type="text"
              placeholder="Pesquisar por nome, e-mail ou telefone..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] focus:border-[#EAB308] outline-none transition-all"
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
        <div className="flex items-center gap-4 pt-2 border-t border-[var(--border-primary)]/50">
          <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Período:</span>
          <div className="flex items-center gap-2">
            <input type="date" className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded px-2 py-1 text-xs text-zinc-300 outline-none" />
            <span className="text-zinc-700">até</span>
            <input type="date" className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded px-2 py-1 text-xs text-zinc-300 outline-none" />
          </div>
        </div>
      </div>

      {/* TABELA DE LEADS */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-secondary)]/50 text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest border-b border-[var(--border-primary)]">
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
                  className="hover:bg-[var(--bg-tertiary)]/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">{lead.name}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border
                      ${lead.stage === 'Negociação' ? 'border-[#EAB308]/40 bg-[var(--accent-gold)]/5 text-[var(--accent-gold)]' : 'border-[var(--border-secondary)] text-[var(--text-secondary)]'}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{lead.channel}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] text-[var(--text-secondary)]">
                        {lead.responsible.charAt(0)}
                      </div>
                      <span className="text-sm text-zinc-300">{lead.responsible}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)]">
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
    <select className="h-11 px-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-xs text-[var(--text-secondary)] outline-none focus:border-[#EAB308] cursor-pointer">
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
        className="fixed inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-sm z-[60]"
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-[var(--bg-elevated)] border-l border-[var(--border-primary)] shadow-2xl z-[70] p-8 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
            <IconUser className="text-[var(--accent-gold)]" size={24} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-tertiary)] transition-colors">
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{lead.name}</h2>
            <p className="text-[var(--accent-gold)] text-sm font-medium">{lead.funnel}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <DetailItem icon={<IconMail size={16}/>} label="E-mail" value={lead.email} />
            <DetailItem icon={<IconPhone size={16}/>} label="Telefone" value={lead.phone} />
            <DetailItem icon={<IconCalendar size={16}/>} label="Criado em" value={lead.createdAt} />
          </div>

          <div className="pt-6 border-t border-[var(--border-primary)] space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Informações de Venda</h3>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-primary)] space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)] text-xs">Etapa Atual:</span>
                <span className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-tighter">{lead.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)] text-xs">Responsável:</span>
                <span className="text-[var(--text-primary)] text-xs font-medium">{lead.responsible}</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-[var(--accent-gold)] hover:bg-[#CA8A04] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-8">
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
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border-primary)]/30">
      <div className="text-[var(--text-tertiary)]">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{label}</span>
        <span className="text-sm text-zinc-200">{value}</span>
      </div>
    </div>
  );
}