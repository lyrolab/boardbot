"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/components/ui/breadcrumb/context"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/modules/core/components/ModeToggle"
import { Separator } from "@radix-ui/react-separator"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function BreadcrumbNav() {
  const { items } = useBreadcrumb()

  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.label + item.href}>
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BreadcrumbProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <BreadcrumbNav />
              <div className="flex-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <ModeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </QueryClientProvider>
  )
}
