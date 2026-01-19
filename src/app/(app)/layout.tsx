"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/HeaderWrapper";
import Sidebar from "@/components/Sidebar";
import { DecorativeAvatar } from "@/components/DecorativeAvatar";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-transparent">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col">
        <HeaderWrapper isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <DecorativeAvatar />
      <Toaster richColors />
    </div>
  );
} 