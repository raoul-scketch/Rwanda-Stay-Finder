import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border text-foreground",
    success: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
    destructive: "bg-destructive text-destructive-foreground",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
