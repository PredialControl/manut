"use client";

import { Suspense } from "react";
import HeaderWrapper from "./HeaderWrapper";

interface HeaderWrapperSuspenseProps {
  isSidebarCollapsed: boolean;
}

export default function HeaderWrapperSuspense({ isSidebarCollapsed }: HeaderWrapperSuspenseProps) {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <HeaderWrapper isSidebarCollapsed={isSidebarCollapsed} />
    </Suspense>
  );
}
