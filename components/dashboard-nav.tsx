"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, Home, Upload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Upload Files", href: "/dashboard/upload", icon: Upload },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <img
        src="logo-name-white.svg"
        alt="Mitratel Logo"
        className="w-full max-w-md p-5"
      />
      {/* <SidebarHeader className="flex items-center px-4 py-2">
        <h2 className="text-lg font-semibold text-white">
          FIBERIZATION DASHBOARD
        </h2>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4 text-white" />
                  <span className="text-white">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-white"
          asChild
        >
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
