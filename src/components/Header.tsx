"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarNav } from "@/components/SidebarNav";
import { Menu, User, Search, Bell } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getPageTitle, getPageSubtitle } from "@/lib/routes";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  contractName?: string;
  contractImage?: string;
}

export default function Header({ isSidebarCollapsed, contractName, contractImage }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const contractId = searchParams.get("contractId");
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle = getPageTitle(pathname);
  const pageSubtitle = getPageSubtitle(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 glass-effect px-6 shadow-sm backdrop-blur-md">
      {/* Mobile Menu */}
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarNav isCollapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Left Section - Page Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {(() => {
            const parts = pageTitle.split(" ");
            if (parts.length <= 1) return pageTitle;
            const lastPart = parts.pop();
            return (
              <>
                {parts.join(" ")}{" "}
                <span className="text-primary">{lastPart}</span>
              </>
            );
          })()}
        </h1>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Section - Contract Info, Notifications & User Menu */}
      <div className="flex items-center gap-3">
        {/* Contract Info */}
        {contractName && contractId && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-background/50 border border-white/10 shadow-inner">
              {contractImage ? (
                <Image
                  src={contractImage}
                  alt={contractName}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <Image
                  src="/logo.png.png"
                  alt={contractName}
                  fill
                  className="object-contain p-1"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-primary/80">Condomínio</span>
              <span className="text-sm font-medium text-foreground leading-tight tracking-tight">
                {contractName}
              </span>
            </div>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-lg hover:bg-secondary">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-[10px] border-0">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-lg hover:bg-secondary flex items-center gap-2 h-9 px-3"
              >
                <User className="h-4 w-4" />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-medium leading-none">{session.user.name || "Usuário"}</span>
                  <span className="text-[10px] leading-none text-muted-foreground truncate max-w-[120px]">
                    {session.user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user.name || "Usuário"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  {(session.user as any)?.role && (
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      {(session.user as any).role === "ADMIN" ? "Administrador" :
                        (session.user as any).role === "GESTOR" ? "Gestor" :
                          (session.user as any).role === "MANUTENCAO" ? "Manutenção" :
                            (session.user as any).role === "ACOMPANHAMENTO" ? "Acompanhamento" :
                              (session.user as any).role}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
