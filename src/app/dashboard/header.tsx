import { SidebarTrigger } from "@/components/ui/sidebar";

interface Props {
    children?: React.ReactNode,
    title: string,
    description?: string
    }

export default function Header({ children, title, description }: Props) {
  return (
    <header className="flex flex-wrap py-2 min-h-20 md:h-20 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
      <SidebarTrigger />
      <div>
      <h1 className="text-lg font-semibold">
        {title}
      </h1>
      {
        description && (
          <p className="text-sm text-zinc-500">
            {description}
          </p>
        )
      }
      </div>
      </div>
        {children}
    </header>
  )
}