"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  text: string | string[]
  prompt?: boolean
  dark?: boolean
  onCopy?: () => void
  className?: string
}

export function Snippet({ text, prompt = true, dark, onCopy, className }: Props) {
  const [copied, setCopied] = useState(false)
  const lines = Array.isArray(text) ? text : [text]
  const copyText = lines.join("\n")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2 font-mono text-sm",
        dark
          ? "bg-foreground text-background border-transparent"
          : "bg-muted text-foreground border-border",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-0.5 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex min-w-max items-center gap-2">
            {prompt && (
              <span className={cn("select-none flex-shrink-0", dark ? "text-background/50" : "text-ring")}>
                $
              </span>
            )}
            <span>{line}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleCopy}
        aria-label="Copier"
        className={cn(
          "flex-shrink-0 transition-colors",
          dark
            ? "text-background/50 hover:text-background"
            : "text-muted-foreground hover:text-foreground",
          copied && "text-success"
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
