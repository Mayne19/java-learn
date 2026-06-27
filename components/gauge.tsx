import { cn } from "@/lib/utils"

interface Props {
  value: number
  size?: "tiny" | "small" | "medium" | "large"
  showValue?: boolean
  className?: string
}

const SIZES = {
  tiny:   { wh: 20, sw: 2.5, fs: 6  },
  small:  { wh: 32, sw: 3,   fs: 9  },
  medium: { wh: 48, sw: 4,   fs: 12 },
  large:  { wh: 64, sw: 5,   fs: 14 },
}

export function Gauge({ value, size = "small", showValue, className }: Props) {
  const { wh, sw, fs } = SIZES[size]
  const pct = Math.min(Math.max(Math.round(value), 0), 100)
  const r = (wh - sw) / 2
  const cx = wh / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  const arcColor = pct >= 70
    ? "var(--color-success)"
    : pct > 0
    ? "var(--color-warning)"
    : "var(--color-border)"

  return (
    <svg
      width={wh}
      height={wh}
      viewBox={`0 0 ${wh} ${wh}`}
      className={cn("-rotate-90", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      {/* Track */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={sw}
      />
      {/* Arc */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={arcColor}
        strokeWidth={sw}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
      />
      {/* Value label — counter-rotated to stay upright */}
      {showValue && (
        <text
          x={cx}
          y={cx}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fs}
          fill="var(--color-foreground)"
          fontFamily="var(--font-mono, monospace)"
          transform={`rotate(90, ${cx}, ${cx})`}
        >
          {pct}
        </text>
      )}
    </svg>
  )
}
