"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

interface MenuOption {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  available: boolean;
}

const menuOptions: MenuOption[] = [
  {
    title: "Gestão de Contratos",
    description: "Gerencie contratos, rondas de inspeção, laudos, pareceres técnicos, relatórios de pendências e acompanhamento de visitas.",
    href: "/ronda",
    icon: <ClipboardCheck className="h-10 w-10" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10 group-hover:bg-blue-500/20",
    borderColor: "border-blue-500/20 group-hover:border-blue-500/40",
    available: true,
  },
  {
    title: "Gestão de Manutenção",
    description: "Gerencie manutenções preventivas, corretivas, chamados, ativos e planos de manutenção dos seus contratos.",
    href: "/gestao-contratos",
    icon: <Building2 className="h-10 w-10" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    borderColor: "border-emerald-500/20 group-hover:border-emerald-500/40",
    available: true,
  },
];

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 pt-8 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Bem-vindo ao <span className="text-primary">Manut</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Sistema de Manutenção Predial. Selecione uma opção para começar.
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {menuOptions.map((option, index) => (
          <div
            key={option.title}
            className="animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
          >
            {option.available ? (
              <Link href={option.href}>
                <Card className={`group relative flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden border-2 ${option.borderColor} bg-card p-0 gap-0 h-full`}>
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-2xl ${option.bgColor} flex items-center justify-center mb-5 transition-all duration-500`}>
                      <span className={option.color}>{option.icon}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                      {option.description}
                    </p>
                    <div className="flex items-center gap-2 mt-5 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Acessar</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className={`relative flex flex-col overflow-hidden border-2 border-border/30 bg-card/50 p-0 gap-0 h-full opacity-50 cursor-not-allowed`}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-5`}>
                    <span className="text-muted-foreground/50">{option.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                    {option.title}
                  </h2>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed flex-grow">
                    {option.description}
                  </p>
                  <div className="mt-5">
                    <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-full">
                      Em breve
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
