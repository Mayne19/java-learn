"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light",  Icon: Sun,     label: "Clair"  },
  { value: "system", Icon: Monitor, label: "Système" },
  { value: "dark",   Icon: Moon,    label: "Sombre"   },
] as const

interface Props {
  small?: boolean
}

export function ThemeSwitcher({ small }: Props) {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true))
  }, [])

  const currentTheme = mounted ? theme ?? "system" : "system"
  const resolvedLabel = mounted && resolvedTheme === "dark" ? "sombre" : "clair"
  const containerTitle = mounted
    ? `Thème ${currentTheme === "system" ? `système (${resolvedLabel})` : currentTheme}`
    : "Thème système"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/70 p-0.5 shadow-sm",
        small ? "h-8" : "h-9"
      )}
      title={containerTitle}
    >
      {OPTIONS.map(({ value, Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={mounted && value === "system" ? `Thème système, actuellement ${resolvedLabel}` : `Thème ${label.toLowerCase()}`}
          aria-pressed={currentTheme === value}
          title={mounted && value === "system" ? `Système (${resolvedLabel})` : label}
          className={cn(
            "relative inline-flex items-center justify-center rounded-full border border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            small
              ? "size-7"
              : "h-8 gap-1.5 px-3",
            currentTheme === value
              ? "border-border bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {!small && <span className="text-xs font-medium">{label}</span>}
        </button>
      ))}
    </div>
  )
}
