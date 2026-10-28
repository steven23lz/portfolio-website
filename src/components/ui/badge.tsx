import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-primary/35 bg-primary/10 text-primary",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        brass:
          "border-[#d4a359]/35 bg-[#d4a359]/10 text-[#d4a359]",
        sage:
          "border-[#4d9375]/35 bg-[#4d9375]/10 text-[#4d9375]",
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
