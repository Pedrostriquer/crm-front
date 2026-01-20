"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserCheck,
  IconChecklist,
  IconLogout,
  IconTarget,
  IconLayoutColumns,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Lista de navegação completa do CRM Golden
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    {
      label: "Leads",
      href: "/leads",
      icon: <IconTarget className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    {
      label: "Funis de Venda",
      href: "/funis",
      icon: <IconLayoutColumns className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    {
      label: "Tarefas",
      href: "/tarefas",
      icon: <IconChecklist className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    {
      label: "Usuários",
      href: "/usuarios",
      icon: <IconUserCheck className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    {
      label: "Equipes",
      href: "/equipes",
      icon: <IconUsers className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    },
    // {
    //   label: "Configurações",
    //   href: "/settings",
    //   icon: <IconSettings className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] h-5 w-5 shrink-0 transition-colors" />,
    // },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-[var(--bg-primary)] w-full flex-1 mx-auto overflow-hidden h-screen font-sans">
      {/* SIDEBAR:
          - animate={true} para suavidade.
          - whitespace-nowrap nos links para evitar quebras de linha durante a expansão.
      */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)]">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="group hover:bg-[var(--bg-hover)] rounded-lg p-2 transition-all whitespace-nowrap"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border-primary)] pt-4">
            <SidebarLink
              link={{
                label: "Pedro Guedes",
                href: "/perfil",
                icon: (
                  <div className="h-7 w-7 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[10px] text-black font-bold shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                    PG
                  </div>
                ),
              }}
              className="whitespace-nowrap"
            />
            <SidebarLink
              link={{
                label: "Sair",
                href: "/login",
                icon: <IconLogout className="text-[var(--text-muted)] h-5 w-5 shrink-0 group-hover:text-[var(--error)] transition-colors" />,
              }}
              className="whitespace-nowrap mt-2 group"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* CONTEÚDO PRINCIPAL:
          - overflow-y-auto para permitir scroll apenas na área de conteúdo.
          - flex-1 para ocupar o espaço dinamicamente conforme a sidebar abre/fecha.
      */}
      <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)] scroll-smooth">
        <div className="p-4 md:p-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

// Componentes da Logo (Dourado Golden)
const Logo = () => (
  <Link href="/dashboard" className="flex items-center space-x-2 py-1 text-sm font-normal text-[var(--text-primary)] group">
    <div className="h-5 w-6 rounded-br-lg bg-[var(--accent-gold)] shrink-0 shadow-lg shadow-yellow-500/20" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-bold text-lg tracking-tight whitespace-nowrap"
    >
      GOLDEN <span className="text-[var(--accent-gold)]">CRM</span>
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link href="/dashboard" className="flex items-center py-1">
    <div className="h-5 w-6 rounded-br-lg bg-[var(--accent-gold)] shrink-0" />
  </Link>
);