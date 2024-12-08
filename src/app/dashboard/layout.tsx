import {Inter} from 'next/font/google'
import {AppSidebar} from '@/components/app-sidebar'
import {SidebarInset, SidebarProvider, SidebarTrigger,} from '@/components/ui/sidebar'

import '@/app/globals.css'

const inter = Inter({subsets: ['latin']})

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
                <AppSidebar/>
                <SidebarInset className="flex-1 w-full">
                    <header
                        className="flex h-20 items-center gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <SidebarTrigger/>
                        <h1 className="text-lg font-semibold">Q3 Dashboard</h1>
                    </header>
                    <main className="flex-1 w-full overflow-auto">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
        </body>
        </html>
    )
}

