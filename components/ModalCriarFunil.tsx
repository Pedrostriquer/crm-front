"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  IconX,
  IconGripVertical,
  IconCheck,
  IconPlus,
  IconLoader2,
} from "@tabler/icons-react";
import { motion, Reorder } from "framer-motion";
import api from "@/lib/api";

interface Stage {
  id: string;
  name: string;
}

interface FunnelData {
  name: string;
  description: string;
  icon: string;
  color: string;
  stages: Stage[];
}

interface ModalCriarFunilProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (funnel: any) => void;
}

const iconOptions = ["💰", "💎", "🤝", "🎯", "⚡", "🚀", "🏆", "📈"];
const colorOptions = [
  "#EAB308",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export function ModalCriarFunil({
  isOpen,
  onClose,
  onSave,
}: ModalCriarFunilProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FunnelData>({
    name: "",
    description: "",
    icon: "💰",
    color: "#EAB308",
    stages: [
      { id: "1", name: "Prospecção" },
      { id: "2", name: "Qualificação" },
      { id: "3", name: "Proposta" },
      { id: "4", name: "Negociação" },
      { id: "5", name: "Fechamento" },
    ],
  });

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: "",
      description: "",
      icon: "💰",
      color: "#EAB308",
      stages: [
        { id: "1", name: "Prospecção" },
        { id: "2", name: "Qualificação" },
        { id: "3", name: "Proposta" },
        { id: "4", name: "Negociação" },
        { id: "5", name: "Fechamento" },
      ],
    });
    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        stages: formData.stages.map((s) => ({ name: s.name })),
      };
      const { data } = await api.post("/funnels", payload);
      onSave(data);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar funil", error);
    } finally {
      setLoading(false);
    }
  };

  const addStage = () => {
    const newStage: Stage = {
      id: String(Date.now()),
      name: `Etapa ${formData.stages.length + 1}`,
    };
    setFormData({ ...formData, stages: [...formData.stages, newStage] });
  };

  const removeStage = (id: string) => {
    setFormData({
      ...formData,
      stages: formData.stages.filter((s) => s.id !== id),
    });
  };

  const updateStageName = (id: string, name: string) => {
    setFormData({
      ...formData,
      stages: formData.stages.map((s) => (s.id === id ? { ...s, name } : s)),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      showCloseButton={false}
    >
      <div className="space-y-6 text-white">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold">Criar Novo Funil</h2>
            <p className="text-sm text-zinc-500 mt-1">Passo {step} de 3</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-[#EAB308]" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Nome do Funil
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Vendas Diretas"
                  className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#EAB308] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Opcional..."
                  rows={4}
                  className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#EAB308] outline-none resize-none"
                />
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Reorder.Group
                axis="y"
                values={formData.stages}
                onReorder={(stages) => setFormData({ ...formData, stages })}
                className="space-y-3"
              >
                {formData.stages.map((stage, index) => (
                  <Reorder.Item key={stage.id} value={stage}>
                    <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-[#EAB308] cursor-move">
                      <IconGripVertical size={18} className="text-zinc-600" />
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) =>
                          updateStageName(stage.id, e.target.value)
                        }
                        className="flex-1 bg-transparent border-none outline-none text-white font-medium"
                      />
                      {formData.stages.length > 2 && (
                        <button
                          onClick={() => removeStage(stage.id)}
                          className="p-1.5 text-red-500"
                        >
                          <IconX size={16} />
                        </button>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <button
                onClick={addStage}
                className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-[#EAB308] hover:border-[#EAB308] flex items-center justify-center gap-2 transition-all"
              >
                <IconPlus size={18} /> Adicionar Etapa
              </button>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Ícone e Cor
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((ico) => (
                    <button
                      key={ico}
                      onClick={() => setFormData({ ...formData, icon: ico })}
                      className={`aspect-square rounded-lg text-xl flex items-center justify-center ${
                        formData.icon === ico
                          ? "bg-[#EAB308] text-black"
                          : "bg-zinc-900"
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map((col) => (
                    <button
                      key={col}
                      onClick={() => setFormData({ ...formData, color: col })}
                      className={`aspect-square rounded-lg ${
                        formData.color === col
                          ? "ring-2 ring-white scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t border-zinc-800">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-30"
          >
            Voltar
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.name}
              className="px-6 py-2 bg-[#EAB308] text-black font-bold rounded-lg transition-all active:scale-95"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-[#EAB308] text-black font-bold rounded-lg flex items-center gap-2 transition-all active:scale-95"
            >
              {loading ? (
                <IconLoader2 className="animate-spin" />
              ) : (
                <>
                  <IconCheck size={18} /> Criar Funil
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
