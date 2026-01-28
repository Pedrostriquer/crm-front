"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  IconSearch,
  IconPlus,
  IconFileImport,
  IconDotsVertical,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
  IconX,
  IconArrowUpRight,
  IconLoader2,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: {
    id: string;
    name: string;
  } | null;
  sourceChannel: string;
  responsible: {
    id: string;
    name: string;
  } | null;
  createdAt: any;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads", {
        params: {
          page,
          limit: 10,
          name: searchTerm,
          stageId: stageFilter,
          sourceChannel: sourceFilter,
        },
      });
      setLeads(data.data);
    } catch (error) {
      console.error("Erro ao buscar leads", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, stageFilter, sourceFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchLeads]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Leads</h1>
          <p className="text-zinc-500 text-sm">
            Visualize e gerencie as oportunidades do seu funil.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-300 rounded-lg text-sm font-medium transition-all">
            <IconFileImport size={18} />
            Importar
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-yellow-500/10 active:scale-95"
          >
            <IconPlus size={18} />
            Novo Lead
          </button>
        </div>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#09090b] border border-[#27272a] text-sm text-white focus:border-[#EAB308] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
            <select
              className="h-11 px-3 bg-[#09090b] border border-[#27272a] rounded-lg text-xs text-zinc-400 outline-none focus:border-[#EAB308]"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">Etapa: Todas</option>
              <option value="Novo">Novo</option>
              <option value="Em Contato">Em Contato</option>
              <option value="Negociação">Negociação</option>
            </select>

            <select
              className="h-11 px-3 bg-[#09090b] border border-[#27272a] rounded-lg text-xs text-zinc-400 outline-none focus:border-[#EAB308]"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">Canal: Todos</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Indicação">Indicação</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#18181b] text-zinc-500 text-[10px] uppercase tracking-widest border-b border-[#27272a]">
              <tr>
                <th className="px-6 py-4">Lead / Contato</th>
                <th className="px-6 py-4">Etapa do Funil</th>
                <th className="px-6 py-4">Canal Origem</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-zinc-500"
                  >
                    <IconLoader2 className="animate-spin inline-block mr-2" />{" "}
                    Carregando leads...
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-[#27272a]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white group-hover:text-[#EAB308] transition-colors">
                          {lead.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {lead.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700 text-zinc-400">
                        {lead.stage?.name || "Sem Etapa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {lead.sourceChannel}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] text-zinc-400 uppercase">
                          {lead.responsible?.name.charAt(0) || "?"}
                        </div>
                        <span className="text-sm text-zinc-300">
                          {lead.responsible?.name || "Sem responsável"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#27272a] rounded-lg text-zinc-500">
                        <IconDotsVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadDetailDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateLeadModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={fetchLeads}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sourceChannel: "Instagram",
    stageId: "",
    funnelId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", formData);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar lead", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#09090b] border border-[#27272a] shadow-2xl z-[90] rounded-2xl p-8 overflow-hidden text-white"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EAB308] to-transparent" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAB308]/10 flex items-center justify-center text-[#EAB308]">
              <IconPlus size={20} />
            </div>
            Novo Prospecto
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#27272a] rounded-full text-zinc-500 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Nome Completo
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#EAB308] outline-none transition-all"
              placeholder="Ex: João Silva"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#EAB308] outline-none transition-all"
                placeholder="joao@email.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Telefone
              </label>
              <input
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#EAB308] outline-none transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Origem
              </label>
              <select
                value={formData.sourceChannel}
                onChange={(e) =>
                  setFormData({ ...formData, sourceChannel: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#EAB308] outline-none transition-all appearance-none"
              >
                <option value="Instagram">Instagram</option>
                <option value="Google Ads">Google Ads</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Indicação">Indicação</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                Estágio Inicial (UUID)
              </label>
              <input
                required
                value={formData.stageId}
                onChange={(e) =>
                  setFormData({ ...formData, stageId: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#EAB308] outline-none transition-all"
                placeholder="Cole o ID da Etapa"
              />
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50 shadow-lg shadow-yellow-500/10"
          >
            {loading ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              "Salvar Oportunidade"
            )}
          </button>
        </form>
      </motion.div>
    </>
  );
}

function LeadDetailDrawer({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const formatDate = (dateValue: any) => {
    if (
      !dateValue ||
      (typeof dateValue === "object" && Object.keys(dateValue).length === 0)
    ) {
      return new Date().toLocaleDateString("pt-BR");
    }
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime())
        ? new Date().toLocaleDateString("pt-BR")
        : date.toLocaleDateString("pt-BR");
    } catch {
      return "Data não formatada";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#09090b] border-l border-[#27272a] shadow-2xl z-[70] p-8 overflow-y-auto text-white"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="p-2 rounded-lg bg-[#18181b] border border-[#27272a]">
            <IconUser className="text-[#EAB308]" size={24} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#27272a] rounded-full text-zinc-500 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">{lead.name}</h2>
            <p className="text-[#EAB308] text-sm font-medium">
              {lead.sourceChannel}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <DetailItem
              icon={<IconMail size={16} />}
              label="E-mail"
              value={lead.email}
            />
            <DetailItem
              icon={<IconPhone size={16} />}
              label="Telefone"
              value={lead.phone || "Não informado"}
            />
            <DetailItem
              icon={<IconCalendar size={16} />}
              label="Criado em"
              value={formatDate(lead.createdAt)}
            />
          </div>
          <div className="pt-6 border-t border-[#27272a] space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Informações de Venda
            </h3>
            <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 text-xs">Etapa Atual:</span>
                <span className="text-[#EAB308] text-xs font-bold uppercase">
                  {lead.stage?.name || "Não atribuída"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 text-xs">Responsável:</span>
                <span className="text-white text-xs font-medium">
                  {lead.responsible?.name || "Não atribuído"}
                </span>
              </div>
            </div>
          </div>
          <button className="w-full py-3 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-8">
            Histórico Completo <IconArrowUpRight size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
      <div className="text-zinc-500">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm text-zinc-200">{value}</span>
      </div>
    </div>
  );
}
