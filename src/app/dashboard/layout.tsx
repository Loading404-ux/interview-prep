import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className='overflow-auto max-h-dvh'>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <div className="flex items-center justify-between h-full">
                            <div className="flex-1 max-w-md w-80">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search problems, topics..."
                                        className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
                <div className="overflow-auto max-h-dvh">
                    <ScrollArea className='overflow-auto h-full max-h-full'>
                        <main className="pb-8 px-4 lg:px-8 w-full max-w-6xl mx-auto">
                            {children}
                        </main>
                    </ScrollArea>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout