import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardNav />
        <div className="flex flex-col flex-1">
          <header className="flex items-center h-14 px-4 border-b shrink-0">
            <SidebarToggle />
            {/* <h1 className="ml-4 text-lg font-semibold">Dashboarddd</h1> */}
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
