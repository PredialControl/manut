"use client";

import { Suspense } from "react";
import Sidebar from "./Sidebar";

interface SidebarSuspenseProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function SidebarSuspense({ isCollapsed, toggleSidebar }: SidebarSuspenseProps) {
  return (
    <Suspense fallback={<div className="w-20" />}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
    </Suspense>
  );
}
