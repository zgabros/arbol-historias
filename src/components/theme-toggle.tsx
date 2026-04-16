'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`flex items-center justify-center rounded-full w-12 h-12 text-muted-foreground hover:text-primary transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      aria-label="Alternar modo oscuro/claro"
      title="Modo Oscuro / Claro"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-500" />
    </button>
  )
}
