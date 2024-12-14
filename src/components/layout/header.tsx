import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Logo } from "@/components/ui/logo"

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b backdrop-blur-md transition-all duration-300 border-border/40 bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-xl font-semibold">Status</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}