"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Code2,
  Mic,
  Brain,
  History,
  Terminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/store/user.store";

const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Coding Practice",
    url: "/dashboard/coding",
    icon: Code2,
  },
  {
    title: "HR Interview",
    url: "/dashboard/hr-interview",
    icon: Mic,
  },
  {
    title: "Aptitude & Quant",
    url: "/dashboard/aptitude",
    icon: Brain,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm">
                  <Terminal className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ThinkCode</span>
                  <span className="truncate text-xs">Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user?.name!, email: user?.email!, avatar: user?.avatar! }} />
      </SidebarFooter>
    </Sidebar>
  )
}
