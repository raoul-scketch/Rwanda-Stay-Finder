import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border-2 border-input bg-background hover:bg-muted hover:text-foreground",
      ghost: "hover:bg-muted hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-12 px-6 py-2 rounded-xl",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-14 rounded-2xl px-8 text-lg",
      icon: "h-10 w-10 rounded-xl",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-200 ease-out ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
