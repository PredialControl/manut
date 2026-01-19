import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarNav } from "./SidebarNav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-card transition-all duration-300 shadow-xl",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1">
        <SidebarNav isCollapsed={isCollapsed} />
      </div>
      <div className="border-t border-border p-3 bg-transparent">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="w-full justify-center hover:bg-white/60 hover:text-foreground transition-all duration-200 text-foreground"
        >
          {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
} 