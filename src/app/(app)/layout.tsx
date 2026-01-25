"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderWrapperSuspense from "@/components/HeaderWrapperSuspense";
import SidebarSuspense from "@/components/SidebarSuspense";
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
      <SidebarSuspense
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col">
        <HeaderWrapperSuspense isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <DecorativeAvatar />
      <Toaster richColors />
    </div>
  );
} 