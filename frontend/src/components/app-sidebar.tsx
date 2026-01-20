"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Code2,
  Mic,
  Brain,
  History,
  User,
  ChevronLeft,
  Command,
} from "lucide-react";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
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
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
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
        <NavUser user={{name:"Admin",email:"admin",avatar:""}} />
      </SidebarFooter>
    </Sidebar>
  )
}
