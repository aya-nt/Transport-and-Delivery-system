"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 hover:bg-accent rounded-2xl transition-all hover:scale-110 active:scale-95 group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  )
}
