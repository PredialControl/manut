export const pageRoutes = [
  {
    title: "Menu Principal",
    subtitle: "Selecione uma opção para começar",
    href: "/",
    icon: "Home",
  },
  {
    title: "Gestão de Contratos",
    subtitle: "Gerencie todos os seus contratos em um só lugar",
    href: "/gestao-contratos",
    icon: "Building2",
  },
  {
    title: "Árvore de Ativos",
    subtitle: "Visualização hierárquica da estrutura de ativos",
    href: "/assets",
    icon: "Archive",
  },
  {
    title: "Lista de Ativos",
    subtitle: "Lista das áreas e equipamentos da edificação",
    href: "/assets-list",
    icon: "List",
  },
  {
    title: "Corretivas",
    subtitle: "Gestão de manutenções corretivas e chamados",
    href: "/corrective",
    icon: "Wrench",
  },
  {
    title: "Preventivas",
    subtitle: "Planejamento e execução de manutenções preventivas",
    href: "/preventive",
    icon: "ShieldCheck",
  },
  {
    title: "Plano de Manutenção",
    subtitle: "Templates e planos de manutenção padronizados",
    href: "/maintenance-plans",
    icon: "ClipboardList",
  },
  {
    title: "Laudos",
    subtitle: "Documentos e relatórios técnicos",
    href: "/reports",
    icon: "FileText",
  },
  {
    title: "Rotas de inspeção",
    subtitle: "Roteiros de inspeção e vistoria",
    href: "/inspection-routes",
    icon: "Route",
  },
  {
    title: "Cronograma",
    subtitle: "Calendário de atividades e manutenções",
    href: "/schedule",
    icon: "Calendar",
  },
  {
    title: "Itens Construtora",
    subtitle: "Pendências e chamados da construtora",
    href: "/construction-items",
    icon: "HardHat",
  },
  {
    title: "Lixeira",
    subtitle: "Contratos e itens removidos",
    href: "/trash",
    icon: "Trash",
  },
];

export function getPageTitle(pathname: string): string {
  const route = pageRoutes.find((r) => r.href === pathname);
  return route ? route.title : "Manut";
}

export function getPageSubtitle(pathname: string): string {
  const route = pageRoutes.find((r) => r.href === pathname);
  return route ? route.subtitle : "";
}
