"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  IconPlus,
  IconSearch,
  IconChartBar,
  IconDotsVertical,
  IconAlertCircle,
  IconTarget,
  IconTrendingUp,
  IconUser,
  IconLoader2,
  IconLayoutColumns,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { FunnelSidebar } from "@/components/FunnelSidebar";
import { ModalCriarFunil } from "@/components/ModalCriarFunil";
import api from "@/lib/api";

function EditableStageName({
  stage,
  onSave,
}: {
  stage: any;
  onSave: (newName: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(stage.name);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (tempName.trim() === "" || tempName === stage.name) {
      setIsEditing(false);
      setTempName(stage.name);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(tempName);
      setIsEditing(false);
    } catch (error) {
      setTempName(stage.name);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in duration-200">
        <input
          ref={inputRef}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setTempName(stage.name);
            }
          }}
          className="flex-1 bg-[#09090b] border border-[#EAB308] rounded px-2 py-1 text-xs font-bold uppercase tracking-widest outline-none text-white shadow-[0_0_10px_rgba(234,179,8,0.1)]"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 hover:bg-green-500/20 text-green-500 rounded transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <IconLoader2 size={14} className="animate-spin" />
            ) : (
              <IconCheck size={14} />
            )}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setTempName(stage.name);
            }}
            className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
          >
            <IconX size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <h3
      onClick={() => setIsEditing(true)}
      className="text-xs font-bold uppercase tracking-widest text-zinc-400 cursor-pointer hover:text-[#EAB308] transition-all hover:translate-x-1"
    >
      {stage.name}
    </h3>
  );
}

export default function FunnelPage() {
  const [funnels, setFunnels] = useState<any[]>([]);
  const [activeFunnel, setActiveFunnel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFullInsights, setShowFullInsights] = useState(false);
  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});

  const fetchFunnelDetails = async (id: string) => {
    try {
      const { data } = await api.get(`/funnels/${id}`);
      setActiveFunnel(data);
      localStorage.setItem("active-funnel-id", id);
    } catch (error) {
      console.error("Erro ao carregar detalhes do funil", error);
    }
  };

  const loadFunnels = useCallback(async () => {
    try {
      const { data } = await api.get("/funnels");
      setFunnels(data);
      if (data.length > 0) {
        const savedId = localStorage.getItem("active-funnel-id");
        const funnelToLoad = data.find((f: any) => f.id === savedId) || data[0];
        fetchFunnelDetails(funnelToLoad.id);
      }
    } catch (error) {
      console.error("Erro ao carregar funis", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFunnels();
  }, [loadFunnels]);

  const handleUpdateStageName = async (stageId: string, newName: string) => {
    try {
      await api.patch(`/funnels/stages/${stageId}`, { name: newName });
      setActiveFunnel((prev: any) => ({
        ...prev,
        stages: prev.stages.map((s: any) =>
          s.id === stageId ? { ...s, name: newName } : s
        ),
      }));
    } catch (error) {
      console.error("Erro ao atualizar nome da etapa", error);
      throw error;
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const newActiveFunnel = JSON.parse(JSON.stringify(activeFunnel));
    const sourceStage = newActiveFunnel.stages.find(
      (s: any) => s.id === source.droppableId
    );
    const destStage = newActiveFunnel.stages.find(
      (s: any) => s.id === destination.droppableId
    );

    const [movedLead] = sourceStage.leads.splice(source.index, 1);
    destStage.leads.splice(destination.index, 0, movedLead);

    setActiveFunnel(newActiveFunnel);

    try {
      await api.patch(`/funnels/leads/${draggableId}/stage`, {
        stageId: destination.droppableId,
      });
    } catch (error) {
      console.error("Erro ao atualizar estágio do lead", error);
      fetchFunnelDetails(activeFunnel.id);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        <IconLoader2 className="animate-spin mr-2" />
        <span>Carregando ecossistema de vendas...</span>
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6 animate-in fade-in duration-500 text-white">
      <FunnelSidebar
        funnels={funnels}
        activeFunnelId={activeFunnel?.id}
        onSelectFunnel={fetchFunnelDetails}
        onCreateFunnel={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {activeFunnel ? (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-2">
                    <span className="text-2xl">{activeFunnel.icon}</span>
                    {activeFunnel.name}
                  </h1>
                </div>
                <button
                  onClick={() => setShowFullInsights(!showFullInsights)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-[#EAB308] hover:text-black rounded-lg text-[10px] font-bold uppercase transition-all"
                >
                  <IconChartBar size={16} /> Insights
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InsightCard
                  label="Leads Ativos"
                  value={activeFunnel.stages.reduce(
                    (acc: any, s: any) => acc + (s.leads?.length || 0),
                    0
                  )}
                  icon={<IconTarget className="text-[#EAB308]" />}
                />
                <InsightCard
                  label="Ticket Médio"
                  value="R$ 0,00"
                  icon={<IconTrendingUp className="text-green-500" />}
                />
                <InsightCard
                  label="Taxa de Conversão"
                  value="0%"
                  icon={<IconChartBar className="text-blue-500" />}
                />
                <InsightCard
                  label="Perdas"
                  value="0"
                  icon={<IconAlertCircle className="text-red-500" />}
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full min-w-max">
                  {activeFunnel.stages.map((stage: any) => (
                    <div
                      key={stage.id}
                      className="w-80 flex flex-col gap-4 bg-[#18181b] p-3 rounded-2xl border border-zinc-800/50"
                    >
                      <div className="space-y-3 px-2">
                        <div className="flex items-center justify-between gap-4 h-8">
                          <EditableStageName
                            stage={stage}
                            onSave={(newName) =>
                              handleUpdateStageName(stage.id, newName)
                            }
                          />
                          <span className="text-[10px] text-[#EAB308] font-bold bg-[#EAB308]/10 px-2 py-0.5 rounded">
                            {stage.leads?.length || 0}
                          </span>
                        </div>
                        <div className="relative">
                          <IconSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                            size={14}
                          />
                          <input
                            placeholder="Filtrar nesta etapa..."
                            value={columnSearch[stage.id] || ""}
                            onChange={(e) =>
                              setColumnSearch({
                                ...columnSearch,
                                [stage.id]: e.target.value,
                              })
                            }
                            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#EAB308]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex-1 flex flex-col gap-3 overflow-y-auto pr-1 transition-colors rounded-xl ${
                              snapshot.isDraggingOver ? "bg-zinc-800/20" : ""
                            }`}
                          >
                            {(stage.leads || [])
                              .filter((l: any) =>
                                l.name
                                  .toLowerCase()
                                  .includes(
                                    (columnSearch[stage.id] || "").toLowerCase()
                                  )
                              )
                              .map((lead: any, index: number) => (
                                <Draggable
                                  key={lead.id}
                                  draggableId={lead.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-4 bg-[#18181b] border rounded-xl group hover:border-[#EAB308] transition-all shadow-sm ${
                                        snapshot.isDragging
                                          ? "border-[#EAB308] shadow-2xl rotate-2 z-50 bg-[#27272a]"
                                          : "border-zinc-800"
                                      }`}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                              backgroundColor:
                                                activeFunnel.color,
                                            }}
                                          />
                                          <span className="text-sm font-bold text-zinc-100 truncate max-w-[180px]">
                                            {lead.name}
                                          </span>
                                        </div>
                                        <IconDotsVertical
                                          size={14}
                                          className="text-zinc-600 hover:text-white cursor-pointer"
                                        />
                                      </div>
                                      <div className="text-[10px] text-zinc-500 mb-4 truncate">
                                        {lead.email}
                                      </div>
                                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                                        <span className="text-[10px] font-bold text-[#EAB308] uppercase tracking-tighter">
                                          {lead.sourceChannel || "Orgânico"}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-md">
                                          <IconUser size={10} />
                                          {lead.responsible?.name.split(
                                            " "
                                          )[0] || "Livre"}
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-4">
            <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800">
              <IconLayoutColumns size={48} className="opacity-20" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-zinc-400">
                Nenhum Funil Ativo
              </p>
              <p className="text-sm">
                Selecione um funil na barra lateral ou crie um novo processo.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 px-6 py-2 bg-[#EAB308] text-black font-bold rounded-lg hover:bg-[#CA8A04] transition-colors"
            >
              Criar Primeiro Funil
            </button>
          </div>
        )}
      </div>

      <ModalCriarFunil
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(newFunnel) => {
          setFunnels((prev) => [...prev, newFunnel]);
          fetchFunnelDetails(newFunnel.id);
        }}
      />
    </div>
  );
}

function InsightCard({ label, value, icon }: any) {
  return (
    <div className="bg-[#18181b] border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
      <div className="flex flex-col">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
          {label}
        </span>
        <span className="text-lg font-bold text-zinc-100">{value}</span>
      </div>
      <div className="p-2 bg-zinc-900 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  );
}
