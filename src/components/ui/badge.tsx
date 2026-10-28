import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
        secondary:
          "border-border/80 bg-secondary/70 text-secondary-foreground hover:bg-secondary",
        violet:
          "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
        amber:
          "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
