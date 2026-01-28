"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao conectar com o servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-[#EAB308] rounded-xl mb-6 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <span className="drop-shadow-md">👑</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Bem-vindo de volta
        </h2>
        <p className="text-zinc-500 text-sm italic">
          Acesse o painel administrativo Golden
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            className="w-full h-12 px-4 rounded-lg bg-[#e8f0fe] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all font-medium"
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
              Senha de Acesso
            </label>
            <button
              type="button"
              className="text-[10px] text-zinc-500 hover:text-[#EAB308]"
            >
              Esqueceu a senha?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-12 px-4 rounded-lg bg-[#e8f0fe] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-4 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg hover:shadow-[#EAB308]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Carregando..." : "Entrar no Sistema"}
          {!loading && <span className="text-lg">→</span>}
        </button>
      </form>
    </div>
  );
}
