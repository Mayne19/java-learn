import { cn } from "@/lib/utils"

export type DotState = "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED"

const CONFIG: Record<DotState, { color: string; pulse: boolean; label: string }> = {
  QUEUED:   { color: "bg-muted-foreground", pulse: true,  label: "En attente"  },
  BUILDING: { color: "bg-warning",          pulse: true,  label: "En cours"    },
  READY:    { color: "bg-success",          pulse: false, label: "Maîtrisé"    },
  ERROR:    { color: "bg-destructive",      pulse: false, label: "Erreur"      },
  CANCELED: { color: "bg-muted-foreground", pulse: false, label: "Annulé"      },
}

interface Props {
  state: DotState
  label?: boolean
  className?: string
}

export function StatusDot({ state, label, className }: Props) {
  const { color, pulse, label: text } = CONFIG[state]

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              color
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
      </span>
      {label && <span className="text-xs text-muted-foreground">{text}</span>}
    </span>
  )
}
