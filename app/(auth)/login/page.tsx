'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui no futuro você colocará a lógica do Firebase Auth
    // Por enquanto, vamos apenas redirecionar para o dashboard
    router.push('/dashboard');
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Logo e Boas-vindas */}
      <div className="flex flex-col items-center mb-10 text-center">
        {/* Ícone com o Dourado ajustado (#EAB308) */}
        <div className="w-16 h-16 bg-[#EAB308] rounded-xl mb-6 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <span className="drop-shadow-md">👑</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h2>
        <p className="text-zinc-500 text-sm italic">Acesse o painel administrativo Golden</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
            E-mail
          </label>
          <input
            type="email"
            required
            placeholder="pedro@softwarehouse.com.br"
            className="w-full h-12 px-4 rounded-lg bg-[#e8f0fe] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all font-medium"
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
              Senha de Acesso
            </label>
            <button type="button" className="text-[10px] text-zinc-500 hover:text-[#EAB308]">
              Esqueceu a senha?
            </button>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full h-12 px-4 rounded-lg bg-[#e8f0fe] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all font-medium"
          />
        </div>

        {/* Botão com o Amarelo/Dourado ajustado */}
        <button
          type="submit"
          className="w-full h-12 mt-4 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg hover:shadow-[#EAB308]/20"
        >
          Entrar no Sistema
          <span className="text-lg">→</span>
        </button>
      </form>
    </div>
  );
}