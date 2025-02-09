import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
  }
>(({ className, onCheckedChange, checked, ...props }, ref) => {
  return (
    <div className="relative inline-flex h-6 w-11 items-center rounded-full">
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        checked={checked}
        onChange={e => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span
        className={cn(
          "absolute inset-0 cursor-pointer rounded-full bg-gray-200 transition-colors peer-checked:bg-primary",
          className
        )}
      />
      <span
        className={cn(
          "absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"
        )}
      />
    </div>
  )
})
Switch.displayName = "Switch"

export { Switch } 