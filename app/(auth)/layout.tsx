import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full bg-[#121212] text-white">
      {/* ESQUERDA: Branding e Mensagem */}
      <div className="hidden lg:flex w-[55%] flex-col justify-center px-20 bg-[#0f0f0f] border-r border-zinc-800/50">
        <div className="max-w-md">
          {/* Badge de Segurança */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 text-xs font-medium text-amber-500 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Sistema de Gestão Avançada
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Controle total da sua <span className="text-amber-500">Operação.</span>
          </h1>

          <ul className="space-y-4 text-zinc-400">
            <li className="flex items-center gap-3">
              <div className="text-amber-500">⚡</div>
              Performance otimizada em tempo real
            </li>
            <li className="flex items-center gap-3">
              <div className="text-amber-500">🛡️</div>
              Infraestrutura de dados segura
            </li>
          </ul>
        </div>
      </div>

      {/* DIREITA: Conteúdo Dinâmico (Login) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#151515]">
        <div className="w-full max-w-[400px]">
          {children}
          
          <p className="mt-12 text-center text-xs text-zinc-600">
            © 2026 CRM System. Infraestrutura Segura.
          </p>
        </div>
      </div>
    </main>
  );
}