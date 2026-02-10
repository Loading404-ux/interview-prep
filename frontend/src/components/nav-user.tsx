"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Loader2Icon,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useBootstrapAuth } from "@/hooks/useBootstrapAuth"
import { Skeleton } from "./ui/skeleton"
export function NavUser() {
  const { user, loading } = useBootstrapAuth()
  const { isMobile } = useSidebar()
  const { signOut } = useAuth()
  const [pending, startTransaction] = useTransition()
  const route = useRouter()
  async function Logout() {
    startTransaction(async () => {
      await signOut()
      route.push("/")
    })
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">

                {!loading && user ?
                  <>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </>
                  :
                  <Skeleton className="h-8 w-8 rounded-lg" />
                }
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {!loading && user ?
                  <>
                    <span className="truncate font-medium ">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </>
                  :
                  <div className="grid flex-1">
                    <Skeleton className="h-4 max-w-[85%] flex-1 mb-1.5 rounded-sm" />
                    <Skeleton className="h-3 max-w-(--skeleton-width) flex-1 rounded-sm" />
                  </div>
                }
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => route.push("/dashboard/profile")}>
                <BadgeCheck />
                <Link href="">Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={loading}>
                <CreditCard />
                <Link href="#">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={loading}>
                <Bell />
                <Link href="#">Notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => Logout()} disabled={pending}>
              {loading ? <Loader2Icon className="animate-spin" /> : <LogOut />}
              <span >Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
