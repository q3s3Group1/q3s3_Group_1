import { Inter } from 'next/font/google'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'

import '@/app/globals.css'
import Header from './header'
import { SelectStartEndDate } from '@/components/SelectStartEndDate'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Q3 - Industrial Machine Monitoring',
  description: 'Advanced monitoring and analytics for industrial machinery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1 w-full">
            
              <main className="flex-1 w-full overflow-auto">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

