"use client"

import * as React from 'react'
import {Bell, Calendar, Cog, Cpu, Home, Power, Shield, Wrench} from 'lucide-react'
import {usePathname} from 'next/navigation'

import {cn} from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/scroll-area'
import Link from 'next/link'

const menuItems = [
    {
        icon: Home,
        label: 'Dashboard',
        href: '/dashboard'
    },
    {
        icon: Cpu,
        label: 'Machines',
        href: '/dashboard/machines',
        subItems: [
            {label: 'Overview', href: '/dashboard/machines'},
            {label: 'Shots Timeline', href: '/dashboard/machines/timeline'},
        ]
    },
    // Molds
    {
        icon: Shield,
        label: 'Molds',
        href: '/dashboard/molds',
        subItems: [
            {label: 'Active molds', href: '/dashboard/molds'},
            {label: 'All molds', href: '/dashboard/molds/all'},
        ]
    },
    // planning
    {
        icon: Calendar,
        label: 'Onderhoud',
        href: '/dashboard/planning'
    },
    {
        icon: Bell,
        label: 'Alerts',
        href: '/dashboard/alerts',
        badge: 3
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar className="border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 h-20">
                <div className="flex items-center gap-2 px-6 py-4">
                    <Power className="h-8 w-8 text-blue-600"/>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Q3</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-[calc(100vh-5rem)]">
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                            pathname === item.href && "bg-zinc-100 dark:bg-zinc-800 font-medium"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5"/>
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <Badge variant="destructive" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                                {item.subItems && (
                                    <SidebarMenuSub>
                                        {item.subItems.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.href}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={pathname === subItem.href}
                                                >
                                                    <a href={subItem.href}>{subItem.label}</a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a
                                href="/settings"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                    pathname === '/settings' && "bg-zinc-100 dark:bg-zinc-800 font-medium"
                                )}
                            >
                                <Cog className="h-5 w-5"/>
                                <span>Settings</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="p-4">
                    <Link href="/factory">
                        <Button className="w-full" variant="outline">
                            <Wrench className="mr-2 h-4 w-4"/>
                            Factory View Mode
                        </Button>
                    </Link>
                </div>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}

