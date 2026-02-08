"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Archive,
  List,
  Wrench,
  ShieldCheck,
  ClipboardList,
  FileText,
  Route,
  Calendar,
  HardHat,
  Trash,
  Database,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavProps {
  isCollapsed: boolean;
}

interface Route {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainRoutes: Route[] = [
  {
    title: "Portal de Contratos",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Árvore de Ativos",
    href: "/assets",
    icon: <Archive className="h-5 w-5" />,
  },
  {
    title: "Lista de Ativos",
    href: "/assets-list",
    icon: <List className="h-5 w-5" />,
  },
  {
    title: "Corretivas",
    href: "/corrective",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: "Preventivas",
    href: "/preventive",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Plano de Manutenção",
    href: "/maintenance-plans",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Laudos",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Rotas de inspeção",
    href: "/inspection-routes",
    icon: <Route className="h-5 w-5" />,
  },
  {
    title: "Cronograma",
    href: "/schedule",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Itens Construtora",
    href: "/construction-items",
    icon: <HardHat className="h-5 w-5" />,
  },
  {
    title: "Chamados",
    href: "/tickets",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Lixeira",
    href: "/trash",
    icon: <Trash className="h-5 w-5" />,
  },
];

const contractRoutes: Route[] = [
  {
    title: "Árvore de Ativos",
    href: "/assets",
    icon: <Archive className="h-5 w-5" />,
  },
  {
    title: "Lista de Ativos",
    href: "/assets-list",
    icon: <List className="h-5 w-5" />,
  },
  {
    title: "Corretivas",
    href: "/corrective",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: "Preventivas",
    href: "/preventive",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Plano de Manutenção",
    href: "/maintenance-plans",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Laudos",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Rotas de inspeção",
    href: "/inspection-routes",
    icon: <Route className="h-5 w-5" />,
  },
  {
    title: "Cronograma",
    href: "/schedule",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Itens Construtora",
    href: "/construction-items",
    icon: <HardHat className="h-5 w-5" />,
  },
];

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const contractId = searchParams.get('contractId');
  const [isDark, setIsDark] = useState(true);
  const { data: session } = useSession();

  const routes = contractId ? [...contractRoutes] : [...mainRoutes];
  const userRole = (session?.user as any)?.role;

  // Adicionar rota de Admin se for administrador (sempre, mesmo dentro de contrato)
  if (userRole === "ADMIN") {
    const hasAdminRoute = routes.some(r => r.href === "/admin/users");
    if (!hasAdminRoute) {
      routes.push({
        title: "Gerenciar Usuários",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
      });
    }
  }

  // Adicionar "Usuários do Contrato" para GESTOR quando dentro de um contrato
  if (contractId && (userRole === "GESTOR" || userRole === "ADMIN")) {
    const hasContractUsersRoute = routes.some(r => r.href === "/contract-users");
    if (!hasContractUsersRoute) {
      routes.push({
        title: "Usuários do Contrato",
        href: "/contract-users",
        icon: <Users className="h-5 w-5" />,
      });
    }
  }

  // URLs que não devem receber contractId na query string
  const adminRoutes = ["/admin/users", "/profile"];
  
  const getRouteUrl = (href: string) => {
    if (adminRoutes.includes(href)) {
      return href;
    }
    if (!contractId) {
      return href;
    }
    return href + `?contractId=${contractId}`;
  };

  const handleRouteClick = (href: string) => {
    // Forçar navegação limpa para rotas admin usando window.location
    if (adminRoutes.includes(href)) {
      window.location.href = href;
      return;
    }
    // Para outras rotas, usar router normal
    if (contractId && !adminRoutes.includes(href)) {
      router.push(href + `?contractId=${contractId}`);
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    // Detectar tema inicial
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Observar mudanças no tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <TooltipProvider>
      <nav className="flex flex-col h-full w-full bg-transparent">
        {/* Logo Section */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-border">
          <Link href="/" className="flex items-center">
            {isCollapsed ? (
              <Image
                src={isDark ? "/logo-dark.png.png" : "/logo.png.png"}
                alt="Manut"
                width={50}
                height={50}
                className="transition-all"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <Image
                src={isDark ? "/logo-dark.png.png" : "/logo.png.png"}
                alt="Manut"
                width={160}
                height={80}
                className="transition-all"
                style={{ objectFit: 'contain' }}
              />
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
          {routes.map((route) =>
            isCollapsed ? (
              <Tooltip key={route.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={getRouteUrl(route.href)}
                    onClick={(e) => {
                      if (adminRoutes.includes(route.href)) {
                        e.preventDefault();
                        handleRouteClick(route.href);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-center mx-2 my-1 rounded-lg p-3 transition-all duration-200",
                      pathname === route.href
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {route.icon}
                    <span className="sr-only">{route.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                  {route.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              adminRoutes.includes(route.href) ? (
                <button
                  key={route.href}
                  onClick={() => handleRouteClick(route.href)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 mx-3 my-1 transition-all duration-200 text-sm font-medium",
                    pathname === route.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {route.icon}
                  <span className="truncate">{route.title}</span>
                </button>
              ) : (
                <Link
                  key={route.href}
                  href={getRouteUrl(route.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 mx-3 my-1 transition-all duration-200 text-sm font-medium",
                    pathname === route.href
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {route.icon}
                  <span className="truncate">{route.title}</span>
                </Link>
              )
            )
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
}