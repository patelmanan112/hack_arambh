import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "secondary"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary/10 text-primary-hover": variant === "default",
          "border-border text-foreground": variant === "outline",
          "border-transparent bg-surface text-foreground": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
