import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
    children?: React.ReactNode
    }

export default function Header({ children }: Props) {
  return (
    <header className="flex h-20 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
      <SidebarTrigger />
      <h1 className="text-lg font-semibold">Q3 Dashboard</h1>
      </div>
        {children}
    </header>
  )
}