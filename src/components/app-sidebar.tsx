"use client"

import * as React from 'react'
import { Bell, Cog, Cpu, Shield, Wrench } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { LanguageSelector } from '@/components/LanguageSelector'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useUnreadNotifCount } from '@/hooks/useUnreadNotifCount'

// Menu items but with translation keys
const menuItems = [
  { 
    icon: Cpu, 
    label: 'nav.machines',            // Machines
    href: '/dashboard/machines',
    subItems: [
      { label: 'machines.all', href: '/dashboard/machines' },
      { label: 'machines.history', href: '/dashboard/machines/timeline' },
    ]
  },
  { 
    icon: Shield, 
    label: 'nav.molds',               // Matrijzen
    href: '/dashboard/molds',
    subItems: [
      { label: 'molds.lifetime', href: '/dashboard/molds' },
    ]
  },
  {
    icon: Wrench,
    label: 'nav.maintenance',         // Onderhoud
    href: '/dashboard/maintenance',
    subItems: [
      { label: 'maintenance.calendar', href: '/dashboard/maintenance' },
      { label: 'nav.mechanics', href: '/dashboard/maintenance/mechanics' },
      { label: 'milestones.title', href: '/dashboard/maintenance/milestones' },
    ]
  },
  { 
  icon: Bell, 
  label: 'nav.notifications',
  href: '/dashboard/notifications',
  // badge removed – handled dynamically in render
},

]

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const unreadNotifications = useUnreadNotifCount()


  return (
    <Sidebar className="border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 h-20">
        <div className="flex items-center gap-2 px-6 py-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        </div>
      </SidebarHeader>

      <LanguageSelector />

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
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.label)}</span>
                    </div>
                    {item.href === '/dashboard/notifications' && unreadNotifications > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadNotifications}
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
                          <a href={subItem.href}>
                            {t(subItem.label)}
                          </a>
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
                <Cog className="h-5 w-5" />
                <span>{t('nav.settings')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="p-4">
          <Link href="/factory">
            <Button className="w-full" variant="outline">
              <Wrench className="mr-2 h-4 w-4" />
              {t('nav.factoryView')}
            </Button>
          </Link>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
